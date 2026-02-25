import quizConfig from './quiz-config.json';

export interface ValidAnswer {
	canonical: string;
	accept: string[];
}

export interface Question {
	roleId: string;
	prompt: string;
	answers: ValidAnswer[];
	validator?: string;
	exampleAnswer?: string;
	docsUrl?: string;
}

export interface Role {
	id: string;
	label: string;
	absurd?: boolean;
}

export interface Commentary {
	perfect: string;
	zero: string;
	noRole: string;
	overAchievedFar: string;
	overAchievedClose: string;
	exact: string;
	underAchievedFar: string;
	underAchievedClose: string;
	absurd: string;
	fallback: string;
}

export interface Branding {
	title: string;
	titleAccent: string;
	titleSuffix: string;
	description: string;
	promptPrefix: string;
}

export interface QuizConfig {
	branding: Branding;
	roles: Role[];
	actualRoles: string[];
	questions: Question[];
	commentary: Commentary;
}

export const config: QuizConfig = quizConfig as QuizConfig;
