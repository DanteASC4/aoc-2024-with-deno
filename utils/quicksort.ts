export function qs<T>(arr: T[]): T[] {
	if (arr.length <= 1) {
		return arr;
	}

	const pivot = arr[0];
	const left = [],
		right = [];

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < pivot) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}

	return [...qs(left), pivot, ...qs(right)];
}
