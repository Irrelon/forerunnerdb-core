import assert from "assert";
import {insert} from "./insert";

describe("insert", () => {
	it("By query", async () => {
		const dataArr = [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}];

		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

		const insertResult = await insert(dataArr, {
			"foo": false,
			"newVal": "bar"
		});

		assert.strictEqual(insertResult.length, 1, "Number of documents is correct");
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
		
		const insertResult = await insert(dataArr, {
			"foo": false,
			"newVal": "bar"
		});
		
		assert.strictEqual(insertResult.length, 1, "Number of documents is correct");
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

		const insertResult = await insert(dataArr, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$skipAssignment": true
		});

		assert.strictEqual(insertResult.length, 1, "Number of documents is correct");
		assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
		assert.notStrictEqual(dataArr, insertResult, "Data has been immutably updated");
		assert.notStrictEqual(dataArr[0], insertResult[0], "Data has been immutably updated");
		assert.deepStrictEqual(dataArr, [{
			"_id": "1",
			"foo": true
		}, {
			"_id": "2",
			"foo": true
		}], "Correct value");
		assert.deepStrictEqual(insertResult, [{
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
		
		const insertResult = await insert(dataArr, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id !== "1";
			}
		});
		
		assert.strictEqual(insertResult.length, 0, "Number of documents is correct");
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
		
		const insertResult = await insert(dataArr, {
			"foo": false,
			"newVal": "bar"
		}, {
			"$preFlight": (doc) => {
				return doc._id === "1";
			}
		});
		
		assert.strictEqual(insertResult.length, 1, "Number of documents is correct");
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
		
		const insertResult = await insert(dataArr, {
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
		
		assert.strictEqual(insertResult.length, 0, "Number of documents is correct");
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
		
		const insertResult = await insert(dataArr, {
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
		
		assert.strictEqual(insertResult.length, 1, "Number of documents is correct");
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
});