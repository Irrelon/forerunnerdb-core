import assert from "assert";
import {remove} from "./remove";

describe("remove", () => {
	describe("Modes of operation", () => {
		it("By query", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1",
				"foo": true
			});

			assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "2", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, true, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $one", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"foo": true,
			}, {
				"$one": true
			});

			assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "2", "Number of documents is correct");
			assert.deepStrictEqual(dataArr, [{
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $skipAssignment", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1"
			}, {
				"$skipAssignment": true
			});

			assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.notStrictEqual(dataArr, removeResult, "Data has been immutably removed");
			assert.notStrictEqual(dataArr[0], removeResult[0], "Data has been immutably removed");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
			assert.deepStrictEqual(removeResult, [{
				"_id": "1",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() false result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1"
			}, {
				"$preFlight": (doc) => {
					return doc._id !== "1";
				}
			});

			assert.strictEqual(removeResult.length, 0, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, true, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				}
			});

			assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
			assert.deepStrictEqual(dataArr, [{
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result, $postFlight() false result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				},
				"$postFlight": (removedDoc, originalDoc) => {
					return removedDoc._id !== "1";
				}
			});

			assert.strictEqual(removeResult.length, 0, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, true, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result, $postFlight() true result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const removeResult = await remove(dataArr, {
				"_id": "1"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				},
				"$postFlight": (removedDoc, originalDoc) => {
					return removedDoc._id === "1";
				}
			});

			assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
			assert.deepStrictEqual(dataArr, [{
				"_id": "2",
				"foo": true
			}], "Correct value");
		});
	});
});