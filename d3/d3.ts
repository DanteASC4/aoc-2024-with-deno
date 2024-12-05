import { bold, cyan, magenta, red, yellow } from "@std/fmt/colors";
import { humanize } from "../utils/misc.ts";
import { readInpLines } from "../utils/files.ts";
const target = /mul\(\d{1,3},\d{1,3}\)/g;
const fullTarget = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;

const parseMul = (mulStr: string) => {
	const parts = mulStr.split("");
	// Remove leading: mul( & trailing )
	parts.splice(0, 4);
	parts.pop();

	const comma = parts.findIndex((v) => v === ",");
	if (comma === -1) {
		console.warn(yellow(`${bold("Bad mulStr given!")}: ${mulStr}`));
		return NaN;
	}

	const left = Number(parts.slice(0, comma).join(""));
	const right = Number(parts.slice(comma + 1).join(""));

	if (isNaN(left)) {
		console.warn(yellow(`${bold("Bad left given!")}: ${mulStr}`));
		return NaN;
	}

	if (isNaN(right)) {
		console.warn(yellow(`${bold("Bad right given!")}: ${mulStr}`));
		return NaN;
	}

	//console.log(parts);
	//console.log(left);
	//console.log(right);

	return left * right;
};

const parseLine = (line: string) => {
	const matches = line.match(target);

	if (!matches) {
		console.log(yellow("Could not match against line!"));
		console.log(line);
		return 0;
	}

	const muls = matches.map((m) => m);
	if (muls.length === 0) {
		console.log(yellow("No matches found for line!"));
		console.log(line);
		return 0;
	}

	const products = muls.map(parseMul);
	if (products.some((p) => isNaN(p))) {
		console.log(muls);
		throw Error("Failed to parse a mul!");
	}

	const sum = products.reduce((p, c) => p + c, 0);
	return sum;
};

const gatherInstructions = (line: string) => {
	const matches = line.match(fullTarget);
	if (!matches) {
		console.log(yellow("Could not match against line!"));
		console.log(line);
		return [];
	}

	const instructions = matches.map((m) => m);
	if (instructions.length === 0) {
		console.log(yellow("No instructions found for line!"));
		console.log(line);
		return [];
	}

	return instructions;
};

const parseInstructions = (instructions: string[]) => {
	let cInst = "do";
	const muls: string[] = [];

	while (instructions.length > 0) {
		const curr = instructions.shift();
		if (curr) {
			if (curr === "do()") cInst = "do";
			else if (curr === "don't()") cInst = "don't";
			else {
				if (cInst === "do") muls.push(curr);
			}
		}
	}

	console.log(muls);
	const products = muls.map(parseMul);
	if (products.some((p) => isNaN(p))) {
		console.log(muls);
		throw Error("Failed to parse a mul!");
	}

	const sum = products.reduce((p, c) => p + c, 0);
	return sum;
};

export async function d3part1() {
	const lines = await readInpLines("d3.txt");
	if (!lines) {
		console.log(red(bold("[D3P1] No input!")));
		return;
	}

	const sums: number[] = [];
	for (const line of lines) {
		const result = parseLine(line);
		console.log(`${cyan(bold("Parsing line..."))}`);
		console.log(`Got: ${magenta(bold(String(result)))}`);
		sums.push(result);
	}

	const sumSum = sums.reduce((p, c) => p + c, 0);

	console.log(sums);
	console.log(sumSum);
	console.log(`Final answer: ${magenta(bold(humanize(sumSum)))}`);
}

export async function d3part2() {
	const lines = await readInpLines("d3.txt");
	if (!lines) {
		console.log(red(bold("[D3P2] No input!")));
		return;
	}

	const allInstructions = [];
	for (const line of lines) {
		const instr = gatherInstructions(line);
		allInstructions.push(...instr);
	}

	const evaluated = parseInstructions(allInstructions);
	console.log(evaluated);
	console.log(`Final answer: ${magenta(bold(humanize(evaluated)))}`);
}
