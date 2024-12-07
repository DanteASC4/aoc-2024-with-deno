import { red, bold, underline, magenta } from "@std/fmt/colors";
import { readInpLines } from "../utils/files.ts";

type Dir = "ul" | "u" | "ur" | "l" | "r" | "dl" | "d" | "dr";

// Proof of concept, works!
const checkTL = (
	full: string,
	search: string,
	from: number,
	rowlen: number,
) => {
	const offset = rowlen + 1;
	let partial = "";
	let isMatching = true;
	let nextIdx = from;
	let iter = 1;

	do {
		partial += full[nextIdx];
		if (partial.length === search.length) return partial === search; // Handy stop condition
		const part = search.substring(0, iter);
		console.log(
			"Does ",
			underline(partial),
			"match the same len from search, which is",
			underline(part),
		);
		isMatching = partial === search.substring(0, iter);
		iter++;
		nextIdx -= offset;
	} while (isMatching && nextIdx < 0 === false);
};

const calcOffset = (dir: Dir, rowlen: number) => {
	switch (dir) {
		case "ul":
			return -(rowlen + 1);
		case "u":
			return -rowlen;
		case "ur":
			return -(rowlen - 1);
		case "l":
			return -1;
		case "r":
			return 1;
		case "dl":
			return rowlen - 1;
		case "d":
			return rowlen;
		case "dr":
			return rowlen + 1;
		default:
			break;
	}
};

const getValidDirections = (
	from: number,
	wordlen: number,
	rowlen: number,
	maxrow: number,
) => {
	const dirs: Dir[] = [];

	// 0-based!
	const row = (from - (from % rowlen)) / rowlen;
	const col = from % rowlen;

	//console.log(
	//	`Pos: ${yellow(from.toString())} -> row-${bgYellow(black(row.toString()))} col-${bgYellow(black(col.toString()))}`,
	//);

	const cangoU = row < wordlen - 1 === false;
	const cangoD = row > maxrow - wordlen + 1 === false;
	const cangoL = col < wordlen - 1 === false;
	const cangoR = col > rowlen - wordlen === false;

	if (cangoU) {
		dirs.push("u");
		if (cangoR) dirs.push("ur");
		if (cangoL) dirs.push("ul");
	}

	if (cangoD) {
		dirs.push("d");
		if (cangoR) dirs.push("dr");
		if (cangoL) dirs.push("dl");
	}

	if (cangoL) dirs.push("l");
	if (cangoR) dirs.push("r");

	return dirs;
};

const checkDir = (
	full: string,
	search: string,
	from: number,
	rowlen: number,
	dir: Dir,
) => {
	const offset = calcOffset(dir, rowlen);
	if (!offset) {
		console.warn("Could not calc offset for dir: ", dir);
		return;
	}
	//console.log(
	//	`Offset from ${from} towards ${underline(dir)} is ${blue(String(offset))}`,
	//);

	let partial = "";
	let isMatching = true;
	let nextIdx = from;
	let iter = 1;
	const maxIter = search.length;

	do {
		const nextC = full[nextIdx];
		partial += nextC;
		if (partial.length === search.length) return partial === search; // Handy stop condition
		const part = search.substring(0, iter);
		//console.log(
		//	"Does ",
		//	underline(partial),
		//	"match the same len from search, which is",
		//	underline(part),
		//);
		isMatching = partial === part;
		//console.log(
		//	`${underline(truePartial)} === ${underline(part)} -> ${magenta(String(isMatching))}`,
		//);
		iter++;
		nextIdx += offset;
	} while (isMatching && iter <= maxIter);
};

const checkSquare = (
	full: string,
	from: number,
	rowlen: number,
	maxrow: number,
) => {
	// Bounds check:

	const row = (from - (from % rowlen)) / rowlen;
	const col = from % rowlen;

	if (row === 0 || row === maxrow) return false;
	//if (row < 1 || row > maxrow - 1) {
	//	console.log(`Skipping row ${underline(String(row))} from ${from}`);
	//	return false;
	//}

	if (col === 0 || col === rowlen - 1) return false;
	//if (col < 1 || col > rowlen - 1) {
	//	console.log(`Skipping col ${underline(String(col))} from ${from}`);
	//	return false;
	//}

	const c = full[from];
	if (c !== "A") {
		return false;
	}

	const ulo = calcOffset("ul", rowlen);
	if (!ulo) {
		console.log("no ulo!");
		return false;
	}
	const uro = calcOffset("ur", rowlen);
	if (!uro) {
		console.log("no uro!");
		return false;
	}
	const dlo = calcOffset("dl", rowlen);
	if (!dlo) {
		console.log("no dlo!");
		return false;
	}
	const dro = calcOffset("dr", rowlen);
	if (!dro) {
		console.log("no dro!");
		return false;
	}

	const ul = full[from + ulo];
	const ur = full[from + uro];
	const dl = full[from + dlo];
	const dr = full[from + dro];

	// If ul is M then dr must be S
	// If ur is M then dl must be S
	// If dl is M then ur must be S
	// If dr is M then ul must be S
	//
	// ul -> dr || dr -> ul && ur -> dl || dl -> ur

	if (ul !== "M" && dr !== "M") return false; // One must be M
	if (ur !== "M" && dl !== "M") return false;

	const ulTodr = ul + c + dr;
	const drToul = dr + c + ul;
	const uldrMas = ulTodr === "MAS" || drToul === "MAS";

	const urTodl = ur + c + dl;
	const dlTour = dl + c + ur;
	const urdlMas = urTodl === "MAS" || dlTour === "MAS";

	const isValid = uldrMas && urdlMas;

	//if (isValid) {
	//	console.log(`Found at ${underline(String(from))}`);
	//}

	return isValid;
};

const _checkAllDirs = (
	full: string,
	search: string,
	from: number,
	rowlen: number,
) => {
	return [
		checkDir(full, search, from, rowlen, "ul"),
		checkDir(full, search, from, rowlen, "u"),
		checkDir(full, search, from, rowlen, "ur"),
		checkDir(full, search, from, rowlen, "l"),
		checkDir(full, search, from, rowlen, "r"),
		checkDir(full, search, from, rowlen, "dl"),
		checkDir(full, search, from, rowlen, "d"),
		checkDir(full, search, from, rowlen, "dr"),
	];
};

const checkDirs = (
	full: string,
	search: string,
	from: number,
	rowlen: number,
	dirsToCheck: Dir[],
) => {
	const results: { [k in Dir]?: true } = {};
	for (const direction of dirsToCheck) {
		const chk = checkDir(full, search, from, rowlen, direction);
		if (chk) {
			results[direction] = true;
		}
	}
	return results;
};

/*
A better way to do this if anything would probably be to search all rows, columns & diagonals for the string forwards and back with a regex.
*/

export async function d4part1() {
	const lines = await readInpLines("d4.txt");
	if (!lines) {
		console.log(red(bold("[D4P1] No input!")));
		return;
	}
	for (const line of lines) {
		console.log(line);
	}
	const lenny = lines[0].length;
	const mrow = lines.length - 1;

	const searchingFor = "XMAS";
	const searchLen = searchingFor.length;
	const wordsearch = lines.join("");

	let matches = 0;
	for (let i = 0; i < wordsearch.length; i++) {
		const isValidStart = wordsearch[i] === searchingFor[0];

		if (isValidStart) {
			const searchDirs = getValidDirections(i, searchLen, lenny, mrow);
			const checks = checkDirs(wordsearch, searchingFor, i, lenny, searchDirs);
			const found = Object.values(checks).filter((c) => c === true);
			console.log(i, checks);
			matches += found.length;
		}
	}

	console.log(`Found ${magenta(bold(String(matches)))} matches!`);
}

/*
Real
Found at 12
Found at 26
Found at 27
Found at 32
Found at 34
Found at 71
Found at 73
Found at 75
Found at 77

Bad
Found at 12
Found at 26
Found at 27
Found at 32
Found at 34
Found at 71
Found at 73
Found at 75
Found at 77
Found at 79
*/

export async function d4part2() {
	const lines = await readInpLines("d4.txt");
	if (!lines) {
		console.log(red(bold("[D4P1] No input!")));
		return;
	}
	//for (const line of lines) {
	//	console.log(line);
	//}
	const lenny = lines[0].length;
	const mrow = lines.length - 1;

	const wordsearch = lines.join("");

	let matches = 0;
	for (let i = 0; i < wordsearch.length; i++) {
		const isMas = checkSquare(wordsearch, i, lenny, mrow);
		if (isMas) matches++;
		//const isValidStart = wordsearch[i] === searchingFor[0];
		//
		//if (isValidStart) {
		//	const searchDirs = getValidDirections(i, searchLen, lenny, mrow);
		//	const checks = checkDirs(wordsearch, searchingFor, i, lenny, searchDirs);
		//	const found = Object.values(checks).filter((c) => c === true);
		//	console.log(i, checks);
		//	matches += found.length;
		//}
	}

	console.log(`Found ${magenta(bold(String(matches)))} matches!`);
}
