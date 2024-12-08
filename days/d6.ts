import { red, bold, cyan, green, underline } from "@std/fmt/colors";
import { readInpLines } from "../utils/files.ts";
import { writeAllSync } from "@std/io";
import { chunk } from "../utils/misc.ts";
import { humanize } from "../utils/misc.ts";

type Dir = "u" | "l" | "r" | "d";
type Guard = "^" | "<" | ">" | "v";

// the is guard type guard to check if a potential guard is a guard
const isGuard = (g: string): g is Guard =>
	g === "^" || g === ">" || g === "v" || g === "<";

const calcOffset = (dir: Dir, rowlen: number) => {
	switch (dir) {
		case "u":
			return -rowlen;
		case "l":
			return -1;
		case "r":
			return 1;
		case "d":
			return rowlen;
		default:
			break;
	}
};

const findGuard = (map: string) => {
	if (map.includes("^")) return map.indexOf("^");
	if (map.includes("<")) return map.indexOf("<");
	if (map.includes(">")) return map.indexOf(">");
	if (map.includes("v")) return map.indexOf("v");
	return -1;
};

const getDir = (map: string) => {
	if (map.includes("^")) return "u";
	if (map.includes("<")) return "l";
	if (map.includes(">")) return "r";
	if (map.includes("v")) return "d";
	return null;
};

const turn = (guard: Guard) => {
	if (guard === "^") return ">";
	if (guard === ">") return "v";
	if (guard === "v") return "<";
	if (guard === "<") return "^";
	return null;
};

const replaceC = (s: string, c: string, i: number) => {
	const left = s.slice(0, i);
	const right = s.slice(i + 1);
	return left + c + right;
};

const logMap = (map: string, rowlen: number) => {
	console.log("---");
	for (let i = 0; i < map.length / rowlen; i++) {
		const row = map.slice(i * rowlen, i * rowlen + rowlen);
		console.log(row);
	}
	console.log("---");
};

const walk = (map: string, rowlen: number) => {
	let pos = findGuard(map);

	while (pos !== -1) {
		const going = getDir(map);
		if (going === null) {
			console.log(going);
			logMap(map, rowlen);
			throw Error("Where is dude going...");
		}

		const offset = calcOffset(going, rowlen);
		if (!offset) throw Error("Bro hit the diagonal move fs");

		const nextPos = pos + offset;
		if (nextPos > map.length || nextPos < 0) {
			map = replaceC(map, "X", pos);
			return map;
		}

		const nextT = map[nextPos];
		if (nextT === "#") {
			const current = map[pos];
			if (!isGuard(current)) {
				return map;
			}

			const turned = turn(current);
			if (!turned) {
				return map;
			}

			map = replaceC(map, turned, pos);
		} else {
			const current = map[pos];
			//console.log("\n===");
			//console.log(`Guard: ${current}`);
			//console.log(`Gloc : ${pos}`);
			//console.log(`Nloc : ${nextPos}`);

			//logMap(map, rowlen);
			map = replaceC(map, current, nextPos);
			//logMap(map, rowlen);
			map = replaceC(map, "X", pos);
			//logMap(map, rowlen);
			//console.log("===\n");
			pos = findGuard(map);
		}
	}

	return map;
};

const countC = (s: string, c: string) => {
	let n = 0;
	for (let i = 0; i < s.length; i++) {
		if (s[i] === c) n++;
	}

	return n;
};

export async function d6part1() {
	const lines = await readInpLines("d6.txt");
	if (!lines) {
		console.log(red(bold("[D6P1] No input!")));
		return;
	}
	const lenny = lines[0].length;
	const theMap = lines.join("");

	//logMap(theMap, lenny);

	const done = walk(theMap, lenny);

	//logMap(done, lenny);

	const ans = countC(done, "X");

	console.log(
		`Guard took a hike that was ${green(underline(humanize(ans)))} tiles long!`,
	);
}
