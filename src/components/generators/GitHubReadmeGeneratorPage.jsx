import { useState } from "react";
import C from "../../constants/colors";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Btn from "../ui/Btn";

const fieldStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0",
  fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fff",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

function GitHubReadmeGeneratorPage() {
  const [username, setUsername] = useState("your-username");
  const [repos, setRepos] = useState(["my-portfolio", "ecommerce-app", "task-manager"]);
  const [repoInput, setRepoInput] = useState("");

  const addRepo = () => { if (repoInput.trim() && !repos.includes(repoInput.trim())) setRepos(prev => [...prev, repoInput.trim()]); setRepoInput(""); };
  const removeRepo = (r) => setRepos(prev => prev.filter(x => x !== r));

  const markdown = `# Hi there, I'm @${username} 👋

## 👨‍💻 About Me
I'm a passionate software developer focused on building elegant, scalable web applications. I love exploring new technologies and solving real-world problems.

## 🚀 Tech Stack
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📌 Featured Projects
${repos.map(r => `- **[${r}](https://github.com/${username}/${r})** — A project that demonstrates my skills in building real-world applications.`).join("\n")}

## 🌱 Currently Learning
- Advanced React patterns and performance optimization
- Cloud deployment with AWS
- System design fundamentals

## 📫 Contact
- GitHub: [@${username}](https://github.com/${username})
- Email: ${username}@example.com
`;

  const copyMd = () => { try { navigator.clipboard.writeText(markdown); } catch (e) {} };

  const renderMarkdown = () => (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.6, fontSize: 14, color: "#24292F" }}>
      <h1 style={{ fontSize: 24, borderBottom: "1px solid #E1E4E8", paddingBottom: 8 }}>Hi there, I'm @{username} 👋</h1>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>👨‍💻 About Me</h2>
      <p>I'm a passionate software developer focused on building elegant, scalable web applications. I love exploring new technologies and solving real-world problems.</p>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>🚀 Tech Stack</h2>
      <p style={{ fontFamily: "monospace", background: "#F6F8FA", padding: 12, borderRadius: 6 }}>React · Node.js · Python · JavaScript</p>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>📌 Featured Projects</h2>
      {repos.map(r => (
        <div key={r} style={{ marginLeft: 16, marginBottom: 4 }}>• <b>{r}</b> — A project that demonstrates my skills</div>
      ))}
      <h2 style={{ fontSize: 18, marginTop: 16 }}>🌱 Currently Learning</h2>
      <div style={{ marginLeft: 16 }}>• Advanced React patterns and performance optimization</div>
      <div style={{ marginLeft: 16 }}>• Cloud deployment with AWS & System design</div>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>📫 Contact</h2>
      <p>GitHub: <a style={{ color: "#0366D6" }}>@{username}</a> · Email: {username}@example.com</p>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>GitHub README Generator</h1>
          <p style={{ color: "#94A3B8", fontSize: 14, margin: 0 }}>Generate a professional profile README for GitHub.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={copyMd}>📋 Copy Markdown</Btn>
          <Btn onClick={copyMd}>Generate</Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <Card>
            <label style={labelStyle}>GitHub Username</label>
            <input style={{ ...fieldStyle, marginBottom: 16 }} value={username} onChange={e => setUsername(e.target.value)}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Repositories to Highlight</label>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={fieldStyle} placeholder="repo-name" value={repoInput} onChange={e => setRepoInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addRepo(); }}/>
              <button onClick={addRepo} style={{ padding: "0 16px", borderRadius: 10, background: C.indigo[600], color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {repos.map(r => (
                <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.indigo[50], color: C.indigo[800], padding: "6px 12px", borderRadius: 999, fontSize: 12 }}>
                  {r}
                  <button onClick={() => removeRepo(r)} style={{ background: "none", border: "none", cursor: "pointer", color: C.indigo[800], fontSize: 13 }}>✕</button>
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
              Generated sections: About Me, Tech Stack, Featured Projects, Currently Learning, Contact.
            </div>
          </Card>
        </div>

        <div>
          <Badge color="teal">Live Markdown Preview</Badge>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E1E4E8", padding: 28, marginTop: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", fontFamily: "monospace", whiteSpace: "pre-wrap", fontSize: 12, maxHeight: 480, overflowY: "auto" }}>
            {markdown}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitHubReadmeGeneratorPage;