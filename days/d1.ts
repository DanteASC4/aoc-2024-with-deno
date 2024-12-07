import { join, resolve } from "@std/path";
import { qs } from "../utils/quicksort.ts";
import { humanize } from "../utils/misc.ts";

export function d1part1() {
	if (!import.meta.dirname) return;
	const fp = resolve(join(import.meta.dirname, "..", "inputs", "d1.txt"));
	const inp = Deno.readTextFileSync(fp);

	const lines = inp.split("\n") as string[];

	const left: number[] = [];
	const right: number[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const groups = line.match(/\d+/g);

		if (!groups || groups.length !== 2) {
			console.warn("Weird input (no double groups) detected on line #", i);
			console.dir(line);
			continue;
		}

		const leftN = Number(groups[0]);
		const rightN = Number(groups[1]);

		if (isNaN(leftN) || isNaN(rightN)) {
			console.warn("Weird input (nan) detected on line #", i);
			console.dir(line);
			continue;
		}

		left.push(leftN);
		right.push(rightN);
	}

	const sLeft = qs(left);
	const sRight = qs(right);
	if (sLeft.length !== sRight.length) {
		console.warn(
			`Data length mismatch! Left: %c${sLeft.length} %cRight: %c${sRight.length}`,
			"color:orange",
			"color:white",
			"color:orange",
		);
	}

	const distances = sLeft.map((n, i) => {
		return Math.abs(n - sRight[i]);
	});

	console.log(distances);
	const sum = distances.reduce((p, c) => p + c, 0);
	console.log(humanize(111222333));

	console.log(
		`Sum of distances is! %c${sum} (${humanize(sum)})`,
		"color:cyan;font-weight:bold;",
	);
}

export function d1part2() {
	if (!import.meta.dirname) return;
	const fp = resolve(join(import.meta.dirname, "..", "inputs", "d1.txt"));
	const inp = Deno.readTextFileSync(fp);

	let lines = inp.split("\n") as string[];

	const left: number[] = [];
	const right: number[] = [];

	lines = lines.filter((l) => l !== "" && l !== "\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const groups = line.match(/\d+/g);

		if (!groups || groups.length !== 2) {
			console.warn("Weird input (group len) detected on line #", i);
			console.dir(line);
			continue;
		}

		const leftN = Number(groups[0]);
		const rightN = Number(groups[1]);

		if (isNaN(leftN) || isNaN(rightN)) {
			console.warn("Weird input (nan) detected on line #", i);
			console.dir(line);
			continue;
		}

		left.push(leftN);
		right.push(rightN);
	}

	const sLeft = qs(left);
	const sRight = qs(right);
	if (sLeft.length !== sRight.length) {
		console.warn(
			`Data length mismatch! Left: %c${sLeft.length} %cRight: %c${sRight.length}`,
			"color:orange",
			"color:white",
			"color:orange",
		);
	}

	// Key: Unique # from sLeft.
	// Val: Num times # from sLeft is seen in sRight
	const freqMap: Record<string, number> = {};

	// Naive approach, should work albeit prob slow
	//for (let i = 0; i < sLeft.length; i++) {
	//	const n = sLeft[i];
	//	if (freqMap[n]) {
	//		continue; // Already counted this number;
	//	} else {
	//		freqMap[n] = 0;
	//		for (let j = 0; j < sRight.length; j++) {
	//			if (sRight[j] === n) {
	//				freqMap[n]++;
	//			}
	//		}
	//	}
	//}

	// Thought of faster way, just count # occurrences once and only care about nums that are also in sLeft
	for (let i = 0; i < sRight.length; i++) {
		const n = sRight[i];
		if (!sLeft.includes(n)) {
			continue;
		}

		let occ = 0;
		for (let j = 0; j < sRight.length; j++) {
			if (sRight[j] === n) occ++;
		}

		freqMap[n] = occ;
	}

	for (let i = 0; i < sLeft.length; i++) {
		const n = sLeft[i];
		if (sRight.includes(n) === false) freqMap[n] = 0;
	}

	// part2 Task:
	// Calculate a total similarity score by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

	const distances = sLeft.map((n) => {
		return n * freqMap[n];
	});

	const sum = distances.reduce((p, c) => p + c, 0);

	console.log(
		`Sum of distances is! %c${sum} (${humanize(sum)})`,
		"color:cyan;font-weight:bold;",
	);
}
