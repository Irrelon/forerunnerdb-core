"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _operate = require("./operate");

var _assert = _interopRequireDefault(require("assert"));

describe("operate", function () {
  describe("$inc", function () {
    describe("Positive", function () {
      it("Number Plus", function () {
        var result = (0, _operate.$inc)(1, 6);

        _assert["default"].strictEqual(result, 7, "Correct");
      });
      it("Number Minus", function () {
        var result = (0, _operate.$inc)(1, -6);

        _assert["default"].strictEqual(result, -5, "Correct");
      });
      /*it("Date", () => {
      	const result = $inc(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
      	assert.strictEqual(result, true, "Correct");
      });*/
    });
  });
  describe("$push", function () {
    describe("Positive", function () {
      it("Object", function () {
        var arr = [];
        var result = (0, _operate.$push)(arr, {
          "foo": true
        });

        _assert["default"].deepStrictEqual(arr, [], "Correct");

        _assert["default"].deepStrictEqual(result, [{
          "foo": true
        }], "Correct");
      });
    });
  });
  describe("$pop", function () {
    it("Pops the last array value", function () {
      var arr = ["foo", "bar", 12];
      var result = (0, _operate.$pop)(arr);

      _assert["default"].deepStrictEqual(arr, ["foo", "bar", 12], "Correct");

      _assert["default"].deepStrictEqual(result, ["foo", "bar"], "Correct");
    });
    it("Returns a blank array when no items are present", function () {
      var arr = [];
      var result = (0, _operate.$pop)(arr);

      _assert["default"].deepStrictEqual(arr, [], "Correct");

      _assert["default"].deepStrictEqual(result, [], "Correct");
    });
  });
  describe("$shift", function () {
    it("Removes the first array value", function () {
      var arr = ["foo", "bar", 12];
      var result = (0, _operate.$shift)(arr);

      _assert["default"].deepStrictEqual(arr, ["foo", "bar", 12], "Correct");

      _assert["default"].deepStrictEqual(result, ["bar", 12], "Correct");
    });
    it("Returns a blank array when no items are present", function () {
      var arr = [];
      var result = (0, _operate.$shift)(arr);

      _assert["default"].deepStrictEqual(arr, [], "Correct");

      _assert["default"].deepStrictEqual(result, [], "Correct");
    });
  });
  describe("$unset", function () {
    it("Delete an object key", function () {
      var obj = {
        "foo": true,
        "bar": false
      };
      var result = (0, _operate.$unset)(obj, "foo");

      _assert["default"].deepStrictEqual(obj, {
        "foo": true,
        "bar": false
      }, "Correct");

      _assert["default"].deepStrictEqual(result, {
        "bar": false
      }, "Correct");
    });
    it("Returns a blank array when no items are present", function () {
      var arr = [];
      var result = (0, _operate.$shift)(arr);

      _assert["default"].deepStrictEqual(arr, [], "Correct");

      _assert["default"].deepStrictEqual(result, [], "Correct");
    });
  });
});