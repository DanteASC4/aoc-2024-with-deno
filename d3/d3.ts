import { join, resolve } from "@std/path";
import { bold, cyan, magenta, yellow } from "@std/fmt/colors";
import { humanize } from "../utils/misc.ts";
const target = /mul\(\d{1,3},\d{1,3}\)/g;

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

export function d3part1() {
	if (!import.meta.dirname) return;
	const fp = resolve(join(import.meta.dirname, "..", "inputs", "d3.txt"));
	const inp = Deno.readTextFileSync(fp);
	const lines = inp.split("\n").filter((l) => l !== "") as string[];

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

	//const ans = parseMul("mul(2,4)");
	//console.log(ans);
}
