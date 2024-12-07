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
		const thisC = partial.length > 0 ? partial.at(-1) : nextC;
		if (!thisC) throw Error("Failed to get current character");
		partial += nextC; // Add next non identical character...?
		//const truePartial = partial;
		const truePartial = partial;
		//if (partial.length === search.length) return partial === search; // Handy stop condition
		if (truePartial.length === search.length) return partial === search; // Handy stop condition
		const part = search.substring(0, iter);
		//console.log(
		//	"Does ",
		//	underline(partial),
		//	"match the same len from search, which is",
		//	underline(part),
		//);
		isMatching = truePartial === part || nextC === thisC;
		//isMatching = partial === part;
		//console.log(
		//	`${underline(truePartial)} === ${underline(part)} -> ${magenta(String(isMatching))}`,
		//);
		iter++;
		nextIdx += offset;

		// Bruh I was doing # - -N so the "-" was actually adding
		//if (dir === "ul" || dir === "u" || dir === "ur" || dir === "l") {
		//	nextIdx -= offset;
		//} else {
		//	nextIdx += offset;
		//}
	} while (isMatching && iter <= maxIter);
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
			//const checks = checkAllDirs(wordsearch, searchingFor, i, lenny);
			//const found = checks.filter((c) => c === true);
			//console.log(`\nFrom pos ${yellow(i.toString())} can check dirs:`);
			//console.log(searchDirs);
			console.log(i, checks);
			//if (found.length > 0) {
			//	console.log(`\nFrom pos ${yellow(i.toString())} can check dirs:`);
			//	console.log(searchDirs);
			//	console.log(checks);
			//}
			matches += found.length;
		}

		//if (wordsearch[i] === searchingFor[0]) {
		//	const checks = checkAllDirs(wordsearch, searchingFor, i, lenny);
		//	const found = checks.filter((c) => c === true);
		//	if (found.length > 0) {
		//		checks.forEach((c, idx) => {
		//			if (c === true) {
		//				console.log(i, Dirs[idx]);
		//			}
		//		});
		//	}
		//	matches += found.length;
		//}

		//if(i < lenny) {
		//  // Row 0
		//} else if (i >= wordsearch.length - lenny) {
		//  // Last row
		//} else {
		//  // Other rows
		//}
	}

	console.log(`Found ${magenta(bold(String(matches)))} matches!`);

	//const found = checkDir(wordsearch, "XMAS", 2, lenny, "dr");
	//console.log(wordsearch);
	//console.log(found);
}
