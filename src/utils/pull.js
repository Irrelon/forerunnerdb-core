export const pull = (arr, itemToRemove) => {
	return arr.reduce((newArr, arrItem) => {
		if (itemToRemove === arrItem) return newArr;

		newArr.push(arrItem);
		return newArr;
	}, []);
};