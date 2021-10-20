"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _main = require("./main.js");

var assert = _interopRequireWildcard(require("assert"));

describe("main", function () {
  it("Imported insert() correctly", function () {
    assert.strictEqual(_main.insert instanceof Function, true, "Is a function");
  });
  it("Imported find() correctly", function () {
    assert.strictEqual(_main.find instanceof Function, true, "Is a function");
  });
  it("Imported update() correctly", function () {
    assert.strictEqual(_main.update instanceof Function, true, "Is a function");
  });
  it("Imported remove() correctly", function () {
    assert.strictEqual(_main.remove instanceof Function, true, "Is a function");
  });
});