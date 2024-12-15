import {$inc, $pop, $push, $set, $shift, $unset} from "./operate";
import assert from "assert";

describe("operate", () => {
	describe("$inc", () => {
		describe("Positive", () => {
			it("Number Plus", () => {
				const result = $inc(1, 6);
				assert.strictEqual(result, 7, "Correct");
			});

			it("Number Minus", () => {
				const result = $inc(1, -6);
				assert.strictEqual(result, -5, "Correct");
			});

			/*it("Date", () => {
				const result = $inc(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
				assert.strictEqual(result, true, "Correct");
			});*/
		});
	});

	describe("$push", () => {
		describe("Positive", () => {
			it("Object", () => {
				const arr = [];
				const result = $push(arr, {"foo": true});

				assert.deepStrictEqual(arr, [], "Correct");
				assert.deepStrictEqual(result, [{"foo": true}], "Correct");
			});
		});
	});

	describe("$pop", () => {
		it("Pops the last array value", () => {
			const arr = ["foo", "bar", 12];
			const result = $pop(arr);

			assert.deepStrictEqual(arr, ["foo", "bar", 12], "Correct");
			assert.deepStrictEqual(result, ["foo", "bar"], "Correct");
		});

		it("Returns a blank array when no items are present", () => {
			const arr = [];
			const result = $pop(arr);

			assert.deepStrictEqual(arr, [], "Correct");
			assert.deepStrictEqual(result, [], "Correct");
		});
	});

	describe("$shift", () => {
		it("Removes the first array value", () => {
			const arr = ["foo", "bar", 12];
			const result = $shift(arr);

			assert.deepStrictEqual(arr, ["foo", "bar", 12], "Correct");
			assert.deepStrictEqual(result, ["bar", 12], "Correct");
		});

		it("Returns a blank array when no items are present", () => {
			const arr = [];
			const result = $shift(arr);

			assert.deepStrictEqual(arr, [], "Correct");
			assert.deepStrictEqual(result, [], "Correct");
		});
	});

	describe("$set", () => {
		it("Set an object key", () => {
			const obj = {"foo": true, "bar": false};
			const result = $set(obj, "foo", false);

			assert.deepStrictEqual(obj, {"foo": true, "bar": false}, "Correct");
			assert.deepStrictEqual(result, {"foo": false, "bar": false}, "Correct");
		});
	});

	describe("$unset", () => {
		it("Delete an object key", () => {
			const obj = {"foo": true, "bar": false};
			const result = $unset(obj, "foo");

			assert.deepStrictEqual(obj, {"foo": true, "bar": false}, "Correct");
			assert.deepStrictEqual(result, {"bar": false}, "Correct");
		});

		it("Returns a blank array when no items are present", () => {
			const arr = [];
			const result = $shift(arr);

			assert.deepStrictEqual(arr, [], "Correct");
			assert.deepStrictEqual(result, [], "Correct");
		});
	});
});