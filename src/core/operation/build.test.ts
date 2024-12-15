import assert from "assert";
import {genericOperation, queryFromObject, queryToPipeline, updateToPipeline} from "./build";
import {extendedType} from "../../utils/type";
import {GenericOperation} from "../../types/GenericOperation";

describe("queryFromObject()", () => {
	it("Will generate a query from an object", () => {
		const obj = {
			"bar": {
				"foo": true
			}
		};

		const expected = {
			"bar.foo": true
		};

		const result = queryFromObject(obj);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Will handle array indexes nicely", () => {
		const obj = {
			"bar": [{
				"foo": true
			}],
			"dt": new Date("2020-01-01T00:00:00Z")
		};

		const expected = {
			"bar.$.foo": true,
			"dt": new Date("2020-01-01T00:00:00Z")
		};

		const result = queryFromObject(obj);

		assert.deepStrictEqual(result, expected, "Correct");
	});
});

describe("genericOperation()", () => {
	it("String data type", () => {
		const data: GenericOperation = {
			"op": "$eeq",
			"path": "bar.name",
			"value": "Foo"
		};

		data.typeData = extendedType(data.value);

		const expected: GenericOperation = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};

		const result = genericOperation("$eeq", data.path, data.value, data.typeData);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Array<String> data type", () => {
		const data: GenericOperation = {
			"op": "$eq",
			"path": "bar.name",
			"value": ["Foo", "Bar"]
		};

		data.typeData = extendedType(data.value);

		const expected: GenericOperation = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};

		const result = genericOperation("$eq", data.path, data.value, data.typeData);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Array<Number> data type", () => {
		const data: GenericOperation = {
			"op": "$in",
			"path": "bar.val",
			"value": [1, 24]
		};

		data.typeData = extendedType(data.value);

		const expected: GenericOperation = {
			"op": data.op,
			"path": data.path,
			"value": data.value,
			"type": data.typeData.type,
			"instance": data.typeData.instance
		};

		const result = genericOperation("$in", data.path, data.value, data.typeData);

		assert.deepStrictEqual(result, expected, "Correct");
	});
});

describe("queryToPipeline()", () => {
	it("Implicit $and single tier", () => {
		const query = {
			"bar.name": "Foo"
		};

		const expected: GenericOperation = {
			op: "$and",
			path: "",
			type: "array",
			instance: "",
			value: [{
				op: "$eeq",
				path: "bar.name",
				value: "Foo",
				type: "string",
				instance: ""
			}]
		};

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Explicit $or nested", () => {
		const query = {
			"$or": [{
				"bar.name": "Foo"
			}, {
				"bar.dt": {
					"$gt": new Date("2020-01-01T00:00:00Z"),
					"$lte": new Date("2020-12-31T00:00:00Z")
				}
			}]
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Explicit $and single tier", () => {
		const query = {
			"$and": [{
				"bar.name": "Foo",
				"bar.age": 22
			}]
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Explicit $and single tier, multi-sub-operations", () => {
		const query = {
			"$and": [{
				"bar.foo": true
			}, {
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct data");
	});

	it("Explicit $and single tier, equivalency", () => {
		const query1 = {
			"$and": [{
				"bar.foo": true,
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};

		const query2 = {
			"$and": [{
				"bar.foo": true
			}, {
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			}]
		};

		const expected = {
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

		const result1 = queryToPipeline(query1);
		const result2 = queryToPipeline(query2);

		assert.deepStrictEqual(result1, expected, "Correct");
		assert.deepStrictEqual(result2, expected, "Correct");
	});

	it("Implicit $and single tier, multi-sub-operations", () => {
		const query = {
			"bar.foo": true,
			"bar.dt": {
				"$gt": new Date("2020-02-01T00:00:00Z"),
				"$lte": new Date("2020-04-01T00:00:00Z")
			}
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Implicit $and single tier, single-sub-operation", () => {
		const query = {
			"bar.name": {
				"$in": ["Amelia", "Andy"]
			}
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct data");
	});

	it("Implicit $and single tier, multi-sub-operations with array value", () => {
		const query = {
			"bar.dt": new Date("2020-03-01T00:00:00Z"),
			"bar.name": {
				"$in": ["Amelia", "Andy"],
				"$ne": "Andy"
			}
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct data");
	});

	it("Implicit $and single tier, single-sub-operation with array value", () => {
		const query = {
			"bar.name": {
				"$in": ["Foo", "Bar"]
			}
		};

		const expected = {
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

		const result = queryToPipeline(query);

		assert.deepStrictEqual(result, expected, "Correct");
	});
});

describe("updateToPipeline()", () => {
	it("Implicit $updateReplaceMode single tier, single-sub-operation with array value", () => {
		const update = {
			"$inc": {
				"bar.val": 1,
				"bar.val2": 2
			}
		};

		const expected = {
			"instance": "",
			"op": "$updateReplaceMode",
			"path": "",
			"type": "array",
			"value": [{
				"instance": "",
				"op": "$inc",
				"path": "bar.val",
				"type": "number",
				"value": 1
			}, {
				"instance": "",
				"op": "$inc",
				"path": "bar.val2",
				"type": "number",
				"value": 2
			}]
		};

		const result = updateToPipeline(update);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Implicit $updateReplaceMode single tier, multi-sub-operation with array value, implicit $replaceValue", () => {
		const update = {
			"$inc": {
				"bar.val": 1,
				"bar.val2": 2
			},
			"foo1": 1,
			"foo2": 2
		};

		const expected = {
			"instance": "",
			"op": "$updateReplaceMode",
			"path": "",
			"type": "array",
			"value": [{
				"instance": "",
				"op": "$inc",
				"path": "bar.val",
				"type": "number",
				"value": 1
			}, {
				"instance": "",
				"op": "$inc",
				"path": "bar.val2",
				"type": "number",
				"value": 2
			}, {
				"instance": "",
				"op": "$replaceValue",
				"path": "foo1",
				"type": "number",
				"value": 1
			}, {
				"instance": "",
				"op": "$replaceValue",
				"path": "foo2",
				"type": "number",
				"value": 2
			}]
		};

		const result = updateToPipeline(update);

		assert.deepStrictEqual(result, expected, "Correct");
	});

	it("Implicit $updateReplaceMode single tier, multi-sub-operation with array value, explicit $replaceValue", () => {
		const update = {
			"$inc": {
				"bar.val": 1,
				"bar.val2": 2
			},
			"$replaceValue": {
				"foo1": 1,
				"foo2": 2
			}
		};

		const expected = {
			"instance": "",
			"op": "$updateReplaceMode",
			"path": "",
			"type": "array",
			"value": [{
				"instance": "",
				"op": "$inc",
				"path": "bar.val",
				"type": "number",
				"value": 1
			}, {
				"instance": "",
				"op": "$inc",
				"path": "bar.val2",
				"type": "number",
				"value": 2
			}, {
				"instance": "",
				"op": "$replaceValue",
				"path": "foo1",
				"type": "number",
				"value": 1
			}, {
				"instance": "",
				"op": "$replaceValue",
				"path": "foo2",
				"type": "number",
				"value": 2
			}]
		};

		const result = updateToPipeline(update);

		assert.deepStrictEqual(result, expected, "Correct");
	});
});