import assert from "assert";
import {update} from "./update";

describe("update", () => {
	it("Can update a single data object", async () => {
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

	it("Can update a data object immutably", async () => {
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
			immutable: true
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
});