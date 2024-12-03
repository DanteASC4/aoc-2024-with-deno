import { join, resolve } from "@std/path";
import { qs } from "../utils/quicksort.ts";
import { humanize } from "../utils/misc.ts";

export function d1() {
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
