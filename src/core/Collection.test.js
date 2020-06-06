import assert from "assert";
import Collection from "./Collection";
import OperationSuccess from "../operations/OperationSuccess";
import OperationFailure from "../operations/OperationFailure";

describe("Collection", () => {
	describe("operation()", () => {
		describe("Positive Path", () => {
			it("Can run an operation and provide the correct result", () => {
				const coll = new Collection();
				const result = coll.operation({
					"_id": "1"
				}, coll.indexViolationCheck);
				
				assert.strictEqual(result.success.length, 1, "Correct");
				assert.strictEqual(result.success[0].type, OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS, "Correct");
			});
			
			it("Can run multiple operations and provide the correct result", () => {
				const coll = new Collection();
				const result = coll.operation([{
					"_id": "1"
				}, {
					"_id": "2"
				}], coll.indexViolationCheck);
				
				assert.strictEqual(result.success.length, 2, "Correct");
				assert.strictEqual(result.success[0].type, OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS, "Correct");
				assert.strictEqual(result.success[1].type, OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS, "Correct");
			});
		})
		
		describe("Negative Path", () => {
			it("Can run an operation and provide the correct result", () => {
				const coll = new Collection();
				coll.insert({
					"_id": "1"
				});
				
				const result = coll.operation({
					"_id": "1"
				}, coll.indexViolationCheck);
				
				assert.strictEqual(result.success.length, 0, "Correct");
				assert.strictEqual(result.failure.length, 1, "Correct");
				assert.strictEqual(result.failure[0].type, OperationFailure.constants.INDEX_VIOLATION, "Correct");
			});
			
			it("Can run multiple operations and provide the correct result", () => {
				const coll = new Collection();
				coll.insert({
					"_id": "1"
				});
				const result = coll.operation([{
					"_id": "1"
				}, {
					"_id": "2"
				}], coll.indexViolationCheck);
				
				assert.strictEqual(result.success.length, 1, "Correct");
				assert.strictEqual(result.failure.length, 1, "Correct");
				assert.strictEqual(result.failure[0].type, OperationFailure.constants.INDEX_VIOLATION, "Correct");
				assert.strictEqual(result.success[0].type, OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS, "Correct");
			});
		});
	});
	
	describe("insert()", () => {
		it("Can insert a single data object", async () => {
			const coll = new Collection();
			const result = await coll.insert({
				"foo": true
			});
			
			assert.strictEqual(result.nInserted, 1, "Number of inserted documents is correct");
		});
		
		it("Can insert an array of data", async () => {
			const coll = new Collection();
			const result = await coll.insert([
				{_id: 20, item: "lamp", qty: 50, type: "desk"},
				{_id: 21, item: "lamp", qty: 20, type: "floor"},
				{_id: 22, item: "bulk", qty: 100}
			], {ordered: true});
			
			assert.strictEqual(result.nInserted, 3, "Number of inserted documents is correct");
		});
		
		it("Can insert an array of data unordered", async () => {
			const coll = new Collection();
			const result = await coll.insert([
				{_id: 20, item: "lamp", qty: 50, type: "desk"},
				{_id: 21, item: "lamp", qty: 20, type: "floor"},
				{_id: 22, item: "bulk", qty: 100}
			], {ordered: false});
			
			assert.strictEqual(result.nInserted, 3, "Number of inserted documents is correct");
		});
		
		it("Can insert an array of data ordered and fail correctly", async () => {
			const coll = new Collection();
			const result = await coll.insert([
				{_id: 30, item: "lamp", qty: 50, type: "desk"},
				{_id: 30, item: "lamp", qty: 20, type: "floor"},
				{_id: 32, item: "bulk", qty: 100}
			], {ordered: true});
			
			// The below number should be 1 because we are inserting ordered so on the
			// second insert (which will fail) the operation should stop
			assert.strictEqual(result.nInserted, 1, "Number of inserted documents is correct");
			assert.strictEqual(result.nFailed, 1, "Number of failed documents is correct");
			assert.strictEqual(result.stage.postflight.failure.length, 1, "Number of failed documents is correct");
			assert.strictEqual(result.stage.postflight.failure[0].type, OperationFailure.constants.INDEX_VIOLATION, "Error code is correct");
		});
		
		it("Can insert an array of data unordered and fail correctly", async () => {
			const coll = new Collection();
			const result = await coll.insert([
				{_id: 40, item: "lamp", qty: 50, type: "desk"},
				{_id: 40, item: "lamp", qty: 20, type: "floor"},
				{_id: 42, item: "bulk", qty: 100},
				{_id: 40, item: "lamp", qty: 20, type: "floor"},
			], {ordered: false});
			
			assert.strictEqual(result.nInserted, 2, "Number of inserted documents is correct");
			assert.strictEqual(result.nFailed, 2, "Number of failed documents is correct");
			assert.strictEqual(result.stage.postflight.failure.length, 2, "Number of failed documents is correct");
			assert.strictEqual(result.stage.postflight.failure[0].type, OperationFailure.constants.INDEX_VIOLATION, "Error code is correct");
		});
	});
	
	describe("update()", () => {
		it("Can update a single data object", async () => {
			const coll = new Collection();
			const insertResult = await coll.insert([{
				"_id": "1",
				"foo": true
			}, {
				"_id": "2",
				"foo": true
			}]);
			
			const findResult1 = await coll.find();
			
			const updateResult = await coll.updateOne({
				"_id": "1"
			}, {
				"_id": "1",
				"foo": false,
				"newVal": "bar"
			});
			
			assert.strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");
			assert.strictEqual(findResult1.length, 2, "Number of documents is correct");
			assert.strictEqual(updateResult.length, 1, "Number of documents is correct");
		});
	});
	
	describe("remove()", () => {
	
	});
});