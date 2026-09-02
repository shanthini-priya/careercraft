import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("demo123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@portfolioai.com" },
    update: {},
    create: {
      email: "demo@portfolioai.com",
      name: "Alex Johnson",
      password: hashedPassword,
      role: "user",
      avatarUrl: null,
    },
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      title: "Full Stack Developer",
      bio: "Passionate full stack developer with 5+ years of experience building modern web applications. I love working with React, Node.js, and cloud technologies to create seamless user experiences. Always eager to learn new technologies and take on challenging projects.",
    },
  });

  console.log(`Created profile for: ${profile.title}`);

  const skills = [
    { name: "JavaScript", category: "Frontend", proficiency: 5 },
    { name: "TypeScript", category: "Frontend", proficiency: 4 },
    { name: "React", category: "Frontend", proficiency: 5 },
    { name: "Next.js", category: "Frontend", proficiency: 4 },
    { name: "HTML/CSS", category: "Frontend", proficiency: 5 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 4 },
    { name: "Node.js", category: "Backend", proficiency: 5 },
    { name: "Express.js", category: "Backend", proficiency: 4 },
    { name: "Python", category: "Backend", proficiency: 3 },
    { name: "PostgreSQL", category: "Backend", proficiency: 4 },
    { name: "MongoDB", category: "Backend", proficiency: 3 },
    { name: "GraphQL", category: "Backend", proficiency: 3 },
    { name: "Git", category: "Tools", proficiency: 5 },
    { name: "Docker", category: "Tools", proficiency: 3 },
    { name: "AWS", category: "Tools", proficiency: 3 },
    { name: "Figma", category: "Tools", proficiency: 2 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: { profileId: profile.id, ...skill },
    });
  }

  console.log(`Created ${skills.length} skills`);

  const projects = [
    {
      name: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform with user authentication, product management, shopping cart, payment integration with Stripe, and admin dashboard. Built with Next.js for the frontend and Node.js/Express for the backend API.",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
      githubUrl: "https://github.com/alexjohnson/ecommerce",
      liveUrl: "https://ecommerce-demo.vercel.app",
      featured: true,
      order: 0,
    },
    {
      name: "Task Management App",
      description:
        "Collaborative project management tool with real-time updates using WebSockets, drag-and-drop boards, team collaboration features, and detailed analytics dashboard.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
      githubUrl: "https://github.com/alexjohnson/taskmanager",
      liveUrl: "https://taskmanager-demo.vercel.app",
      featured: true,
      order: 1,
    },
    {
      name: "Weather Dashboard",
      description:
        "Interactive weather dashboard with 7-day forecasts, interactive maps, location search, and weather alerts. Uses OpenWeatherMap API with a clean, responsive UI.",
      technologies: ["React", "OpenWeatherMap API", "Chart.js", "CSS Modules"],
      githubUrl: "https://github.com/alexjohnson/weather-dash",
      liveUrl: "https://weather-dash.vercel.app",
      featured: false,
      order: 2,
    },
    {
      name: "AI Content Generator",
      description:
        "SaaS application that uses AI to generate blog posts, social media content, and marketing copy. Features include content templates, history tracking, and export options.",
      technologies: ["Next.js", "OpenAI API", "Prisma", "PostgreSQL", "Vercel"],
      githubUrl: "https://github.com/alexjohnson/ai-content",
      liveUrl: "https://ai-content-demo.vercel.app",
      featured: true,
      order: 3,
    },
    {
      name: "Social Media Dashboard",
      description:
        "Analytics dashboard for managing and tracking social media accounts across multiple platforms. Features include post scheduling, engagement metrics, and audience insights.",
      technologies: ["React", "D3.js", "Node.js", "Redis", "REST API"],
      githubUrl: "https://github.com/alexjohnson/social-dashboard",
      featured: false,
      order: 4,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: { profileId: profile.id, ...project },
    });
  }

  console.log(`Created ${projects.length} projects`);

  const education = [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startYear: 2017,
      endYear: 2021,
      gpa: "3.8",
    },
    {
      institution: "Stanford Online",
      degree: "Professional Certificate",
      fieldOfStudy: "Full Stack Web Development",
      startYear: 2021,
      endYear: 2022,
    },
  ];

  for (const edu of education) {
    await prisma.education.create({
      data: { profileId: profile.id, ...edu },
    });
  }

  console.log(`Created ${education.length} education entries`);

  const experience = [
    {
      company: "TechStart Inc.",
      position: "Senior Frontend Developer",
      description:
        "Led the frontend architecture for a SaaS platform serving 50k+ users. Implemented micro-frontend architecture, reducing load times by 40%. Mentored 3 junior developers and conducted code reviews for the frontend team.",
      startDate: new Date("2023-01-15"),
      current: true,
    },
    {
      company: "Digital Agency Co.",
      position: "Full Stack Developer",
      description:
        "Developed and maintained 15+ client projects ranging from small business websites to enterprise web applications. Implemented CI/CD pipelines and automated testing, improving deployment frequency by 300%.",
      startDate: new Date("2021-06-01"),
      endDate: new Date("2022-12-31"),
      current: false,
    },
    {
      company: "CodeCraft Labs",
      position: "Junior Developer",
      description:
        "Built responsive web interfaces using React and implemented RESTful APIs with Node.js. Participated in agile development processes and contributed to open-source projects.",
      startDate: new Date("2020-03-01"),
      endDate: new Date("2021-05-15"),
      current: false,
    },
  ];

  for (const exp of experience) {
    await prisma.experience.create({
      data: { profileId: profile.id, ...exp },
    });
  }

  console.log(`Created ${experience.length} experience entries`);

  const certifications = [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      dateObtained: new Date("2023-08-15"),
      url: "https://aws.amazon.com/certification",
    },
    {
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta",
      dateObtained: new Date("2022-11-20"),
      url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    },
    {
      name: "MongoDB Certified Developer Associate",
      issuer: "MongoDB University",
      dateObtained: new Date("2022-06-10"),
      url: "https://university.mongodb.com/certification",
    },
  ];

  for (const cert of certifications) {
    await prisma.certification.create({
      data: { profileId: profile.id, ...cert },
    });
  }

  console.log(`Created ${certifications.length} certifications`);

  const portfolio = await prisma.portfolio.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      templateId: "modern-developer",
      published: false,
      sections: {
        create: [
          {
            type: "hero",
            title: "Hero Section",
            content: {
              greeting: "Hello, I'm",
              name: user.name,
              tagline: "Full Stack Developer",
              subtitle: "Building modern web experiences with clean code and creative design",
            },
            visible: true,
            order: 0,
          },
          {
            type: "about",
            title: "About Me",
            content: {
              intro:
                "I'm a passionate developer who loves turning complex problems into simple, elegant solutions.",
              highlights: [
                "5+ years of web development experience",
                "Expert in React, Node.js, and cloud technologies",
                "Strong focus on user experience and performance",
                "Active contributor to open-source projects",
              ],
            },
            visible: true,
            order: 1,
          },
          {
            type: "skills",
            title: "Skills & Technologies",
            content: {
              showCategories: true,
              displayStyle: "grid",
            },
            visible: true,
            order: 2,
          },
          {
            type: "projects",
            title: "Featured Projects",
            content: {
              showAll: false,
              maxProjects: 4,
              layout: "grid",
            },
            visible: true,
            order: 3,
          },
          {
            type: "contact",
            title: "Get In Touch",
            content: {
              heading: "Let's Work Together",
              message:
                "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
              showForm: true,
            },
            visible: true,
            order: 4,
          },
        ],
      },
    },
  });

  console.log(`Created portfolio with ${portfolio.templateId} template`);

  const scores = [
    { score: 45, tips: ["Complete your profile", "Add more skills"] },
    { score: 58, tips: ["Add project descriptions", "Add work experience"] },
    { score: 67, tips: ["Publish your portfolio", "Add certifications"] },
    { score: 73, tips: ["Add quantifiable achievements", "Optimize keywords"] },
    { score: 82, tips: ["Great progress! Add a professional photo", "Keep building projects"] },
  ];

  for (let i = 0; i < scores.length; i++) {
    const daysAgo = (scores.length - i) * 3;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    await prisma.scoreHistory.create({
      data: {
        userId: user.id,
        score: scores[i].score,
        breakdown: {
          profileCompleteness: scores[i].score - 5 + Math.floor(Math.random() * 10),
          contentQuality: scores[i].score - 10 + Math.floor(Math.random() * 15),
          keywordOptimization: scores[i].score - 3 + Math.floor(Math.random() * 8),
          visualAppeal: scores[i].score + Math.floor(Math.random() * 10),
          recruiterReadiness: scores[i].score - 2 + Math.floor(Math.random() * 8),
        },
        tips: scores[i].tips,
        createdAt: date,
      },
    });
  }

  console.log(`Created ${scores.length} score history entries`);

  const activities = [
    {
      type: "profile_updated",
      description: "Updated professional title to Full Stack Developer",
      metadata: { field: "title", oldValue: null, newValue: "Full Stack Developer" },
    },
    {
      type: "project_added",
      description: 'Added project "E-Commerce Platform"',
      metadata: { projectName: "E-Commerce Platform", technologies: ["Next.js", "Node.js"] },
    },
    {
      type: "score_update",
      description: "Portfolio score improved to 82",
      metadata: { score: 82, previousScore: 73 },
    },
    {
      type: "content_generated",
      description: "Generated AI-enhanced resume",
      metadata: { type: "resume", atsScore: 88 },
    },
    {
      type: "skill_added",
      description: "Added 3 new skills: Docker, AWS, Figma",
      metadata: { skills: ["Docker", "AWS", "Figma"] },
    },
  ];

  for (let i = 0; i < activities.length; i++) {
    const daysAgo = activities.length - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - i);

    await prisma.activity.create({
      data: {
        userId: user.id,
        ...activities[i],
        createdAt: date,
      },
    });
  }

  console.log(`Created ${activities.length} activity entries`);

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      emailNotifications: true,
      scoreUpdates: true,
      aiSuggestions: true,
      weeklyReport: false,
      portfolioVisibility: "public",
      profileVisibility: "public",
    },
  });

  console.log("Created default user settings");

  console.log("\nSeed completed successfully!");
  console.log("Demo user credentials:");
  console.log("  Email: demo@portfolioai.com");
  console.log("  Password: demo123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
