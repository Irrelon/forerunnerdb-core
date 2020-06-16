"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _main = require("./main.js");

var assert = _interopRequireWildcard(require("assert"));

describe("main", () => {
	it("Imported find() correctly", () => {
		assert.strictEqual(_main.find instanceof Function, true, "Is a function");
	});
});