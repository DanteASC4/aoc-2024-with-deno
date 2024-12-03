export function humanize(num: number) {
	const asStr = String(num);
	if (asStr.length <= 3) return asStr;
	const back = asStr.split("").reverse().join("");
	const grouped = back.match(/\d{1,3}/g);
	if (!grouped) {
		return "HUMANIZE FAILED";
	}
	// This is really dumb lol
	const righted = grouped
		.reverse()
		.map((g) => g.split("").reverse().join(""))
		.join(",");
	return righted;
}
