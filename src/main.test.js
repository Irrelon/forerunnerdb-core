import {insert, find, update, remove} from "./main.js";
import * as assert from "assert";

describe("main", () => {
	it("Imported insert() correctly", () => {
		assert.strictEqual(insert instanceof Function, true, "Is a function");
	});

	it("Imported find() correctly", () => {
		assert.strictEqual(find instanceof Function, true, "Is a function");
	});

	it("Imported update() correctly", () => {
		assert.strictEqual(update instanceof Function, true, "Is a function");
	});

	it("Imported remove() correctly", () => {
		assert.strictEqual(remove instanceof Function, true, "Is a function");
	});
});