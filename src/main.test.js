import {find, update} from "./main.js";
import * as assert from "assert";

describe("main", () => {
	it("Imported find() correctly", () => {
		assert.strictEqual(find instanceof Function, true, "Is a function");
	});

	it("Imported update() correctly", () => {
		assert.strictEqual(update instanceof Function, true, "Is a function");
	});
});