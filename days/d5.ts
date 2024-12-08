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
	let i = 0;
	while (i < mustcomebefore.length) {
		const next = mustcomebefore[i];
		i++;
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

const attemptFix = (
	badPage: string,
	pages: string[],
	rulebook: RuleBook,
	iter: number,
) => {
	const goodnow = followsRules(badPage, pages, rulebook[badPage].slice(0));
	if (goodnow) return pages;
	if (iter === 100) {
		console.log(`${red("Reached 100 iters...")}`);
		return pages;
	}

	iter++;

	const loc = pages.findIndex((p) => p === badPage);
	if (loc === -1) {
		throw Error("Somehow lost bad page");
	}

	const take = pages.splice(loc, 1)[0];
	pages.unshift(take);
	return attemptFix(badPage, pages, rulebook, iter);
};

const fixBadUpdate = (update: string, rulebook: RuleBook) => {
	let pages = update.split(",");
	for (const page of pages) {
		if (rulebook[page]) {
			const ruleCheck = followsRules(page, pages, rulebook[page].slice(0));
			if (!ruleCheck) {
				console.log(
					`Rules broken by ${underline(page)} in update: ${magenta(update)}`,
				);

				const fixed = attemptFix(page, pages, rulebook, 0);
				console.log(`Fixed: ${magenta(fixed.join(","))}`);
				pages = fixed;
			}
		} else {
			console.warn(
				`No rules found for ${yellow(page)} in update ${magenta(update)}`,
			);
		}
	}
	return pages;
};

let loggedOne = false;

const fixEm = (update: string, rulebook: RuleBook) => {
	let iter = 0;
	let pages = update.split(",");

	let hasbad = pages.map((p) => {
		if (rulebook[p]) return followsRules(p, pages, rulebook[p]);
		return true;
	});
	let i = 0;

	while (hasbad.some((isok) => isok === false)) {
		if (i === pages.length) i = 0;
		if (iter === 1000) {
			console.log(red("Tried fixing it 1000 times..."));
			if (!loggedOne) {
				console.log(update);
				const relevant: Record<string, string> = {};
				for (const k in rulebook) {
					if (pages.includes(k)) relevant[k] = rulebook[k].join(",");
				}
				console.log(relevant);
			}
			loggedOne = true;
			return pages;
		}
		const page = pages[i];
		i++;
		if (rulebook[page]) {
			const pageOK = followsRules(page, pages, rulebook[page]);
			if (!pageOK) {
				const adjusted = attemptFix(page, pages, rulebook, 0);
				pages = adjusted;
				hasbad = pages.map((p) => {
					if (rulebook[p]) return followsRules(p, pages, rulebook[p]);
					return true;
				});
			}
		}

		iter++;
	}

	//for (const page of pages) {
	//	if (rulebook[page]) {
	//		const ruleCheck = followsRules(page, pages, rulebook[page].slice(0));
	//		if (!ruleCheck) {
	//			const fixed = attemptFix(pages, page, rulebook, 0);
	//
	//			return fixEm(fixed.join(","), rulebook, iter++);
	//		}
	//	} else {
	//		console.warn(
	//			`No rules found for ${yellow(page)} in update ${magenta(update)}`,
	//		);
	//	}
	//}
	return pages;
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
}

export async function d5part2() {
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
	const bad: string[] = [];

	//console.log("Rules");
	//console.log(rules);
	console.log("Updates");
	console.log(updates);

	const rulebook = writeRuleBook(rules);
	console.log(rulebook);

	for (const update of updates) {
		const vet = vetUpdate(update, rulebook);
		//if (vet) vetted.push(update);
		if (!vet) {
			bad.push(update);
		}
	}
	console.log("---");

	const fixed = bad.map((u) => fixEm(u, rulebook));
	//console.log(bad);
	//console.log(fixed);
	const middles = fixed.map((u) => {
		//const ns = u.split(",");
		const mn = u[Math.floor(u.length / 2)];
		return Number(mn);
	});

	console.log(vetted);
	console.log(middles);
	const ans = middles.reduce((c, p) => c + p, 0);
	console.log(humanize(ans));

	//const t = bad[1];
	//console.log(t);
	//const fix = fixEm(t, rulebook);
	//console.log(fix);
}
