import {$eeq, $eq, $in, $nin, $fastIn, $fastNin, matchPipeline} from "./match";
import assert from "assert";
import {queryToPipeline} from "./build";
import {data} from "../../testData/data";

describe("match", () => {
	describe("$eeq", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $eeq(true, true);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $eeq("true", "true");
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $eeq(12, 12);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $eeq(null, null);
				assert.strictEqual(result, true, "Correct");
			});

			it("Date", () => {
				const result = $eeq(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $eeq(true, false);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $eeq("true", "false");
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $eeq(12, 13);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $eeq(null, "foo");
				assert.strictEqual(result, false, "Correct");
			});

			it("Date", () => {
				const result = $eeq(new Date("2020-02-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("$eq", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $eq(true, 1);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $eq("1", 1);
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $eq("12", 12);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $eq(null, null);
				assert.strictEqual(result, true, "Correct");
			});

			it("Date", () => {
				const result = $eq(new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $eq(false, 1);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $eq("1", 2);
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $eq("12", 13);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $eq(null, "null");
				assert.strictEqual(result, false, "Correct");
			});

			it("Date", () => {
				const result = $eq(new Date("2020-02-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("$in", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $in(true, [false, true]);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $in("true", ["foo", "true"]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $in(12, [5, 8, 12]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $in(null, ["foo", null]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Date", () => {
				const result = $in(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-02-01T00:00:00Z")]);
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $in(true, [false]);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $in("true", ["false"]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $in(12, [13]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $in(null, ["foo"]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Date", () => {
				const result = $in(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-03-01T00:00:00Z")]);
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("$nin", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $nin(true, [false]);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $nin("true", ["false"]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $nin(12, [13]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $nin(null, ["foo"]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Date", () => {
				const result = $nin(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-03-01T00:00:00Z")]);
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $nin(true, [false, true]);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $nin("true", ["foo", "true"]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $nin(12, [5, 8, 12]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $nin(null, ["foo", null]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Date", () => {
				const result = $nin(new Date("2020-02-01T00:00:00Z"), [new Date("2020-01-01T00:00:00Z"), new Date("2020-02-01T00:00:00Z")]);
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("$fastIn", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $fastIn(true, [false, true]);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $fastIn("true", ["foo", "true"]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $fastIn(12, [5, 8, 12]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $fastIn(null, ["foo", null]);
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $fastIn(true, [false]);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $fastIn("true", ["false"]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $fastIn(12, [13]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $fastIn(null, ["foo"]);
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("$fastNin", () => {
		describe("Positive", () => {
			it("Boolean", () => {
				const result = $fastNin(true, [false]);
				assert.strictEqual(result, true, "Correct");
			});

			it("String", () => {
				const result = $fastNin("true", ["false"]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Number", () => {
				const result = $fastNin(12, [13]);
				assert.strictEqual(result, true, "Correct");
			});

			it("Null", () => {
				const result = $fastNin(null, ["foo"]);
				assert.strictEqual(result, true, "Correct");
			});
		});

		describe("Negative", () => {
			it("Boolean", () => {
				const result = $fastNin(true, [false, true]);
				assert.strictEqual(result, false, "Correct");
			});

			it("String", () => {
				const result = $fastNin("true", ["foo", "true"]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Number", () => {
				const result = $fastNin(12, [5, 8, 12]);
				assert.strictEqual(result, false, "Correct");
			});

			it("Null", () => {
				const result = $fastNin(null, ["foo", null]);
				assert.strictEqual(result, false, "Correct");
			});
		});
	});

	describe("matchPipeline", () => {
		describe("Positive", () => {
			it("String", () => {
				const query = {
					"str": "30489yj340"
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, true);
			});

			it("Number", () => {
				const query = {
					"_id": 1
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, true);
			});

			it("Date", () => {
				const query = {
					"bar.dt": new Date("2020-01-01T00:00:00Z")
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, true);
			});
		});

		describe("Negative", () => {
			it("String", () => {
				const query = {
					"str": "30489yj341"
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, false);
			});

			it("Number", () => {
				const query = {
					"_id": 93847
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, false);
			});

			it("Date", () => {
				const query = {
					"bar.dt": new Date("2020-12-01T00:00:00Z")
				};

				const pipeline = queryToPipeline(query);
				const result = matchPipeline(pipeline, data[0]);

				assert.strictEqual(result, false);
			});
		});
	});
});