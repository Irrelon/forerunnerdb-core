"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _match = require("./match");

var _assert = _interopRequireDefault(require("assert"));

var _build = require("./build");

var _data = require("../../test/data");

describe("match", () => {
	describe("$eeq", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$eeq)(true, true);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$eeq)("true", "true");

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$eeq)(12, 12);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$eeq)(null, null);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$eeq)(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$eeq)(true, false);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$eeq)("true", "false");

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$eeq)(12, 13);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$eeq)(null, "foo");

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$eeq)(new Date("2020-02-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("$eq", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$eq)(true, 1);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$eq)("1", 1);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$eq)("12", 12);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$eq)(null, null);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$eq)(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$eq)(false, 1);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$eq)("1", 2);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$eq)("12", 13);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$eq)(null, "null");

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$eq)(new Date("2020-02-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("$in", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$in)(true, [false, true]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$in)("true", ["foo", "true"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$in)(12, [5, 8, 12]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$in)(null, ["foo", null]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$in)(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-02-01T00:00:00Z")]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$in)(true, [false]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$in)("true", ["false"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$in)(12, [13]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$in)(null, ["foo"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$in)(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-03-01T00:00:00Z")]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("$nin", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$nin)(true, [false]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$nin)("true", ["false"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$nin)(12, [13]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$nin)(null, ["foo"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$nin)(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-03-01T00:00:00Z")]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$nin)(true, [false, true]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$nin)("true", ["foo", "true"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$nin)(12, [5, 8, 12]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$nin)(null, ["foo", null]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Date", () => {
				var result = (0, _match.$nin)(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-02-01T00:00:00Z")]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("$fastIn", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$fastIn)(true, [false, true]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$fastIn)("true", ["foo", "true"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$fastIn)(12, [5, 8, 12]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$fastIn)(null, ["foo", null]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$fastIn)(true, [false]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$fastIn)("true", ["false"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$fastIn)(12, [13]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$fastIn)(null, ["foo"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("$fastNin", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				var result = (0, _match.$fastNin)(true, [false]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$fastNin)("true", ["false"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$fastNin)(12, [13]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$fastNin)(null, ["foo"]);

				_assert["default"].strictEqual(result, true, "Correct");
			});
		});
		describe("Negative", () => {
			it("Boolean", () => {
				var result = (0, _match.$fastNin)(true, [false, true]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("String", () => {
				var result = (0, _match.$fastNin)("true", ["foo", "true"]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Number", () => {
				var result = (0, _match.$fastNin)(12, [5, 8, 12]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
			it("Null", () => {
				var result = (0, _match.$fastNin)(null, ["foo", null]);

				_assert["default"].strictEqual(result, false, "Correct");
			});
		});
	});
	describe("matchPipeline", () => {
		describe("Positive", () => {
			it("String", () => {
				var query = {
					"str": "30489yj340"
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, true);
			});
			it("Number", () => {
				var query = {
					"_id": 1
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, true);
			});
			it("Date", () => {
				var query = {
					"bar.dt": new Date("2020-01-01T00:00:00Z")
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, true);
			});
		});
		describe("Negative", () => {
			it("String", () => {
				var query = {
					"str": "30489yj341"
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, false);
			});
			it("Number", () => {
				var query = {
					"_id": 93847
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, false);
			});
			it("Date", () => {
				var query = {
					"bar.dt": new Date("2020-12-01T00:00:00Z")
				};
				var pipeline = (0, _build.queryToPipeline)(query);
				var result = (0, _match.matchPipeline)(pipeline, _data.data[0]);

				_assert["default"].strictEqual(result, false);
			});
		});
	});
});