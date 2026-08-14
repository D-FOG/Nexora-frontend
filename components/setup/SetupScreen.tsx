import { categories, questions } from "@/lib/questions";
import { CategoryId } from "../game/types";

interface Props { playerName: string; onNameChange: (name: string) => void; categoryId: CategoryId; onCategoryChange: (id: CategoryId) => void; timeLimit: number; onTimeChange: (seconds: number) => void; onStart: (count: number) => void; }
export function SetupScreen({ playerName, onNameChange, categoryId, onCategoryChange, timeLimit, onTimeChange, onStart }: Props) {
  const available = questions.filter((item) => item.category === categoryId).length;
  const [count, setCount] = useState(5);
  return <section className="panel setup-panel"><span className="brand"><i>✦</i> nexora</span><div className="step"><span>01</span><hr /><span>02</span><hr /><span>03</span></div><p className="eyebrow">LET&apos;S SET THE STAGE</p><h2>Ready when you are<span>.</span></h2><label className="field-label">WHAT SHOULD WE CALL YOU?</label><input className="name-input" value={playerName} onChange={(event) => onNameChange(event.target.value)} placeholder="Enter your name" maxLength={30} autoFocus />
  <label className="field-label">CHOOSE YOUR ARENA</label><div className="category-grid">{categories.map((category) => <button key={category.id} className={`category-option ${category.color} ${categoryId === category.id ? "selected" : ""}`} onClick={() => onCategoryChange(category.id)}><b>{category.icon}</b><span>{category.name}</span><small>{category.description}</small><i>✓</i></button>)}</div>
  <div className="config-row"><div><label className="field-label">QUESTIONS</label><div className="pill-group">{[5, 10].map((option) => <button key={option} className={count === option ? "active" : ""} onClick={() => setCount(option)}>{option}</button>)}</div></div><div><label className="field-label">TIME PER QUESTION</label><div className="pill-group">{[15, 30, 45, 60].map((option) => <button key={option} className={timeLimit === option ? "active" : ""} onClick={() => onTimeChange(option)}>{option}s</button>)}</div></div></div><p className="availability">{available} unique questions available in this arena.</p><button disabled={!playerName.trim()} className="primary-button start-button" onClick={() => onStart(count)}>Start quiz <span>→</span></button></section>;
}
"use client";

import { useState } from "react";
