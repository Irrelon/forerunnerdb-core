import assert from "assert";
import {update} from "./update";

describe("update", () => {
	it("By query", async () => {
		const dataArr = [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}];

		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.strictEqual(dataArr[0].foo, false, "Correct value");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}, {
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.strictEqual(dataArr[0].foo, false, "Correct value");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}, {
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$skipAssignment": true
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.notStrictEqual(dataArr, updateResult, "Data has been immutably updated");
		assert.notStrictEqual(dataArr[0], updateResult[0], "Data has been immutably updated");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}], "Correct value");
		assert.deepStrictEqual(updateResult, [{
			"_id": "1",
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id !== "1";
			}
		});

		assert.strictEqual(updateResult.length, 0, "Number of documents is correct");
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id === "1";
			}
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.strictEqual(dataArr[0].foo, false, "Correct value");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}, {
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id === "1";
			},
			"$postFlight": (updatedDoc, originalDoc) => {
				return updatedDoc._id !== "1";
			}
		});

		assert.strictEqual(updateResult.length, 0, "Number of documents is correct");
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

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id === "1";
			},
			"$postFlight": (updatedDoc, originalDoc) => {
				return updatedDoc._id === "1";
			}
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.strictEqual(dataArr[0].foo, false, "Correct value");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": false,
			"newVal": "bar"
		}, {
			"_id": "2",
			"foo": true
		}], "Correct value");
	});

	it("$inc increase by value", async () => {
		const dataArr = [{
			"_id": "1",
			"data": {"val": 1}
		}, {
			"_id": "2",
			"data": {"val": 12}
		}];

		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"$inc": {
				"data.val": 1
			}
		});

		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.strictEqual(dataArr[0].data.val, 2, "Correct value");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"data": {"val": 2}
		}, {
			"_id": "2",
			"data": {"val": 12}
		}], "Correct value");
	});
	
	it("$push add item to array", async () => {
		const dataArr = [{
			"_id": "1",
			"data": [{"val": 1}, {"val": 12}]
		}, {
			"_id": "2",
			"data": []
		}];
		
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		
		const updateResult = await update(dataArr, {
			"_id": "1"
		}, {
			"$push": {
				"data": {"val": 24}
			}
		});
		
		assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"data": [{"val": 1}, {"val": 12}, {"val": 24}]
		}, {
			"_id": "2",
			"data": []
		}], "Correct value");
	});
});