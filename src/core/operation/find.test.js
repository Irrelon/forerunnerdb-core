import find from "./find";
import assert from "assert";
import {data} from "../../testData/data";

describe("find()", () => {
	describe("Number", () => {
		it("$eeq", () => {
			const query = {
				"_id": 1
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 1, "Number of results is correct");
			assert.strictEqual(result[0]._id, 1, "ID is correct");
		});

		it("$eeq explicit", () => {
			const query = {
				"_id": {
					"$eeq": 1
				}
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 1, "Number of results is correct");
			assert.strictEqual(result[0]._id, 1, "ID is correct");
		});
	});

	describe("String", () => {
		it("$eeq", () => {
			const query = {
				"bar.name": "Amelia"
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 1, "Number of results is correct");
			assert.strictEqual(result[0]._id, 5, "ID is correct");
		});

		it("$in", () => {
			const query = {
				"bar.name": {
					"$in": ["Amelia", "Andy"]
				}
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 2, "Number of results is correct");
			assert.strictEqual(result[0]._id, 1, "ID is correct");
			assert.strictEqual(result[1]._id, 5, "ID is correct");
		});
	});

	describe("Boolean", () => {
		it("$eeq", () => {
			const query = {
				"bar.foo": false
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 1, "Number of results is correct");
			assert.strictEqual(result[0]._id, 2, "ID is correct");
		});

		it("Matches based on sub-documents", () => {
			const query = {
				"arr": {
					"goof": true,
					"fun": false
				}
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 1, "Number of results is correct");
			assert.strictEqual(result[0]._id, 2, "ID is correct");
		});

		it("Matches based on gated sub-documents", () => {
			const query = {
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

			const result = find(data, query);

			assert.strictEqual(result.length, 2, "Number of results is correct");
			assert.strictEqual(result[0]._id, 1, "ID is correct");
			assert.strictEqual(result[1]._id, 2, "ID is correct");
		});
	});

	describe("Boolean, Date", () => {
		it("$gt, $lte, $eeq", () => {
			const query = {
				"bar.foo": true,
				"bar.dt": {
					"$gt": new Date("2020-02-01T00:00:00Z"),
					"$lte": new Date("2020-04-01T00:00:00Z")
				}
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 2, "Number of results is correct");
			assert.strictEqual(result[0]._id, 3, "ID is correct");
			assert.strictEqual(result[1]._id, 4, "ID is correct");
		});
	});

	describe("Gates", () => {
		it("$and", () => {
			const query = {
				"$and": [{
					"bar.foo": true,
					"bar.dt": {
						"$gt": new Date("2020-02-01T00:00:00Z"),
						"$lte": new Date("2020-04-01T00:00:00Z")
					}
				}]
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 2, "Number of results is correct");
			assert.strictEqual(result[0]._id, 3, "ID is correct");
			assert.strictEqual(result[1]._id, 4, "ID is correct");
		});

		it("$or", () => {
			const query = {
				"$or": [{
					"bar.foo": true,
					"bar.dt": {
						"$gt": new Date("2020-02-01T00:00:00Z"),
						"$lte": new Date("2020-04-01T00:00:00Z")
					}
				}]
			};

			const result = find(data, query);

			assert.strictEqual(result.length, 4, "Number of results is correct");
			assert.strictEqual(result[0]._id, 1, "ID is correct");
			assert.strictEqual(result[1]._id, 3, "ID is correct");
			assert.strictEqual(result[2]._id, 4, "ID is correct");
			assert.strictEqual(result[3]._id, 5, "ID is correct");
		});
	});

	describe("Arrays of objects", () => {
		const arr = [
			{
				"address_id": "120167000000088001",
				"attention": "Test New Address ATTN",
				"address": "6 Moohove Drive",
				"street2": "Winsoken",
				"city": "Tailbeach",
				"state": "Harpinshire",
				"zip": "PE28 9QT",
				"country": "United Kingdom",
				"phone": "",
				"fax": ""
			},
			{
				"address_id": "120167000000088007",
				"attention": "Bilbo Baggins",
				"address": "1 The Shrire",
				"street2": "Rolling Hills Road",
				"city": "Shiretown",
				"state": "Cambridgeshire",
				"zip": "QT68 2ZZ",
				"country": "United Kingdom",
				"phone": "",
				"fax": ""
			}
		];

		const query = {
			"attention": "Bilbo Baggins",
			"address": "1 The Shrire",
			"street2": "Rolling Hills Road",
			"city": "Shiretown",
			"state": "Cambridgeshire",
			"zip": "QT68 2ZZ",
			"country": "United Kingdom",
			"phone": "",
			"fax": ""
		};

		const result = find(arr, query);

		assert.strictEqual(result.length, 1, "Number of results is correct");
		assert.strictEqual(result[0].address_id, "120167000000088007", "ID is correct");
		assert.strictEqual(result[0].attention, "Bilbo Baggins", "Details correct");
		assert.strictEqual(result[0].address, "1 The Shrire", "Details correct");
		assert.strictEqual(result[0].street2, "Rolling Hills Road", "Details correct");
		assert.strictEqual(result[0].city, "Shiretown", "Details correct");
		assert.strictEqual(result[0].state, "Cambridgeshire", "Details correct");
		assert.strictEqual(result[0].zip, "QT68 2ZZ", "Details correct");
		assert.strictEqual(result[0].country, "United Kingdom", "Details correct");
		assert.strictEqual(result[0].phone, "", "Details correct");
		assert.strictEqual(result[0].fax, "", "Details correct");
	});
});