"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _assert = _interopRequireDefault(require("assert"));

var _build = require("./build");

var _type = require("../../utils/type");

describe("queryFromObject()", () => {
	it("Will generate a query from an object", () => {
		var obj = {
			"bar": {
				"foo": true
			}
		};
		var expected = {
			"bar.foo": true
		};
		var result = (0, _build.queryFromObject)(obj);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("Will handle array indexes nicely", () => {
		var obj = {
			"bar": [{
				"foo": true
			}],
			"dt": new Date("2020-01-01T00:00:00Z")
		};
		var expected = {
			"bar.$.foo": true,
			"dt": new Date("2020-01-01T00:00:00Z")
		};
		var result = (0, _build.queryFromObject)(obj);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
});
describe("build", () => {
	it("$eeq", () => {
		var data = {
			"op": "$eeq",
			"path": "bar.name",
			"value": "Foo"
		};
		data.typeData = (0, _type.extendedType)(data.value);
		var expected = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};
		var result = (0, _build.$eeq)(data.path, data.value, data.typeData);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("$eq", () => {
		var data = {
			"op": "$eq",
			"path": "bar.name",
			"value": ["Foo", "Bar"]
		};
		data.typeData = (0, _type.extendedType)(data.value);
		var expected = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};
		var result = (0, _build.$eq)(data.path, data.value, data.typeData);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("$in", () => {
		var data = {
			"op": "$in",
			"path": "bar.name",
			"value": ["Foo", "Bar"]
		};
		data.typeData = (0, _type.extendedType)(data.value);
		var expected = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};
		var result = (0, _build.$in)(data.path, data.value, data.typeData);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
});
describe("queryToPipeline()", () => {
	it("Implicit $and single tier", () => {
		var query = {
			"bar.name": "Foo"
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$eeq",
				"path": "bar.name",
				"value": "Foo",
				"type": "string",
				"instance": ""
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("Explicit $or nested", () => {
		var query = {
			"$or": [{
				"bar.name": "Foo"
			}, {
				"bar.dt": {
					"$gt": new Date("2020-01-01T00:00:00Z"),
					"$lte": new Date("2020-12-31T00:00:00Z")
				}
			}]
		};
		var expected = {
			"op": "$or",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$eeq",
				"path": "bar.name",
				"value": "Foo",
				"type": "string",
				"instance": ""
			}, {
				"op": "$and",
				"type": "array",
				"path": "",
				"instance": "",
				"value": [{
					"op": "$gt",
					"path": "bar.dt",
					"type": "object",
					"instance": "Date",
					"value": new Date("2020-01-01T00:00:00Z")
				}, {
					"op": "$lte",
					"path": "bar.dt",
					"type": "object",
					"instance": "Date",
					"value": new Date("2020-12-31T00:00:00Z")
				}]
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("Explicit $and single tier", () => {
		var query = {
			"$and": [{
				"bar.name": "Foo",
				"bar.age": 22
			}]
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$eeq",
				"path": "bar.name",
				"value": "Foo",
				"type": "string",
				"instance": ""
			}, {
				"op": "$eeq",
				"path": "bar.age",
				"value": 22,
				"type": "number",
				"instance": ""
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("Explicit $and single tier, multi-sub-operations", () => {
		var query = {
			"$and": [{
				"bar.foo": true
			}, {
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"path": "bar.foo",
				"value": true,
				"type": "boolean",
				"instance": "",
				"op": "$eeq"
			}, {
				"path": "bar.dt",
				"value": new Date("2020-02-01T00:00:00Z"),
				"type": "object",
				"instance": "Date",
				"op": "$gt"
			}, {
				"path": "bar.dt",
				"value": new Date("2020-04-01T00:00:00Z"),
				"type": "object",
				"instance": "Date",
				"op": "$lte"
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct data");
	});
	it("Explicit $and single tier, equivalency", () => {
		var query1 = {
			"$and": [{
				"bar.foo": true,
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};
		var query2 = {
			"$and": [{
				"bar.foo": true
			}, {
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$eeq",
				"path": "bar.foo",
				"value": true,
				"type": "boolean",
				"instance": ""
			}, {
				"op": "$gt",
				"value": new Date("2020-02-01T00:00:00Z"),
				"path": "bar.dt",
				"type": "object",
				"instance": "Date"
			}, {
				"op": "$lte",
				"value": new Date("2020-04-01T00:00:00Z"),
				"path": "bar.dt",
				"type": "object",
				"instance": "Date"
			}]
		};
		var result1 = (0, _build.queryToPipeline)(query1);
		var result2 = (0, _build.queryToPipeline)(query2);

		_assert["default"].deepStrictEqual(result1, expected, "Correct");

		_assert["default"].deepStrictEqual(result2, expected, "Correct");
	});
	it("Implicit $and single tier, multi-sub-operations", () => {
		var query = {
			"bar.foo": true,
			"bar.dt": {
				"$gt": new Date("2020-02-01T00:00:00Z"),
				"$lte": new Date("2020-04-01T00:00:00Z")
			}
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$eeq",
				"path": "bar.foo",
				"value": true,
				"type": "boolean",
				"instance": ""
			}, {
				"op": "$gt",
				"value": new Date("2020-02-01T00:00:00Z"),
				"path": "bar.dt",
				"type": "object",
				"instance": "Date"
			}, {
				"op": "$lte",
				"value": new Date("2020-04-01T00:00:00Z"),
				"path": "bar.dt",
				"type": "object",
				"instance": "Date"
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
	it("Implicit $and single tier, single-sub-operation", () => {
		var query = {
			"bar.name": {
				"$in": ["Amelia", "Andy"]
			}
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"path": "bar.name",
				"value": ["Amelia", "Andy"],
				"type": "array",
				"instance": "",
				"op": "$in"
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct data");
	});
	it("Implicit $and single tier, multi-sub-operations with array value", () => {
		var query = {
			"bar.dt": new Date("2020-03-01T00:00:00Z"),
			"bar.name": {
				"$in": ["Amelia", "Andy"],
				"$ne": "Andy"
			}
		};
		var expected = {
			"op": "$and",
			"instance": "",
			"path": "",
			"type": "array",
			"value": [{
				"op": "$eeq",
				"path": "bar.dt",
				"value": new Date("2020-03-01T00:00:00Z"),
				"type": "object",
				"instance": "Date"
			}, {
				"path": "bar.name",
				"value": ["Amelia", "Andy"],
				"type": "array",
				"instance": "",
				"op": "$in"
			}, {
				"path": "bar.name",
				"value": "Andy",
				"type": "string",
				"instance": "",
				"op": "$ne"
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct data");
	});
	it("Implicit $and single tier, single-sub-operation with array value", () => {
		var query = {
			"bar.name": {
				"$in": ["Foo", "Bar"]
			}
		};
		var expected = {
			"op": "$and",
			"path": "",
			"type": "array",
			"instance": "",
			"value": [{
				"op": "$in",
				"path": "bar.name",
				"type": "array",
				"instance": "",
				"value": ["Foo", "Bar"]
			}]
		};
		var result = (0, _build.queryToPipeline)(query);

		_assert["default"].deepStrictEqual(result, expected, "Correct");
	});
});