import assert from "assert";
import {update} from "./update";
import {$replaceValue} from "./operate.js";

describe("update", () => {
	describe("Modes of operation", () => {
		it("By query", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, false, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("By query with $in", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": "true"
			}, {
				"_id": "3",
				"foo": false
			}, {
				"_id": "4",
				"foo": "false"
			}];

			assert.strictEqual(dataArr.length, 4, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"foo": {
					$in: [true, "true"]
				}
			}, {
				"foo": false,
				"newVal": "bar"
			});

			assert.strictEqual(updateResult.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 4, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, false, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "2",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "3",
				"foo": false
			}, {
				"_id": "4",
				"foo": "false"
			}], "Correct value");
		});

		it("By query with nested $in", async () => {
			const dataArr = [{
				"_id": "1",
				arr: [{
					"foo": true,
					arr: [{
						"foo": "some value"
					}, {
						"foo": "some other value"
					}, {
						"foo": true
					}, {
						"foo": "true"
					}, {
						"foo": "some value"
					}, {
						"foo": "some other value"
					}]
				}, {
					"foo": "true"
				}, {
					"foo": false
				}, {
					"foo": "false"
				}]
			}];

			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");

			// Where I left this was that this use case doesn't work yet. We don't have a way to track
			// the array indexes of each path that was modified in order to apply the update to the
			// correct sub-document. I'm also not sure about the update query structure and if it should
			// have an array index placeholder with a $ so that we know we should be filling in the
			// array index data there. I almost certainly think we should be.

			// As we match and iterate through an array, let's record the array indexes
			// that way, each array we encounter can have the index recorded so if we iterate
			// through two arrays the indexes might be recorded as [[0, 3], [1, 2]] then this can be
			// passed to the update operation and for each index list, we can fill the appropriate
			// index values where the dollars are and target the correct item in the object to
			// update. We need an array of array indexes because multiple sub-documents can match
			// a query so the update needs to be applied to each matching sub document
			const updateResult = await update(dataArr, {
				"arr.arr.foo": {
					$in: [true, "true"]
				}
			}, {
				"arr.$.arr.$.foo": false,
				"arr.$.arr.$.newVal": "bar"
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				arr: [{
					"foo": true,
					arr: [{
						"foo": "some value"
					}, {
						"foo": "some other value"
					}, {
						"foo": false,
						"newVal": "bar"
					}, {
						"foo": false,
						"newVal": "bar"
					}, {
						"foo": "some value"
					}, {
						"foo": "some other value"
					}]
				}, {
					"foo": "true"
				}, {
					"foo": false
				}, {
					"foo": "false"
				}]
			}], "Correct value");
		});

		it("By query with $exists", async () => {
			const dataArr = [{
				"_id": "1",
				"arr": undefined
			}, {
				"_id": "2",
				"arr": []
			}, {
				"_id": "3",
				"arr": [{here: true}]
			}, {
				"_id": "4",
				"arr": [{here: false}]
			}];

			assert.strictEqual(dataArr.length, 4, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"arr": {
					$exists: false
				}
			}, {
				$set: {
					"arr": [{here: true}]
				}
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 4, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"arr": [{here: true}]
			}, {
				"_id": "2",
				"arr": []
			}, {
				"_id": "3",
				"arr": [{here: true}]
			}, {
				"_id": "4",
				"arr": [{here: false}]
			}], "Correct value");
		});

		it("Using $one", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, false, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $skipAssignment", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			}, {
				"$skipAssignment": true
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.notStrictEqual(dataArr, updateResult, "Data has been immutably updated");
			assert.notStrictEqual(dataArr[0], updateResult[0], "Data has been immutably updated");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
			assert.deepStrictEqual(updateResult, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}], "Correct value");
		});

		it("Using $preFlight() false result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			}, {
				"$preFlight": (doc) => {
					return doc._id !== "1";
				}
			});

			assert.strictEqual(updateResult.length, 0, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, true, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				}
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, false, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result, $postFlight() false result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				},
				"$postFlight": (updatedDoc, originalDoc) => {
					return updatedDoc._id !== "1";
				}
			});

			assert.strictEqual(updateResult.length, 0, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, true, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});

		it("Using $preFlight() true result, $postFlight() true result", async () => {
			const dataArr = [{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}];

			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

			const updateResult = await update(dataArr, {
				"_id": "1"
			}, {
				"foo": false,
				"newVal": "bar"
			}, {
				"$preFlight": (doc) => {
					return doc._id === "1";
				},
				"$postFlight": (updatedDoc, originalDoc) => {
					return updatedDoc._id === "1";
				}
			});

			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
			assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
			assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
			assert.strictEqual(dataArr[0].foo, false, "Correct value");
			assert.deepStrictEqual(dataArr, [{
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			}, {
				"_id": "2",
				"foo": true
			}], "Correct value");
		});
	});

	describe("Operations", () => {
		describe("$inc", () => {
			it("Increase by value", async () => {
				const dataArr = [{
					"_id": "1",
					"data": {"val": 1}
				}, {
					"_id": "2",
					"data": {"val": 12}
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$inc": {
						"data.val": 1
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.strictEqual(dataArr[0].data.val, 2, "Correct value");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": {"val": 2}
				}, {
					"_id": "2",
					"data": {"val": 12}
				}], "Correct value");
			});

			it("Decrease by value", async () => {
				const dataArr = [{
					"_id": "1",
					"data": {"val": 1}
				}, {
					"_id": "2",
					"data": {"val": 12}
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$inc": {
						"data.val": -1
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": {"val": 0}
				}, {
					"_id": "2",
					"data": {"val": 12}
				}], "Correct value");
			});
		});

		describe("$push", () => {
			it("Add item to array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 12}]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$push": {
						"data": {"val": 24}
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 12}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});
		});

		describe("$pull", () => {
			it("Remove object from array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 12}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$pull": {
						"data": {"val": 12}
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});

			it("Remove number from array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [1, 12, 24]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$pull": {
						"data": 12
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [1, 24]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});

			it("Remove first string from array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": ["1", "12", "12", "24", 1, 12, true]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$pull": {
						"data": "12"
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": ["1", "12", "24", 1, 12, true]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});

			it("Remove first object from array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [{"val": {"calc": 1, "foo": false}}, {"val": {"calc": 12, "foo": true}}, {"val": {"calc": 24, "foo": "bar"}}]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$pull": {
						"data": {"val": {"calc": 12}}
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [{"val": {"calc": 1, "foo": false}}, {"val": {"calc": 24, "foo": "bar"}}]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});
		});

		describe("$pop", () => {
			it("Pops the first item from the end of the array", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 12}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$pop": {
						"data": true
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [{"val": 1}, {"val": 12}]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
			});
		});

		describe("$unset", () => {
			it("Removes a key from an object at the specified path with array indexes", async () => {
				const dataArr = [{
					"_id": "1",
					"data": [{"val": 1, "other": true}, {"val": 12}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}];

				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");

				const updateResult = await update(dataArr, {
					"_id": "1"
				}, {
					"$unset": {
						"data.0.val": 1
					}
				});

				assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
				assert.strictEqual(dataArr.length, 2, "Number of documents is correct");
				assert.strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
				assert.deepStrictEqual(dataArr, [{
					"_id": "1",
					"data": [{"other": true}, {"val": 12}, {"val": 24}]
				}, {
					"_id": "2",
					"data": []
				}], "Correct value");
				const keys = Object.keys(dataArr[0].data[0]);

				assert.strictEqual(keys.indexOf("val"), -1, "Key is not present");
			});
		});
	});
});