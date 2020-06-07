import {find} from "./main.js";
import * as assert from "assert";

describe("main", () => {
	it("Imported find() correctly", () => {
		assert.strictEqual(find instanceof Function, true, "Is a function");
	});
});