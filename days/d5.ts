import { red, bold, magenta, underline, yellow } from "@std/fmt/colors";
import { readInpLines } from "../utils/files.ts";
import { humanize } from "../utils/misc.ts";

type RuleBook = { [key: string]: string[] };

const writeRuleBook = (rules: string[]) => {
	const rb: RuleBook = {};

	for (const rule of rules) {
		const parts = rule.split("|");
		const k = parts[0];
		const v = parts[1];

		if (rb[k]) rb[k].push(v);
		else rb[k] = [v];
	}

	return rb;
};

const followsRules = (
	page: string,
	update: string[],
	mustcomebefore: string[],
) => {
	const pageLoc = update.findIndex((p) => p === page);
	while (mustcomebefore.length > 0) {
		const next = mustcomebefore.shift();
		if (!next) {
			console.warn("No next!");
			return false; // ?
		}

		if (update.includes(next) === false) continue; // Ignore rules not applicable to current page

		const nextLoc = update.findIndex((p) => p === next);

		if (nextLoc < pageLoc) return false;
	}
	return true;
};

const vetUpdate = (update: string, rulebook: RuleBook) => {
	const parts = update.split(",");

	for (const page of parts) {
		if (rulebook[page]) {
			const ruleCheck = followsRules(page, parts, rulebook[page].slice(0));
			if (!ruleCheck) {
				console.log(
					`Rules broken by ${underline(page)} in update: ${magenta(update)}`,
				);
				return false;
			}
		} else {
			console.warn(
				`No rules found for ${yellow(page)} in update ${magenta(update)}`,
			);
		}
	}

	return true;
};

export async function d5part1() {
	const lines = await readInpLines("d5.txt");
	if (!lines) {
		console.log(red(bold("[D4P1] No input!")));
		return;
	}

	const ruleStart = lines.findIndex((l) => l.includes("|") === false);
	if (ruleStart === -1) {
		console.log(red(bold("No rules found!")));
		return;
	}

	const rules = lines.splice(0, ruleStart);
	const updates = lines.slice(0);
	const vetted: string[] = [];

	//console.log("Rules");
	//console.log(rules);
	console.log("Updates");
	console.log(updates);

	const rulebook = writeRuleBook(rules);
	console.log(rulebook);

	for (const update of updates) {
		const vet = vetUpdate(update, rulebook);
		if (vet) vetted.push(update);
	}

	const middles = vetted.map((u) => {
		const ns = u.split(",");
		const mn = ns[Math.floor(ns.length / 2)];
		return Number(mn);
	});

	console.log(vetted);
	console.log(middles);
	const ans = middles.reduce((c, p) => c + p, 0);
	console.log(humanize(ans));

	//const test = vetUpdate(updates[0], rulebook);
	//console.log(`Does updates[0] follow the rules? ${test ? "yep" : "nope"}`);

	//for (const line of lines) {
	//	console.log(line);
	//}
}
