import assert from "assert";
import Collection from "./Collection";

describe("Collection", () => {
	describe("operation()", () => {
		describe("Positive Path", () => {
			it("Can run an operation and provide the correct result", () => {
				const coll = new Collection();
				const result = coll.operation({
					"_id": "1"
				}, coll.indexViolationCheck);

				assert.strictEqual(result.success.length, 1, "Correct");
				assert.strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
			});

			it("Can run multiple operations and provide the correct result", () => {
				const coll = new Collection();
				const result = coll.operation([{
					"_id": "1"
				}, {
					"_id": "2"
				}], coll.indexViolationCheck);

				assert.strictEqual(result.success.length, 2, "Correct");
				assert.strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
				assert.strictEqual(result.success[1].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
			});
		});

		describe("Negative Path", () => {
			it("Can run an operation and provide the correct result", async () => {
				const coll = new Collection();
				await coll.insert({
					"_id": "1"
				});

				const result = coll.operation({
					"_id": "1"
				}, coll.indexViolationCheck);

				assert.strictEqual(result.success.length, 0, "Correct");
				assert.strictEqual(result.failure.length, 1, "Correct");
				assert.strictEqual(result.failure[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Correct");
			});

			it("Can run multiple operations and provide the correct result", async () => {
				const coll = new Collection();
				await coll.insert({
					"_id": "1"
				});
				const result = coll.operation([{
					"_id": "1"
				}, {
					"_id": "2"
				}], coll.indexViolationCheck);

				assert.strictEqual(result.success.length, 1, "Correct");
				assert.strictEqual(result.failure.length, 1, "Correct");
				assert.strictEqual(result.failure[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Correct");
				assert.strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
			});
		});
	});

	describe("CRUD", () => {
		describe("Create", () => {
			describe("insertOne()", () => {
				it("Can insert a single document", async () => {
					const coll = new Collection();
					const result = await coll.insertOne({
						"foo": true
					});

					assert.strictEqual(result.nInserted, 1, "Number of inserted documents is correct");
				});
			});

			describe("insertMany()", () => {
				describe("$ordered: true", () => {
					it("Can insert an array of documents ordered", async () => {
						const coll = new Collection();
						const result = await coll.insert([
							{"_id": 20, "item": "lamp", "qty": 50, "type": "desk"},
							{"_id": 21, "item": "lamp", "qty": 20, "type": "floor"},
							{"_id": 22, "item": "bulk", "qty": 100}
						], {"$ordered": true});

						assert.strictEqual(result.nInserted, 3, "Number of inserted documents is correct");
					});

					it("Can insert an array of documents ordered and fail correctly by index violation", async () => {
						const coll = new Collection();
						const result = await coll.insert([
							{"_id": 30, "item": "lamp", "qty": 50, "type": "desk"},
							{"_id": 30, "item": "lamp", "qty": 20, "type": "floor"},
							{"_id": 32, "item": "bulk", "qty": 100}
						], {"$ordered": true});

						// The below number should be 1 because we are inserting ordered so on the
						// second insert (which will fail) the operation should stop
						assert.strictEqual(result.nInserted, 1, "Number of inserted documents is correct");
						assert.strictEqual(result.nFailed, 1, "Number of failed documents is correct");
						assert.strictEqual(result.failures.length, 1, "Number of failed documents is correct");
						assert.strictEqual(result.failures[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Error code is correct");
					});
				});

				describe("$ordered: false", () => {
					it("Can insert an array of documents unordered", async () => {
						const coll = new Collection();
						const result = await coll.insert([
							{"_id": 20, "item": "lamp", "qty": 50, "type": "desk"},
							{"_id": 21, "item": "lamp", "qty": 20, "type": "floor"},
							{"_id": 22, "item": "bulk", "qty": 100}
						], {"$ordered": false});

						assert.strictEqual(result.nInserted, 3, "Number of inserted documents is correct");
					});

					it("Can insert an array of documents unordered and fail correctly by index violation", async () => {
						const coll = new Collection();
						const result = await coll.insert([
							{"_id": 40, "item": "lamp", "qty": 50, "type": "desk"},
							{"_id": 40, "item": "lamp", "qty": 20, "type": "floor"},
							{"_id": 42, "item": "bulk", "qty": 100},
							{"_id": 40, "item": "lamp", "qty": 20, "type": "floor"}
						], {"$ordered": false});

						const findResult1 = await coll.find();

						assert.strictEqual(result.nInserted, 2, "Number of inserted documents is correct");
						assert.strictEqual(result.nFailed, 2, "Number of failed documents is correct");
						assert.strictEqual(result.failures.length, 2, "Number of failed documents is correct");
						assert.strictEqual(result.failures[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Error code is correct");

						assert.strictEqual(findResult1.length, 2, "Number of documents is correct");
						assert.deepStrictEqual(findResult1, [{
							"_id": 40,
							"item": "lamp",
							"qty": 50,
							"type": "desk"
						}, {
							"_id": 42,
							"item": "bulk",
							"qty": 100
						}], "Correct value");
					});
				});

				// TODO: Add an atomic operation insert test
			});
		});

		describe("Read", () => {
			describe("find()", () => {

			});
		});

		describe("Update", () => {
			describe("updateOne()", () => {
				it("Can update a single document", async () => {
					const coll = new Collection();
					const insertResult = await coll.insertMany([{
						"_id": "1",
						"foo": true
					}, {
						"_id": "2",
						"foo": true
					}]);

					const findResult1 = await coll.findMany();

					const updateResult = await coll.updateOne({
						"_id": "1"
					}, {
						"foo": false,
						"newVal": "bar"
					});

					const findResult2 = await coll.findMany();

					assert.strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");
					assert.strictEqual(findResult1.length, 2, "Number of documents is correct");
					assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
					assert.strictEqual(findResult2.length, 2, "Number of documents is correct");
					assert.strictEqual(findResult2[0]._id, "1", "Number of documents is correct");
					assert.strictEqual(findResult2[0].foo, false, "Correct value");
					assert.deepStrictEqual(findResult2, [{
						"_id": "1",
						"foo": false,
						"newVal": "bar"
					}, {
						"_id": "2",
						"foo": true
					}], "Correct value");
				});

				it("Can update a single document with an operator", async () => {
					const coll = new Collection();
					const insertResult = await coll.insertMany([{
						"_id": "1",
						"count": 0
					}, {
						"_id": "2",
						"count": 12
					}]);

					const findResult1 = await coll.findMany();

					const updateResult = await coll.updateOne({
						"_id": "2"
					}, {
						"$inc": {
							"count": 2
						}
					});

					const findResult2 = await coll.findMany();

					assert.strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");
					assert.strictEqual(findResult1.length, 2, "Number of documents is correct");
					assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
					assert.strictEqual(findResult2.length, 2, "Number of documents is correct");
					assert.strictEqual(findResult2[1]._id, "2", "Number of documents is correct");
					assert.strictEqual(findResult2[1].count, 14, "Correct value");
					assert.deepStrictEqual(findResult2, [{
						"_id": "1",
						"count": 0
					}, {
						"_id": "2",
						"count": 14
					}], "Correct value");
				});
			});
		});

		describe("Delete", () => {
			describe("removeOne()", () => {
				it("Can remove a single document", async () => {
					const coll = new Collection();
					const insertResult = await coll.insert([{
						"_id": "1",
						"count": 0
					}, {
						"_id": "2",
						"count": 12
					}]);

					const findResult1 = await coll.find();

					const removeResult = await coll.removeOne({
						"_id": "2"
					});

					const findResult2 = await coll.find();

					assert.strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");
					assert.strictEqual(findResult1.length, 2, "Number of documents is correct");
					assert.strictEqual(removeResult.length, 1, "Number of documents is correct");
					assert.strictEqual(findResult2.length, 1, "Number of documents is correct");
					assert.deepStrictEqual(findResult2, [{
						"_id": "1",
						"count": 0
					}], "Correct value");
				});
			});

			describe("removeMany()", () => {
				it("Can remove multiple documents", async () => {
					const coll = new Collection();
					const insertResult = await coll.insert([{
						"_id": "1",
						"count": 0
					}, {
						"_id": "2",
						"count": 12
					}, {
						"_id": "3",
						"count": 12
					}, {
						"_id": "4",
						"count": 11
					}]);

					const findResult1 = await coll.find();

					const removeResult = await coll.removeMany({
						"count": {
							"$gt": 11
						}
					});

					const findResult2 = await coll.find();

					assert.strictEqual(insertResult.nInserted, 4, "Number of inserted documents is correct");
					assert.strictEqual(findResult1.length, 4, "Number of documents is correct");
					assert.strictEqual(removeResult.length, 2, "Number of documents is correct");
					assert.strictEqual(findResult2.length, 2, "Number of documents is correct");
					assert.deepStrictEqual(findResult2, [{
						"_id": "1",
						"count": 0
					}, {
						"_id": "4",
						"count": 11
					}], "Correct value");
				});
			});
		});
	});
});