"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _find = _interopRequireDefault(require("./find"));

var _assert = _interopRequireDefault(require("assert"));

var _data = require("../../test/data");

describe("find()", () => {
	describe("Number", () => {
		it("$eeq", () => {
			var query = {
				"_id": 1
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 1, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 1, "ID is correct");
		});
	});
	describe("String", () => {
		it("$eeq", () => {
			var query = {
				"bar.name": "Amelia"
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 1, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 5, "ID is correct");
		});
		it("$in", () => {
			var query = {
				"bar.name": {
					"$in": ["Amelia", "Andy"]
				}
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 2, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 1, "ID is correct");

			_assert["default"].strictEqual(result[1]._id, 5, "ID is correct");
		});
	});
	describe("Boolean", () => {
		it("$eeq", () => {
			var query = {
				"bar.foo": false
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 1, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 2, "ID is correct");
		});
		it("Matches based on sub-documents", () => {
			var query = {
				"arr": {
					"goof": true,
					"fun": false
				}
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 1, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 2, "ID is correct");
		});
		it("Matches based on gated sub-documents", () => {
			var query = {
				"$or": [{
					"arr": {
						"goof": true,
						"fun": false
					}
				}, {
					"arr": {
						"goof": true,
						"fun": true
					}
				}]
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 2, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 1, "ID is correct");

			_assert["default"].strictEqual(result[1]._id, 2, "ID is correct");
		});
	});
	describe("Boolean, Date", () => {
		it("$gt, $lte, $eeq", () => {
			var query = {
				"bar.foo": true,
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 2, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 3, "ID is correct");

			_assert["default"].strictEqual(result[1]._id, 4, "ID is correct");
		});
	});
	describe("Gates", () => {
		it("$and", () => {
			var query = {
				"$and": [{
					"bar.foo": true,
					"bar.dt": {
						"$gt": new Date("2020-02-01T00:00:00Z"),
						"$lte": new Date("2020-04-01T00:00:00Z")
					}
				}]
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 2, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 3, "ID is correct");

			_assert["default"].strictEqual(result[1]._id, 4, "ID is correct");
		});
		it("$or", () => {
			var query = {
				"$or": [{
					"bar.foo": true,
					"bar.dt": {
						"$gt": new Date("2020-02-01T00:00:00Z"),
						"$lte": new Date("2020-04-01T00:00:00Z")
					}
				}]
			};
			var result = (0, _find["default"])(_data.data, query);

			_assert["default"].strictEqual(result.length, 4, "Number of results is correct");

			_assert["default"].strictEqual(result[0]._id, 1, "ID is correct");

			_assert["default"].strictEqual(result[1]._id, 3, "ID is correct");

			_assert["default"].strictEqual(result[2]._id, 4, "ID is correct");

			_assert["default"].strictEqual(result[3]._id, 5, "ID is correct");
		});
	});
});