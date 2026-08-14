"use client";

import { FormEvent, useState } from "react";

const example = `{
  "questions": [
    {
      "categoryId": "mathematics",
      "question": "What is 12 × 8?",
      "answer": "96",
      "acceptedAnswers": ["ninety-six"],
      "explanation": "12 multiplied by 8 equals 96.",
      "difficulty": "easy",
      "active": true
    }
  ]
}`;

type CreatedQuestion = { id: string; question: string };

export default function AdminPage() {
  const [value, setValue] = useState(example);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState<CreatedQuestion[]>([]);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setCreated([]);
    try { JSON.parse(value); } catch { setMessage("Enter valid JSON before submitting."); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/questions", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-dashboard-password": password }, body: value });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error?.message ?? "Questions could not be saved.");
      setCreated(data.data ?? []);
      setMessage(`${data.data?.length ?? 0} question${data.data?.length === 1 ? "" : "s"} added successfully.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Questions could not be saved."); }
    finally { setSaving(false); }
  }

  return <main className="admin-page">
    <header className="admin-header"><a className="brand" href="/"><i>✦</i> nexora</a><span>ADMINISTRATION</span></header>
    <section className="admin-card">
      <p className="eyebrow">QUESTION IMPORT</p>
      <h1>Add questions and answers.</h1>
      <p className="admin-copy">Paste up to 50 questions in the JSON format below. Answers are saved only on the server and are never exposed during a quiz.</p>
      <form onSubmit={submit}>
        <label className="field-label" htmlFor="admin-password">ADMINISTRATOR PASSWORD</label>
        <input id="admin-password" className="name-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        <label className="field-label" htmlFor="question-json">JSON PAYLOAD</label>
        <textarea id="question-json" value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} aria-describedby="json-help" />
        <p id="json-help" className="admin-help">Use a seeded category ID: <code>mathematics</code>, <code>coding</code>, or <code>computer-science</code>. Difficulty is <code>easy</code>, <code>medium</code>, <code>hard</code>, or <code>expert</code>. <code>acceptedAnswers</code>, <code>explanation</code>, and <code>active</code> are optional.</p>
        <button className="primary-button" disabled={saving || !password} type="submit">{saving ? "Saving…" : "Add questions"}<span>→</span></button>
      </form>
      {message && <p className={`admin-message ${created.length ? "success" : "error"}`}>{message}</p>}
      {!!created.length && <ul className="created-list">{created.map((question) => <li key={question.id}><code>{question.id}</code>{question.question}</li>)}</ul>}
    </section>
  </main>;
}
