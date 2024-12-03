import { join, resolve } from "@std/path";
import { chunk, humanize } from "../utils/misc.ts";
import { cyan, bold } from "@std/fmt/colors";

const isAsc = (A: number[]) => {
	for (let i = 0; i < A.length; i++) {
		if (i === 0) {
			continue;
		}

		const prev = A[i - 1];
		const curr = A[i];

		if (curr > prev === false) return false;
	}
	return true;
};

const isDsc = (A: number[]) => {
	for (let i = 0; i < A.length; i++) {
		if (i === 0) {
			continue;
		}

		const prev = A[i - 1];
		const curr = A[i];

		if (curr < prev === false) return false;
	}
	return true;
};

const isBadDist = (d: number) => {
	if (d < 1) return "Too small!";
	if (d > 3) return "Too large!";
};

const isReportSafe = (rep: number[]) => {
	const isAscOrDsc = isAsc(rep) || isDsc(rep);
	if (!isAscOrDsc) {
		console.log("Unsafe report! Neither asc or dsc!");
		console.log(rep);
		return false;
	}

	for (let i = 0; i < rep.length; i++) {
		if (i === 0) {
			const c = rep[i];
			const n = rep[i + 1];

			const dist = Math.abs(c - n);
			const badDist = isBadDist(dist);
			if (badDist) {
				console.log(badDist);
				return false;
			}
		} else if (i === rep.length - 1) {
			const c = rep[i];
			const p = rep[i - 1];

			const dist = Math.abs(c - p);
			const badDist = isBadDist(dist);
			if (badDist) {
				console.log(badDist);
				return false;
			}
		} else {
			const c = rep[i];
			const p = rep[i - 1];
			const n = rep[i + 1];

			const dist1 = Math.abs(c - p);
			const badDist1 = isBadDist(dist1);
			const dist2 = Math.abs(c - n);
			const badDist2 = isBadDist(dist2);

			if (badDist1) {
				console.log(`${p} - ${c} - ${n}`);
				console.log(dist1);
				console.log(badDist1);
				return false;
			}

			if (badDist2) {
				console.log(`${p} - ${c} - ${n}`);
				console.log(dist2);
				console.log(badDist2);
				return false;
			}
		}
	}

	return true;
};

export function d2part1() {
	if (!import.meta.dirname) return;
	const fp = resolve(join(import.meta.dirname, "..", "inputs", "d2.txt"));
	const inp = Deno.readTextFileSync(fp);
	const lines = inp.split("\n") as string[];
	const reports: number[][] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const groups = line.match(/\d+/g);

		if (!groups) {
			console.warn("Weird input (no groups) detected on line #", i);
			console.dir(line);
			continue;
		}

		const nums = groups.map(Number);

		reports.push(nums);
	}

	//const t = [3, 2, 1];
	//
	//console.log(`Is t dsc: ${isDsc(t)}`);
	//
	//reports.map(isReportSafe);

	//for (let i = 0; i < reports.length; i++) {
	//	const report = reports[0];
	//	const pairedForward = chunk(report.slice(0), 2);
	//	const backwards = report.slice(0).reverse();
	//	const pairedBackward = chunk(backwards, 2);
	//}

	// Unsure of edge case handling (like what if there's 1 alone?)

	const safeReports = reports.filter(isReportSafe);

	//let s = "";
	//for (const safe of safeReports) {
	//	s += safe.join(" ") + "\n";
	//}

	//const ofp = resolve(join(import.meta.dirname, "..", "inputs", "d2_out.txt"));
	//Deno.writeTextFileSync(ofp, s);
	//
	//console.log(s);

	console.log(
		`Found ${cyan(bold(humanize(safeReports.length)))} (${cyan(String(safeReports.length))}) safe reports!`,
	);
}
