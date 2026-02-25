import { config } from './config';
import type { ValidAnswer, Question } from './config';

export type { ValidAnswer, Question };

export const QUESTIONS: Question[] = config.questions;

export function getQuestionForRole(roleId: string): Question | undefined {
	return QUESTIONS.find((q) => q.roleId === roleId);
}
