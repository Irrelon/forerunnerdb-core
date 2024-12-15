import assert from "assert";
import {insert} from "./insert";

describe("insert", () => {
	it("Into empty array", async () => {
		const dataArr: any[] = [];

		assert.strictEqual(dataArr.length, 0, "Number of documents is correct");

		const insertResult = await insert(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}]);

		assert.strictEqual(insertResult.inserted.length, 1, "Number of documents is correct");
		assert.strictEqual(insertResult.notInserted.length, 0, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Value is correct");
		assert.strictEqual(dataArr[0].foo, false, "Value is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}], "Correct value");
	});

	it("Into populated array", async () => {
		const dataArr: any[] = [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}];

		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

		const insertResult = await insert(dataArr, [{
			"_id": "3",
			"foo": false,
			"newVal": "bar"
		}]);

		assert.strictEqual(insertResult.inserted.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 3, "Number of documents is correct");
		assert.strictEqual(dataArr[2]._id, "3", "Value is correct");
		assert.strictEqual(dataArr[2].foo, false, "Value is correct");
		assert.strictEqual(dataArr[2].newVal, "bar", "Value is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}, {
			"_id": "3",
			"foo": false,
			"newVal": "bar"
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

		const insertResult = await insert(dataArr, [{
			"foo": false,
			"newVal": "bar"
		}], {
			"$skipAssignment": true
		});

		assert.strictEqual(insertResult.inserted.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}], "Correct value");
		assert.deepStrictEqual(insertResult.inserted, [{
			"foo": false,
			"newVal": "bar"
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

		const insertResult = await insert(dataArr, [{
			"_id": "3",
			"foo": false,
			"newVal": "bar"
		}], {
			"$preFlight": (doc) => {
				return doc._id !== "3";
			}
		});

		assert.strictEqual(insertResult.inserted.length, 0, "Number of documents is correct");
		assert.strictEqual(insertResult.notInserted.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Value is correct");
		assert.strictEqual(dataArr[0].foo, true, "Value is correct");
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

		const insertResult = await insert(dataArr, [{
			"_id": "3",
			"foo": false,
			"newVal": "bar"
		}], {
			"$preFlight": (doc) => {
				return doc._id === "3";
			}
		});

		assert.strictEqual(insertResult.inserted.length, 1, "Number of documents is correct");
		assert.strictEqual(insertResult.notInserted.length, 0, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 3, "Number of documents is correct");
		assert.strictEqual(dataArr[2]._id, "3", "Value is correct");
		assert.strictEqual(dataArr[2].foo, false, "Value is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}, {
			"_id": "3",
			"foo": false,
			"newVal": "bar"
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

		const insertResult = await insert(dataArr, [{
			"foo": false,
			"newVal": "bar"
		}], {
			"$preFlight": (doc) => {
				return doc._id === "1";
			},
			"$postFlight": (updatedDoc, originalDoc) => {
				return updatedDoc._id !== "1";
			}
		});

		assert.strictEqual(insertResult.inserted.length, 0, "Number of documents is correct");
		assert.strictEqual(insertResult.notInserted.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Value is correct");
		assert.strictEqual(dataArr[0].foo, true, "Value is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}], "Correct value");
	});

	it("Using $preFlight() true result, $postFlight() true result", async () => {
		const dataArr: any[] = [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}];

		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

		const insertResult = await insert(dataArr, [{
			"_id": "3",
			"foo": false,
			"newVal": "bar"
		}], {
			"$preFlight": (doc) => {
				return doc._id === "3";
			},
			"$postFlight": (updatedDoc, originalDoc) => {
				return updatedDoc._id === "3";
			}
		});

		assert.strictEqual(insertResult.inserted.length, 1, "Number of documents is correct");
		assert.strictEqual(insertResult.notInserted.length, 0, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 3, "Number of documents is correct");
		assert.strictEqual(dataArr[2]._id, "3", "Value is correct");
		assert.strictEqual(dataArr[2].foo, false, "Value is correct");
		assert.strictEqual(dataArr[2].newVal, "bar", "Value is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}, {
			"_id": "3",
			"foo": false,
			"newVal": "bar"
		}], "Correct value");
	});
});