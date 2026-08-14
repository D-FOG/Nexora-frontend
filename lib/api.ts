import { Category, Difficulty, Question } from "@/components/game/types";
const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } }); if (!response.ok) { const body = await response.json().catch(() => ({})) as { error?: { message?: string } }; throw new Error(body.error?.message ?? "The server could not complete that request."); } return response.json() as Promise<T>; }
export type StartResponse = { sessionId: string; player: { id: string; name: string }; category: { id: string; name: string }; questionCount: number; timePerQuestionSeconds: number; questions: Question[]; startedAt: string };
export type AnswerResponse = { questionId: string; status: "correct" | "incorrect" | "unanswered"; pointsAwarded: number; score: number; correctAnswer: string; explanation?: string; answeredAt: string };
export type AdvanceResponse = { questionStartedAt: string };
export type CompleteResponse = { sessionId: string; status: "completed"; score: number; maxScore: number; correct: number; incorrect: number; unanswered: number; accuracy: number; totalTimeSeconds: number; completedAt: string };
export async function getCategories() { return (await request<{ data: Array<Category & { questionCount: number }> }>("/categories")).data; }
export function startQuiz(input: { playerName: string; categoryId: string; questionCount: number; timePerQuestionSeconds: number; difficulty: Difficulty | "mixed" }) { return request<StartResponse>("/quiz/start", { method: "POST", body: JSON.stringify(input) }); }
export function answerQuiz(sessionId: string, questionId: string, answer: string) { return request<AnswerResponse>(`/quiz/${sessionId}/answer`, { method: "POST", body: JSON.stringify({ questionId, answer, clientSubmittedAt: new Date().toISOString() }) }); }
export function advanceQuiz(sessionId: string) { return request<AdvanceResponse>(`/quiz/${sessionId}/next`, { method: "POST" }); }
export function completeQuiz(sessionId: string) { return request<CompleteResponse>(`/quiz/${sessionId}/complete`, { method: "POST", body: JSON.stringify({ clientCompletedAt: new Date().toISOString() }) }); }
export function quitQuiz(sessionId: string) { return request<CompleteResponse>(`/quiz/${sessionId}/quit`, { method: "POST" }); }
