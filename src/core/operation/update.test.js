import assert from "assert";
import {update} from "./update";

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
		});
	});
});