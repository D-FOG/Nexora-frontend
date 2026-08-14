export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type CategoryId = "mathematics" | "coding" | "computer-science";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  question: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  difficulty: Difficulty;
}

export interface AnswerRecord {
  question: Question;
  answer: string;
  status: "correct" | "incorrect" | "unanswered";
  elapsedSeconds: number;
}
