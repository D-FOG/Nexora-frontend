"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, questions } from "@/lib/questions";
import { answersMatch, chooseQuestions } from "@/lib/quiz";
import { AnswerRecord, CategoryId, Question } from "./types";
import { SetupScreen } from "../setup/SetupScreen";
import { QuizScreen } from "./QuizScreen";
import { ResultsScreen } from "../results/ResultsScreen";

type Screen = "landing" | "setup" | "quiz" | "results";

export function QuizGame() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [playerName, setPlayerName] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("mathematics");
  const [timeLimit, setTimeLimit] = useState(30);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [remaining, setRemaining] = useState(30);
  const [startedAt, setStartedAt] = useState(0);

  const category = categories.find((item) => item.id === categoryId)!;
  const current = activeQuestions[index];
  const score = records.filter((record) => record.status === "correct").length * 10;

  useEffect(() => {
    if (screen !== "quiz") return;
    setRemaining(timeLimit);
  }, [index, screen, timeLimit]);

  useEffect(() => {
    if (screen !== "quiz" || !current || records[index]) return;
    if (remaining <= 0) { submitAnswer(""); return; }
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  // submitAnswer deliberately changes with quiz state; the timer is reset for each index.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, screen, current, records, index]);

  function startQuiz(count: number) {
    const pool = questions.filter((question) => question.category === categoryId);
    setActiveQuestions(chooseQuestions(pool, count));
    setRecords([]); setIndex(0); setStartedAt(Date.now()); setScreen("quiz");
  }

  function submitAnswer(answer: string) {
    if (!current || records[index]) return;
    const status = !answer.trim() ? "unanswered" : answersMatch(answer, current) ? "correct" : "incorrect";
    const record = { question: current, answer, status, elapsedSeconds: timeLimit - remaining } satisfies AnswerRecord;
    setRecords((items) => [...items, record]);
  }

  // Feedback is rendered by QuizScreen while the record count catches up with the question index.
  const advance = () => {
    if (index + 1 >= activeQuestions.length) setScreen("results");
    else setIndex((value) => value + 1);
  };

  const elapsed = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
  const view = useMemo(() => {
    if (screen === "landing") return <Landing onPlay={() => setScreen("setup")} />;
    if (screen === "setup") return <SetupScreen playerName={playerName} onNameChange={setPlayerName} categoryId={categoryId} onCategoryChange={setCategoryId} timeLimit={timeLimit} onTimeChange={setTimeLimit} onStart={startQuiz} />;
    if (screen === "quiz" && current) return <QuizScreen playerName={playerName} category={category} question={current} questionNumber={index + 1} total={activeQuestions.length} score={score} remaining={remaining} timeLimit={timeLimit} feedback={records[index]} onSubmit={submitAnswer} onNext={advance} />;
    return <ResultsScreen playerName={playerName} category={category} records={records} totalTime={elapsed} onPlayAgain={() => setScreen("setup")} onHome={() => setScreen("landing")} />;
  }, [screen, playerName, categoryId, timeLimit, activeQuestions, index, records, remaining, score, elapsed]);
  return <main className="app-shell">{view}</main>;
}

function Landing({ onPlay }: { onPlay: () => void }) {
  return <section className="landing"><nav><span className="brand"><i>✦</i> nexora</span><span className="nav-tag">KNOWLEDGE GAME</span></nav><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="landing-copy"><p className="eyebrow">LEVEL UP YOUR MIND</p><h1>Think fast.<br /><em>Learn more.</em><br />Become sharper.</h1><p className="hero-text">A high-energy knowledge game built for curious minds. Pick a subject, beat the clock, and find your next personal best.</p><button className="primary-button" onClick={onPlay}>Play now <span>→</span></button><p className="mini-proof"><b>3</b> subjects <span>•</span> <b>36+</b> questions <span>•</span> endless rounds</p></div><div className="floating-card card-math"><b>∑</b><span>Mathematics</span><small>12 questions</small></div><div className="floating-card card-code"><b>&lt;/&gt;</b><span>Coding</span><small>12 questions</small></div><div className="floating-card card-cs"><b>◈</b><span>Computer Science</span><small>12 questions</small></div></section>;
}
