import {$inc, $push} from "./operate";
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
});