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

/**
 * @callback StepFunction
 * @param {*} data The data the function is given by the pipeline.
 * @param {*} originalData The value of the data before any pipeline steps
 * changed it. This will always be the value that `data` was before it got
 * changed.
 */

class Pipeline extends CoreClass {
	constructor () {
		super();
		this._steps = new Map();
	}
	
	/**
	 * Add a step to the pipeline.
	 * @param {String} name The unique name of the step.
	 * @param {StepFunction} func The function to run when the step is executed.
	 * @param {ExecuteOptions} [options] An options object.
	 * @returns {Boolean} True if the step was added, false if a step of
	 * that name already exists.
	 */
	addStep (name, func, options) {
		if (this._steps.get(name)) return false;
		
		this._steps.set(name, {name, func, options});
		return true;
	}
	
	/**
	 * Removes a step from the pipeline by name.
	 * @param {String} name The name of the step to remove.
	 * @returns {void} Nothing.
	 */
	removeStep (name) {
		this._steps.delete(name);
	}
	
	/**
	 * Execute the pipeline steps with the passed data.
	 * @param {String} name The name of the step to execute.
	 * @param {Object} [data] The data to pass to the pipeline.
	 * @param {Object} [originalData] The original data passed to the
	 * pipeline. This is different from `data` in that `data` can be
	 * updated by a pipeline step whereas `originalData` remains the
	 * value that `data` was originally before the pipeline was executed.
	 * @returns {OperationSuccess|OperationFailure} The result of the operation.
	 */
	executeStep (name, data, originalData) {
		const step = this._steps.get(name);
		if (!step) throw new Error(`No step with the name "${name}" exists!`);
		
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
	 * @returns {OperationResult} The result of the operation.
	 */
	execute (data, options = {"$atomic": false, "$ordered": false}) {
		const operationResult = new OperationResult();
		const originalData = data;
		const steps = this._steps.keys();

		let iteratorResult;
		let currentStepData = data;
		
		while ((iteratorResult = steps.next())) {
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