import CoreClass from "./CoreClass";
import OperationResult from "../operations/OperationResult";
import OperationSuccess from "../operations/OperationSuccess";
import OperationFailure from "../operations/OperationFailure";

/**
 * @typedef {Object} ExecuteOptions
 * @property {Boolean} [$atomic] If true, any failure at any point in the
 * pipeline will result in the complete failure of the whole pipeline.
 * @property {Boolean} [$ordered] If true, any failure at any point in the
 * pipeline will result in the pipeline cancelling at that point but all
 * previous work will remain in place.
 */

class Pipeline extends CoreClass {
	constructor () {
		super();
		this._steps = new Map();
	}
	
	addStep (name, func, options) {
		this._steps.set(name, {name, func, options});
	}

	removeStep (name) {
		this._steps.delete(name);
	}

	executeStep (name, data, originalData) {
		const step = this._steps.get(name);
		if (!step) throw new Error(`No step with the name "${name}" exists!`);
		console.log(`Executing step: ${name}`);
		const stepResult = step.func(data, originalData);

		// Check the result conforms with our expected output
		if (!(stepResult instanceof OperationSuccess || stepResult instanceof OperationFailure)) {
			throw new Error(`Return value from step "${name}" was not an OperationSuccess or OperationFailure instance!`);
		}

		return stepResult;
	}

	/**
	 * Execute the pipeline steps with the passed data.
	 * @param {Object} [data] The data to pass to the pipeline.
	 * @param {ExecuteOptions} options An options object.
	 * @returns {OperationResult}
	 */
	execute (data, options = {$atomic: false, $ordered: false}) {
		const operationResult = new OperationResult();
		const originalData = data;
		const steps = this._steps.keys();

		let iteratorResult;
		let currentStepData = data;
		console.log(`Executing pipeline...`);
		while (iteratorResult = steps.next()) {
			if (iteratorResult.done) {
				break;
			}

			const stepName = iteratorResult.value;
			const stepResult = this.executeStep(stepName, currentStepData, originalData);

			// Check if we are atomic and have a failure
			if (stepResult instanceof OperationFailure) {
				if (options.$atomic) {
					// Fail the entire pipeline
					operationResult.clearSuccess();
					operationResult.addFailure(stepResult);
					return operationResult;
				}

				if (options.$ordered) {
					// Fail the rest of the pipeline
					operationResult.addFailure(stepResult);
					return operationResult;
				}
			}

			// Add the result to the overall operation
			operationResult.addResult(stepResult);

			// Check if the result provided us with new data to pass to the
			// next step in the pipeline
			if (stepResult.returnData !== undefined) {
				currentStepData = stepResult.returnData;
			}
		}

		return operationResult;
	}
}

export default Pipeline;