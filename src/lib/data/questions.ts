export interface ValidAnswer {
	canonical: string;
	accept: string[];
}

export interface Question {
	roleId: string;
	prompt: string;
	answers: ValidAnswer[];
	docsUrl?: string;
}

export const QUESTIONS: Question[] = [
	{
		roleId: 'student',
		prompt: 'Name a programming language.',
		answers: [
			{ canonical: 'JavaScript', accept: ['javascript', 'js'] },
			{ canonical: 'Python', accept: ['python', 'py'] },
			{ canonical: 'Java', accept: ['java'] },
			{ canonical: 'C', accept: ['c'] },
			{ canonical: 'C++', accept: ['c++', 'cpp', 'c plus plus'] },
			{ canonical: 'C#', accept: ['c#', 'csharp', 'c sharp'] },
			{ canonical: 'TypeScript', accept: ['typescript', 'ts'] },
			{ canonical: 'Ruby', accept: ['ruby', 'rb'] },
			{ canonical: 'Go', accept: ['go', 'golang'] },
			{ canonical: 'Rust', accept: ['rust', 'rs'] },
			{ canonical: 'Swift', accept: ['swift'] },
			{ canonical: 'Kotlin', accept: ['kotlin', 'kt'] },
			{ canonical: 'PHP', accept: ['php'] },
			{ canonical: 'Scala', accept: ['scala'] },
			{ canonical: 'Perl', accept: ['perl'] },
			{ canonical: 'Haskell', accept: ['haskell'] },
			{ canonical: 'Lua', accept: ['lua'] },
			{ canonical: 'R', accept: ['r'] },
			{ canonical: 'MATLAB', accept: ['matlab'] },
			{ canonical: 'Elixir', accept: ['elixir'] },
			{ canonical: 'Erlang', accept: ['erlang'] },
			{ canonical: 'Clojure', accept: ['clojure'] },
			{ canonical: 'Dart', accept: ['dart'] },
			{ canonical: 'Objective-C', accept: ['objective-c', 'objc', 'objective c', 'obj-c'] },
			{ canonical: 'Assembly', accept: ['assembly', 'asm'] },
			{ canonical: 'COBOL', accept: ['cobol'] },
			{ canonical: 'Fortran', accept: ['fortran'] },
			{ canonical: 'Lisp', accept: ['lisp'] },
			{ canonical: 'Scheme', accept: ['scheme'] },
			{ canonical: 'Prolog', accept: ['prolog'] },
			{ canonical: 'SQL', accept: ['sql'] },
			{ canonical: 'Bash', accept: ['bash', 'sh', 'shell'] },
			{ canonical: 'PowerShell', accept: ['powershell', 'pwsh'] },
			{ canonical: 'F#', accept: ['f#', 'fsharp', 'f sharp'] },
			{ canonical: 'OCaml', accept: ['ocaml'] },
			{ canonical: 'Zig', accept: ['zig'] },
			{ canonical: 'Nim', accept: ['nim'] },
			{ canonical: 'Julia', accept: ['julia'] },
			{ canonical: 'V', accept: ['v', 'vlang'] },
			{ canonical: 'Pascal', accept: ['pascal'] },
			{ canonical: 'BASIC', accept: ['basic'] },
			{ canonical: 'Groovy', accept: ['groovy'] },
			{ canonical: 'Brainfuck', accept: ['brainfuck', 'brainf*ck'] },
			{ canonical: 'Smalltalk', accept: ['smalltalk'] },
			{ canonical: 'Ada', accept: ['ada'] },
			{ canonical: 'D', accept: ['d', 'dlang'] },
			{ canonical: 'Racket', accept: ['racket'] },
			{ canonical: 'Crystal', accept: ['crystal'] },
			{ canonical: 'Gleam', accept: ['gleam'] },
			{ canonical: 'Roc', accept: ['roc'] }
		],
		docsUrl: 'https://en.wikipedia.org/wiki/List_of_programming_languages'
	},
	{
		roleId: 'intern',
		prompt: 'Name an HTTP status code.',
		answers: [
			{ canonical: '100 Continue', accept: ['100', '100 continue'] },
			{ canonical: '101 Switching Protocols', accept: ['101', '101 switching protocols'] },
			{ canonical: '200 OK', accept: ['200', '200 ok'] },
			{ canonical: '201 Created', accept: ['201', '201 created'] },
			{ canonical: '204 No Content', accept: ['204', '204 no content'] },
			{ canonical: '301 Moved Permanently', accept: ['301', '301 moved permanently'] },
			{ canonical: '302 Found', accept: ['302', '302 found'] },
			{ canonical: '304 Not Modified', accept: ['304', '304 not modified'] },
			{ canonical: '307 Temporary Redirect', accept: ['307', '307 temporary redirect'] },
			{ canonical: '308 Permanent Redirect', accept: ['308', '308 permanent redirect'] },
			{ canonical: '400 Bad Request', accept: ['400', '400 bad request'] },
			{ canonical: '401 Unauthorized', accept: ['401', '401 unauthorized'] },
			{ canonical: '403 Forbidden', accept: ['403', '403 forbidden'] },
			{ canonical: '404 Not Found', accept: ['404', '404 not found', 'not found'] },
			{ canonical: '405 Method Not Allowed', accept: ['405', '405 method not allowed'] },
			{ canonical: '408 Request Timeout', accept: ['408', '408 request timeout'] },
			{ canonical: '409 Conflict', accept: ['409', '409 conflict'] },
			{ canonical: '410 Gone', accept: ['410', '410 gone'] },
			{ canonical: '418 I\'m a Teapot', accept: ['418', '418 im a teapot', "418 i'm a teapot", '418 teapot'] },
			{ canonical: '422 Unprocessable Entity', accept: ['422', '422 unprocessable entity'] },
			{ canonical: '429 Too Many Requests', accept: ['429', '429 too many requests'] },
			{ canonical: '451 Unavailable For Legal Reasons', accept: ['451', '451 unavailable for legal reasons'] },
			{ canonical: '500 Internal Server Error', accept: ['500', '500 internal server error'] },
			{ canonical: '502 Bad Gateway', accept: ['502', '502 bad gateway'] },
			{ canonical: '503 Service Unavailable', accept: ['503', '503 service unavailable'] },
			{ canonical: '504 Gateway Timeout', accept: ['504', '504 gateway timeout'] }
		],
		docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'
	},
	{
		roleId: 'junior',
		prompt: 'Name a JavaScript primitive type.',
		answers: [
			{ canonical: 'string', accept: ['string'] },
			{ canonical: 'number', accept: ['number'] },
			{ canonical: 'boolean', accept: ['boolean', 'bool'] },
			{ canonical: 'undefined', accept: ['undefined'] },
			{ canonical: 'null', accept: ['null'] },
			{ canonical: 'bigint', accept: ['bigint', 'big int'] },
			{ canonical: 'symbol', accept: ['symbol'] }
		],
		docsUrl: 'https://developer.mozilla.org/en-US/docs/Glossary/Primitive'
	},
	{
		roleId: 'mid',
		prompt: 'Name an HTTP request method.',
		answers: [
			{ canonical: 'GET', accept: ['get'] },
			{ canonical: 'POST', accept: ['post'] },
			{ canonical: 'PUT', accept: ['put'] },
			{ canonical: 'DELETE', accept: ['delete'] },
			{ canonical: 'PATCH', accept: ['patch'] },
			{ canonical: 'HEAD', accept: ['head'] },
			{ canonical: 'OPTIONS', accept: ['options'] },
			{ canonical: 'TRACE', accept: ['trace'] },
			{ canonical: 'CONNECT', accept: ['connect'] }
		],
		docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods'
	},
	{
		roleId: 'senior',
		prompt: 'Name a design pattern.',
		answers: [
			{ canonical: 'Singleton', accept: ['singleton'] },
			{ canonical: 'Factory', accept: ['factory', 'factory method', 'abstract factory'] },
			{ canonical: 'Observer', accept: ['observer'] },
			{ canonical: 'Strategy', accept: ['strategy'] },
			{ canonical: 'Decorator', accept: ['decorator'] },
			{ canonical: 'Adapter', accept: ['adapter'] },
			{ canonical: 'Facade', accept: ['facade', 'façade'] },
			{ canonical: 'Proxy', accept: ['proxy'] },
			{ canonical: 'Command', accept: ['command'] },
			{ canonical: 'Iterator', accept: ['iterator'] },
			{ canonical: 'Builder', accept: ['builder'] },
			{ canonical: 'Prototype', accept: ['prototype'] },
			{ canonical: 'Bridge', accept: ['bridge'] },
			{ canonical: 'Composite', accept: ['composite'] },
			{ canonical: 'Flyweight', accept: ['flyweight'] },
			{ canonical: 'Chain of Responsibility', accept: ['chain of responsibility', 'cor'] },
			{ canonical: 'Mediator', accept: ['mediator'] },
			{ canonical: 'Memento', accept: ['memento'] },
			{ canonical: 'State', accept: ['state'] },
			{ canonical: 'Template Method', accept: ['template method', 'template'] },
			{ canonical: 'Visitor', accept: ['visitor'] },
			{ canonical: 'MVC', accept: ['mvc', 'model view controller', 'model-view-controller'] },
			{ canonical: 'MVVM', accept: ['mvvm', 'model view viewmodel', 'model-view-viewmodel'] },
			{ canonical: 'Repository', accept: ['repository'] },
			{ canonical: 'Pub/Sub', accept: ['pub/sub', 'pubsub', 'pub sub', 'publish subscribe', 'publish-subscribe'] }
		],
		docsUrl: 'https://refactoring.guru/design-patterns/catalog'
	},
	{
		roleId: 'staff',
		prompt: 'Name a sorting algorithm.',
		answers: [
			{ canonical: 'Quicksort', accept: ['quicksort', 'quick sort'] },
			{ canonical: 'Merge Sort', accept: ['merge sort', 'mergesort'] },
			{ canonical: 'Bubble Sort', accept: ['bubble sort', 'bubblesort'] },
			{ canonical: 'Insertion Sort', accept: ['insertion sort', 'insertionsort'] },
			{ canonical: 'Selection Sort', accept: ['selection sort', 'selectionsort'] },
			{ canonical: 'Heap Sort', accept: ['heap sort', 'heapsort'] },
			{ canonical: 'Radix Sort', accept: ['radix sort', 'radixsort'] },
			{ canonical: 'Counting Sort', accept: ['counting sort', 'countingsort'] },
			{ canonical: 'Bucket Sort', accept: ['bucket sort', 'bucketsort'] },
			{ canonical: 'Tim Sort', accept: ['tim sort', 'timsort'] },
			{ canonical: 'Shell Sort', accept: ['shell sort', 'shellsort'] },
			{ canonical: 'Bogosort', accept: ['bogosort', 'bogo sort'] },
			{ canonical: 'Sleep Sort', accept: ['sleep sort', 'sleepsort'] },
			{ canonical: 'Pancake Sort', accept: ['pancake sort', 'pancakesort'] },
			{ canonical: 'Gnome Sort', accept: ['gnome sort', 'gnomesort'] },
			{ canonical: 'Cocktail Sort', accept: ['cocktail sort', 'cocktailsort', 'cocktail shaker sort'] },
			{ canonical: 'Comb Sort', accept: ['comb sort', 'combsort'] },
			{ canonical: 'Tree Sort', accept: ['tree sort', 'treesort'] }
		],
		docsUrl: 'https://en.wikipedia.org/wiki/Sorting_algorithm'
	},
	{
		roleId: 'principal',
		prompt: 'Name an HTTP request header.',
		answers: [
			{ canonical: 'Accept', accept: ['accept'] },
			{ canonical: 'Accept-Encoding', accept: ['accept-encoding', 'accept encoding'] },
			{ canonical: 'Accept-Language', accept: ['accept-language', 'accept language'] },
			{ canonical: 'Authorization', accept: ['authorization', 'auth'] },
			{ canonical: 'Cache-Control', accept: ['cache-control', 'cache control'] },
			{ canonical: 'Content-Type', accept: ['content-type', 'content type'] },
			{ canonical: 'Content-Length', accept: ['content-length', 'content length'] },
			{ canonical: 'Cookie', accept: ['cookie'] },
			{ canonical: 'Host', accept: ['host'] },
			{ canonical: 'Origin', accept: ['origin'] },
			{ canonical: 'Referer', accept: ['referer', 'referrer'] },
			{ canonical: 'User-Agent', accept: ['user-agent', 'user agent', 'useragent'] },
			{ canonical: 'If-None-Match', accept: ['if-none-match', 'if none match'] },
			{ canonical: 'If-Modified-Since', accept: ['if-modified-since', 'if modified since'] },
			{ canonical: 'X-Forwarded-For', accept: ['x-forwarded-for', 'x forwarded for'] },
			{ canonical: 'X-Requested-With', accept: ['x-requested-with', 'x requested with'] },
			{ canonical: 'Connection', accept: ['connection'] },
			{ canonical: 'DNT', accept: ['dnt', 'do not track', 'do-not-track'] },
			{ canonical: 'Upgrade', accept: ['upgrade'] },
			{ canonical: 'Range', accept: ['range'] },
			{ canonical: 'ETag', accept: ['etag', 'e-tag'] },
			{ canonical: 'Sec-Fetch-Mode', accept: ['sec-fetch-mode', 'sec fetch mode'] }
		],
		docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers'
	},
	{
		roleId: 'mass',
		prompt: 'Name a CSS length unit.',
		answers: [
			{ canonical: 'px', accept: ['px', 'pixel', 'pixels'] },
			{ canonical: 'em', accept: ['em'] },
			{ canonical: 'rem', accept: ['rem'] },
			{ canonical: '%', accept: ['%', 'percent', 'percentage'] },
			{ canonical: 'vw', accept: ['vw'] },
			{ canonical: 'vh', accept: ['vh'] },
			{ canonical: 'vmin', accept: ['vmin'] },
			{ canonical: 'vmax', accept: ['vmax'] },
			{ canonical: 'ch', accept: ['ch'] },
			{ canonical: 'ex', accept: ['ex'] },
			{ canonical: 'cm', accept: ['cm', 'centimeter', 'centimeters'] },
			{ canonical: 'mm', accept: ['mm', 'millimeter', 'millimeters'] },
			{ canonical: 'in', accept: ['in', 'inch', 'inches'] },
			{ canonical: 'pt', accept: ['pt', 'point', 'points'] },
			{ canonical: 'pc', accept: ['pc', 'pica', 'picas'] },
			{ canonical: 'fr', accept: ['fr'] },
			{ canonical: 'dvh', accept: ['dvh'] },
			{ canonical: 'svh', accept: ['svh'] },
			{ canonical: 'lvh', accept: ['lvh'] },
			{ canonical: 'cqi', accept: ['cqi'] },
			{ canonical: 'cqb', accept: ['cqb'] },
			{ canonical: 'lh', accept: ['lh'] },
			{ canonical: 'rlh', accept: ['rlh'] }
		],
		docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/length'
	},
	{
		roleId: 'gravitational-constant',
		prompt: 'Name a well-known RFC by number.',
		answers: [
			{ canonical: 'RFC 791 — Internet Protocol', accept: ['791', 'rfc 791', 'rfc791'] },
			{ canonical: 'RFC 793 — TCP', accept: ['793', 'rfc 793', 'rfc793'] },
			{ canonical: 'RFC 2616 — HTTP/1.1', accept: ['2616', 'rfc 2616', 'rfc2616'] },
			{ canonical: 'RFC 7231 — HTTP/1.1 Semantics', accept: ['7231', 'rfc 7231', 'rfc7231'] },
			{ canonical: 'RFC 7540 — HTTP/2', accept: ['7540', 'rfc 7540', 'rfc7540'] },
			{ canonical: 'RFC 9110 — HTTP Semantics', accept: ['9110', 'rfc 9110', 'rfc9110'] },
			{ canonical: 'RFC 2119 — Requirement Levels', accept: ['2119', 'rfc 2119', 'rfc2119'] },
			{ canonical: 'RFC 1918 — Private Addresses', accept: ['1918', 'rfc 1918', 'rfc1918'] },
			{ canonical: 'RFC 822 — Email Format', accept: ['822', 'rfc 822', 'rfc822'] },
			{ canonical: 'RFC 2822 — Internet Message Format', accept: ['2822', 'rfc 2822', 'rfc2822'] },
			{ canonical: 'RFC 5322 — Internet Message Format', accept: ['5322', 'rfc 5322', 'rfc5322'] },
			{ canonical: 'RFC 3986 — URI Syntax', accept: ['3986', 'rfc 3986', 'rfc3986'] },
			{ canonical: 'RFC 4122 — UUID', accept: ['4122', 'rfc 4122', 'rfc4122'] },
			{ canonical: 'RFC 7519 — JWT', accept: ['7519', 'rfc 7519', 'rfc7519'] },
			{ canonical: 'RFC 6749 — OAuth 2.0', accept: ['6749', 'rfc 6749', 'rfc6749'] },
			{ canonical: 'RFC 1035 — DNS', accept: ['1035', 'rfc 1035', 'rfc1035'] },
			{ canonical: 'RFC 2549 — IP over Avian Carriers', accept: ['2549', 'rfc 2549', 'rfc2549'] },
			{ canonical: 'RFC 1149 — IP over Avian Carriers', accept: ['1149', 'rfc 1149', 'rfc1149'] },
			{ canonical: 'RFC 6455 — WebSocket', accept: ['6455', 'rfc 6455', 'rfc6455'] },
			{ canonical: 'RFC 2818 — HTTP Over TLS', accept: ['2818', 'rfc 2818', 'rfc2818'] },
			{ canonical: 'RFC 8446 — TLS 1.3', accept: ['8446', 'rfc 8446', 'rfc8446'] }
		],
		docsUrl: 'https://www.rfc-editor.org/rfc-index.html'
	},
	{
		roleId: 'cpu',
		prompt: 'Name a valid UUID.',
		answers: [
			// This is a special question — any valid UUID format is accepted
			// We handle this via a custom validator, not the accept list
		],
		docsUrl: 'https://en.wikipedia.org/wiki/Universally_unique_identifier'
	},
	{
		roleId: 'dev-null',
		prompt: 'Name a valid brainfuck program that produces output.',
		answers: [
			// Another special question — validated by format checking
		],
		docsUrl: 'https://en.wikipedia.org/wiki/Brainfuck'
	}
];

export function getQuestionForRole(roleId: string): Question | undefined {
	return QUESTIONS.find((q) => q.roleId === roleId);
}
