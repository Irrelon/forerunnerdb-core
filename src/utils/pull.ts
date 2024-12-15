export const pull = (arr: any[], itemToRemove: any) => {
	return arr.reduce((newArr, arrItem) => {
		if (itemToRemove === arrItem) return newArr;

		newArr.push(arrItem);
		return newArr;
	}, []);
};