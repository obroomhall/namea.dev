import type { Question } from '$lib/data/questions';

export interface MatchResult {
	correct: boolean;
	canonical?: string;
}

function normalize(input: string): string {
	return input.trim().toLowerCase();
}

function sortedWords(s: string): string {
	return normalize(s).split(/\s+/).sort().join(' ');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(input: string): boolean {
	return UUID_RE.test(input.trim());
}

// ASCII control characters: code → [canonical, ...aliases]
const ASCII_CONTROL: Record<number, string[]> = {
	0: ['NUL', 'null'],
	1: ['SOH', 'start of heading'],
	2: ['STX', 'start of text'],
	3: ['ETX', 'end of text'],
	4: ['EOT', 'end of transmission'],
	5: ['ENQ', 'enquiry'],
	6: ['ACK', 'acknowledge'],
	7: ['BEL', 'bell'],
	8: ['BS', 'backspace'],
	9: ['TAB', 'ht', 'horizontal tab'],
	10: ['LF', 'linefeed', 'line feed', 'newline'],
	11: ['VT', 'vertical tab'],
	12: ['FF', 'form feed'],
	13: ['CR', 'carriage return'],
	14: ['SO', 'shift out'],
	15: ['SI', 'shift in'],
	16: ['DLE', 'data link escape'],
	17: ['DC1'],
	18: ['DC2'],
	19: ['DC3'],
	20: ['DC4'],
	21: ['NAK'],
	22: ['SYN', 'synchronous idle'],
	23: ['ETB', 'end of transmission block'],
	24: ['CAN', 'cancel'],
	25: ['EM', 'end of medium'],
	26: ['SUB', 'substitute'],
	27: ['ESC', 'escape'],
	28: ['FS', 'file separator'],
	29: ['GS', 'group separator'],
	30: ['RS', 'record separator'],
	31: ['US', 'unit separator'],
	127: ['DEL', 'delete']
};

// Printable character aliases (for symbols/punctuation)
const ASCII_ALIASES: Record<number, string[]> = {
	32: ['space', 'sp'],
	33: ['exclamation', 'exclamation mark', 'bang'],
	34: ['double quote', 'quotation mark', 'quote'],
	35: ['hash', 'number sign', 'pound', 'octothorpe'],
	36: ['dollar', 'dollar sign'],
	37: ['percent', 'percent sign'],
	38: ['ampersand', 'and'],
	39: ['apostrophe', 'single quote'],
	40: ['open paren', 'left parenthesis', 'left paren'],
	41: ['close paren', 'right parenthesis', 'right paren'],
	42: ['asterisk', 'star'],
	43: ['plus', 'plus sign'],
	44: ['comma'],
	45: ['hyphen', 'minus', 'dash'],
	46: ['period', 'dot', 'full stop'],
	47: ['slash', 'forward slash', 'solidus'],
	58: ['colon'],
	59: ['semicolon', 'semi colon'],
	60: ['less than', 'left angle bracket', 'lt'],
	61: ['equals', 'equal sign', 'equal'],
	62: ['greater than', 'right angle bracket', 'gt'],
	63: ['question mark'],
	64: ['at', 'at sign', 'at symbol'],
	91: ['open bracket', 'left bracket', 'left square bracket'],
	92: ['backslash', 'back slash'],
	93: ['close bracket', 'right bracket', 'right square bracket'],
	94: ['caret', 'circumflex', 'hat'],
	95: ['underscore', 'underline'],
	96: ['backtick', 'grave', 'grave accent'],
	123: ['open brace', 'left brace', 'left curly brace'],
	124: ['pipe', 'vertical bar'],
	125: ['close brace', 'right brace', 'right curly brace'],
	126: ['tilde']
};

function validateAscii(input: string): MatchResult {
	const trimmed = input.trim();
	if (!trimmed) return { correct: false };

	// Find the number in the input (supports "65 A" or "A 65")
	const numMatch = trimmed.match(/\b(\d+)\b/);
	if (!numMatch) return { correct: false };

	const code = parseInt(numMatch[1], 10);
	if (code < 0 || code > 127) return { correct: false };

	// Extract description (everything except the matched number)
	const desc = (trimmed.slice(0, numMatch.index) + trimmed.slice(numMatch.index! + numMatch[0].length))
		.trim()
		.toLowerCase();

	if (code <= 31 || code === 127) {
		const ctrl = ASCII_CONTROL[code];
		if (desc && !ctrl.some((n) => n.toLowerCase() === desc)) return { correct: false };
		return { correct: true, canonical: `${code} — ${ctrl[0]}` };
	}

	const char = String.fromCharCode(code);
	if (desc) {
		const aliases = ASCII_ALIASES[code] || [];
		if (desc !== char.toLowerCase() && desc !== char && !aliases.includes(desc)) {
			return { correct: false };
		}
	}

	const label = code === 32 ? 'Space' : char;
	return { correct: true, canonical: `${code} — ${label}` };
}

function isValidBrainfuckWithOutput(input: string): boolean {
	const program = input.trim();
	if (!program) return false;
	// Only allow valid brainfuck characters
	const valid = /^[><+\-.,[\]]+$/;
	if (!valid.test(program)) return false;
	// Must contain at least one '.' (output instruction)
	if (!program.includes('.')) return false;
	// Check balanced brackets
	let depth = 0;
	for (const ch of program) {
		if (ch === '[') depth++;
		if (ch === ']') depth--;
		if (depth < 0) return false;
	}
	return depth === 0;
}

type ValidatorFn = (input: string) => MatchResult;

const VALIDATORS: Record<string, ValidatorFn> = {
	uuid: (input: string) => {
		if (isValidUuid(input)) {
			return { correct: true, canonical: input.trim().toLowerCase() };
		}
		return { correct: false };
	},
	brainfuck: (input: string) => {
		if (isValidBrainfuckWithOutput(input)) {
			return { correct: true, canonical: input.trim() };
		}
		return { correct: false };
	},
	ascii: validateAscii
};

export function checkAnswer(question: Question, input: string): MatchResult {
	const trimmed = input.trim();
	if (!trimmed) return { correct: false };

	// Custom validator (e.g. uuid, brainfuck)
	if (question.validator) {
		const validate = VALIDATORS[question.validator];
		if (validate) {
			return validate(trimmed);
		}
	}

	// Standard accept-list matching
	const normalized = normalize(trimmed);
	const inputWords = sortedWords(trimmed);
	for (const answer of question.answers) {
		if (
			answer.accept.some(
				(a) => normalize(a) === normalized || (inputWords.includes(' ') && sortedWords(a) === inputWords)
			)
		) {
			return { correct: true, canonical: answer.canonical };
		}
	}

	return { correct: false };
}

export function getExampleAnswer(question: Question): string {
	if (question.exampleAnswer) return question.exampleAnswer;
	return question.answers[0].canonical;
}
