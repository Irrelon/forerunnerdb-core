import Pipeline from "./Pipeline";
import OperationSuccess from "../operations/OperationSuccess";
import assert from "assert";
import OperationFailure from "../operations/OperationFailure";

describe("Pipeline", () => {
	describe("execute()", () => {
		it("Will correctly return data on success", async () => {
			const pipeline = new Pipeline();
			pipeline.addStep("preFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "first", "The return data is correct");
				
				return new OperationSuccess({
					"data": "second"
				});
			});
			
			pipeline.addStep("midFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "second", "The return data is correct");
				
				return new OperationSuccess({
					"data": "third"
				});
			});
			
			pipeline.addStep("postFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "third", "The return data is correct");
				
				return new OperationSuccess({
					"data": "fourth"
				});
			});
			
			const result = await pipeline.execute("first");
			
			assert.strictEqual(result.success.length, 3, "The number of successful results is correct");
			assert.strictEqual(result.success[0].data, "second", "The return data is correct");
			assert.strictEqual(result.success[1].data, "third", "The return data is correct");
			assert.strictEqual(result.success[2].data, "fourth", "The return data is correct");
		});
		
		it("Will correctly fail on a failure response", async () => {
			const pipeline = new Pipeline();
			pipeline.addStep("preFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "first", "The return data is correct");
				return new OperationSuccess({
					"data": "second"
				});
			});
			
			pipeline.addStep("midFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "second", "The return data is correct");
				return new OperationFailure({
					"data": "third"
				});
			});
			
			pipeline.addStep("postFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "third", "The return data is correct");
				return new OperationSuccess({
					"data": "fourth"
				});
			});
			
			const result = await pipeline.execute("first");
			
			assert.strictEqual(result.success.length, 2, "The number of successful results is correct");
			assert.strictEqual(result.failure.length, 1, "The number of failed results is correct");
			assert.strictEqual(result.success[0].data, "second", "The return data is correct");
			assert.strictEqual(result.success[1].data, "fourth", "The return data is correct");
			assert.strictEqual(result.failure[0].data, "third", "The return data is correct");
		});
		
		it("Will correctly fail completely on a failure response in atomic mode", async () => {
			const pipeline = new Pipeline();
			pipeline.addStep("preFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "first", "The return data is correct");
				return new OperationSuccess({
					"data": "second"
				});
			});
			
			pipeline.addStep("midFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "second", "The return data is correct");
				return new OperationFailure({
					"data": "third"
				});
			});
			
			pipeline.addStep("postFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "third", "The return data is correct");
				return new OperationSuccess({
					"data": "fourth"
				});
			});
			
			const result = await pipeline.execute("first", {"$atomic": true});
			
			assert.strictEqual(result.success.length, 0, "The number of successful results is correct");
			assert.strictEqual(result.failure.length, 1, "The number of failed results is correct");
			assert.strictEqual(result.failure[0].data, "third", "The return data is correct");
		});
		
		it("Will correctly fail at the first error in ordered mode", async () => {
			const pipeline = new Pipeline();
			pipeline.addStep("preFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "first", "The return data is correct");
				return new OperationSuccess({
					"data": "second"
				});
			});
			
			pipeline.addStep("midFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "second", "The return data is correct");
				return new OperationFailure({
					"data": "third"
				});
			});
			
			pipeline.addStep("postFlight", (data, originalData) => {
				assert.strictEqual(originalData, "first", "The return data is correct");
				assert.strictEqual(data, "third", "The return data is correct");
				return new OperationSuccess({
					"data": "fourth"
				});
			});
			
			const result = await pipeline.execute("first", {"$ordered": true});
			
			assert.strictEqual(result.success.length, 1, "The number of successful results is correct");
			assert.strictEqual(result.failure.length, 1, "The number of failed results is correct");
			assert.strictEqual(result.success[0].data, "second", "The return data is correct");
			assert.strictEqual(result.failure[0].data, "third", "The return data is correct");
		});
	});
});