import { join, resolve } from "@std/path";

export async function readInpLines(fname: string) {
	if (!import.meta.dirname) return;
	const fp = resolve(join(import.meta.dirname, "..", "inputs", fname));
	const inp = await Deno.readTextFile(fp);
	const nonblank = inp.split("\n").filter((l) => l !== "") as string[];
	return nonblank;
}
