/**
 * AI Provider Adapter Layer for PortfolioAI
 * Seamlessly integrates Live LLM APIs (OpenAI / Gemini / Custom)
 * with automatic fallback to high-fidelity Offline Mock Mode.
 */

import { getSettings } from '../storage.js';
import {
  mockGenerateSummary,
  mockEnhanceProjectBullets,
  mockEnhanceExperienceBullets,
  mockRecommendSkills,
  mockAnalyzeAtsScore,
  mockQuantifyBullet,
  hasQuantifiableMetric
} from './mock.js';
import {
  SYSTEM_PROMPTS,
  buildSummaryPrompt,
  buildProjectBulletsPrompt,
  buildExperienceBulletsPrompt,
  buildSkillRecommendationsPrompt
} from './prompts.js';

/**
 * Dispatches status updates to the UI so users know whether
 * Live AI or Offline Mock is currently serving their request.
 */
function notifyAiStatus(mode, message) {
  window.dispatchEvent(
    new CustomEvent('portfolio-ai-status', {
      detail: { mode, message, timestamp: Date.now() }
    })
  );
}

/**
 * Execute request against OpenAI or compatible API endpoint
 */
async function callOpenAiCompatible(apiKey, endpoint, model, systemPrompt, userPrompt) {
  const url = endpoint ? `${endpoint.replace(/\/+$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  return {
    content,
    metadata: {
      provider: `OpenAI (${model || 'gpt-4o-mini'})`,
      model: data.model,
      tokensUsed: data.usage?.total_tokens || 0
    }
  };
}

/**
 * Execute request against Google Gemini REST API
 */
async function callGemini(apiKey, model, systemPrompt, userPrompt) {
  const modelName = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return {
    content,
    metadata: {
      provider: `Google Gemini (${modelName})`,
      model: modelName
    }
  };
}

/**
 * Core dispatching function: attempts Live AI if configured,
 * otherwise gracefully falls back to Offline Mock Mode without throwing.
 */
async function executeAiGeneration(systemPrompt, userPrompt, mockFallbackFn) {
  const settings = getSettings();
  const isMockSelected = settings.provider === 'mock' || !settings.apiKey;

  if (isMockSelected) {
    notifyAiStatus('mock', 'Served via Offline Mock Engine');
    // Simulate slight natural human response time (350ms)
    await new Promise(res => setTimeout(res, 350));
    return mockFallbackFn();
  }

  try {
    notifyAiStatus('live', `Contacting ${settings.provider.toUpperCase()} API...`);
    
    let result;
    if (settings.provider === 'gemini') {
      result = await callGemini(settings.apiKey, settings.modelName, systemPrompt, userPrompt);
    } else {
      // Default to OpenAI / OpenAI-compatible
      result = await callOpenAiCompatible(
        settings.apiKey,
        settings.apiEndpoint,
        settings.modelName,
        systemPrompt,
        userPrompt
      );
    }

    notifyAiStatus('live', `Generated successfully via ${result.metadata.provider}`);
    return result;
  } catch (error) {
    console.warn('Live AI call failed, automatically falling back to Offline Mock Mode:', error.message);
    notifyAiStatus('fallback', `Live API unavailable (${error.message}). Switched to Offline Mock Mode.`);
    
    // Smooth fallback without crashing user's workflow
    const fallbackResult = mockFallbackFn();
    fallbackResult.metadata = {
      ...fallbackResult.metadata,
      fallbackNotice: `Switched to offline mode: ${error.message}`
    };
    return fallbackResult;
  }
}

/**
 * Public Adapter Methods
 */

export async function generateSummary(profile) {
  const prompt = buildSummaryPrompt(profile);
  const result = await executeAiGeneration(
    SYSTEM_PROMPTS.SUMMARY_WRITER,
    prompt,
    () => mockGenerateSummary(profile)
  );

  return result;
}

export async function enhanceProjectBullets(project, targetRole = 'Software Engineer') {
  const prompt = buildProjectBulletsPrompt(project, targetRole);
  const result = await executeAiGeneration(
    SYSTEM_PROMPTS.CAREER_ARCHITECT,
    prompt,
    () => mockEnhanceProjectBullets(project, targetRole)
  );

  // If live text returned raw bullet string, parse it into array
  if (result.content && !result.bullets) {
    const parsedBullets = result.content
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 5);
    result.bullets = parsedBullets.length > 0 ? parsedBullets : [result.content];
  }

  return result;
}

export async function enhanceExperienceBullets(experience, targetRole = 'Software Engineer') {
  const prompt = buildExperienceBulletsPrompt(experience, targetRole);
  const result = await executeAiGeneration(
    SYSTEM_PROMPTS.CAREER_ARCHITECT,
    prompt,
    () => mockEnhanceExperienceBullets(experience, targetRole)
  );

  if (result.content && !result.bullets) {
    const parsedBullets = result.content
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 5);
    result.bullets = parsedBullets.length > 0 ? parsedBullets : [result.content];
  }

  return result;
}

export async function recommendSkills(targetRole, currentSkills = []) {
  const prompt = buildSkillRecommendationsPrompt(targetRole, currentSkills);
  const result = await executeAiGeneration(
    SYSTEM_PROMPTS.CAREER_ARCHITECT,
    prompt,
    () => mockRecommendSkills(targetRole, currentSkills)
  );

  if (result.content && !result.suggestedSkills) {
    try {
      const parsed = JSON.parse(result.content.replace(/```json|```/g, ''));
      if (Array.isArray(parsed)) {
        result.suggestedSkills = parsed;
      }
    } catch {
      result.suggestedSkills = result.content
        .split(/[,\n]/)
        .map(s => s.replace(/["'\[\]-]/g, '').trim())
        .filter(Boolean);
    }
  }

  return result;
}

export function analyzeAtsScore(profile) {
  // Pure local fast evaluator
  return mockAnalyzeAtsScore(profile);
}

/**
 * Automatically identifies all project and experience bullets lacking
 * quantifiable metrics and enriches them with realistic metrics and results.
 */
export function autoQuantifyAllBullets(profile) {
  const updated = JSON.parse(JSON.stringify(profile));
  const targetRole = profile.personal?.targetRole || 'Software Engineer';
  let count = 0;

  if (Array.isArray(updated.projects)) {
    updated.projects.forEach((proj, pIdx) => {
      if (Array.isArray(proj.bullets)) {
        proj.bullets = proj.bullets.map((b, bIdx) => {
          if (!hasQuantifiableMetric(b)) {
            count++;
            return mockQuantifyBullet(b, targetRole, pIdx * 2 + bIdx);
          }
          return b;
        });
      }
    });
  }

  if (Array.isArray(updated.experience)) {
    updated.experience.forEach((exp, eIdx) => {
      if (Array.isArray(exp.bullets)) {
        exp.bullets = exp.bullets.map((b, bIdx) => {
          if (!hasQuantifiableMetric(b)) {
            count++;
            return mockQuantifyBullet(b, targetRole, eIdx * 2 + bIdx);
          }
          return b;
        });
      }
    });
  }

  return { updatedProfile: updated, quantifiedCount: count };
}

export { mockQuantifyBullet, hasQuantifiableMetric };

/**
 * Improve/quantify an individual bullet point
 */
export async function improveBullet(bullet, role = 'Software Engineer', settings = null) {
  if (!bullet || !bullet.trim()) return bullet;
  return mockQuantifyBullet(bullet, role);
}

/**
 * Recommend skills categorised for a given role
 */
export async function recommendSkillsForRole(role = 'Software Engineer', currentSkills = {}, settings = null) {
  const currentList = [
    ...(currentSkills?.technical || []),
    ...(currentSkills?.frameworks || []),
    ...(currentSkills?.tools || []),
    ...(currentSkills?.soft || [])
  ];
  const res = await recommendSkills(role, currentList);
  const pool = res?.suggestedSkills || [];

  return {
    technical: pool.slice(0, 3),
    frameworks: pool.slice(3, 5),
    tools: pool.slice(5, 7),
    soft: ['Agile Collaboration', 'System Design', 'Code Reviews']
  };
}

/**
 * Test user's API Key configuration
 */
export async function testConnection(settings) {
  if (settings.provider === 'mock' || !settings.apiKey) {
    return {
      success: true,
      provider: 'Offline Mock Engine',
      message: 'Offline Mock Mode is fully functional. No network or API key required!'
    };
  }

  try {
    const start = performance.now();
    if (settings.provider === 'gemini') {
      await callGemini(
        settings.apiKey,
        settings.modelName,
        'Respond with one word.',
        'Say "OK".'
      );
    } else {
      await callOpenAiCompatible(
        settings.apiKey,
        settings.apiEndpoint,
        settings.modelName,
        'Respond with one word.',
        'Say "OK".'
      );
    }
    const latency = Math.round(performance.now() - start);
    return {
      success: true,
      provider: settings.provider,
      message: `Connection verified! Latency: ${latency}ms`
    };
  } catch (err) {
    return {
      success: false,
      provider: settings.provider,
      message: `Connection failed: ${err.message}`
    };
  }
}
