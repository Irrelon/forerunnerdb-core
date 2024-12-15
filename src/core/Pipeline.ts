import {CoreClass} from "./CoreClass";
import OperationResults from "../operations/OperationResults";
import OperationFailure from "../operations/OperationFailure";
import {PipelineStepExecutionOptions} from "../types/PipelineStepExecutionOptions";
import {PipelineStepFunction} from "../types/PipelineStepFunction";
import {PipelineStep} from "../types/PipelineStep";
import {OperationResult} from "../types/OperationResult";

class Pipeline extends CoreClass {
	_steps: Map<string, PipelineStep>;

	constructor () {
		super();
		this._steps = new Map();
	}

	/**
	 * Add a step to the pipeline.
	 * @param {string} name The unique name of the step.
	 * @param {PipelineStepFunction} func The function to run when the step is executed.
	 * @param {PipelineStepExecutionOptions} [options] An options object.
	 * @returns {Boolean} True if the step was added, false if a step of
	 * that name already exists.
	 */
	addStep (name: string, func: PipelineStepFunction, options: PipelineStepExecutionOptions): boolean {
		if (this._steps.get(name)) return false;

		this._steps.set(name, {name, func, options});
		return true;
	}

	/**
	 * Removes a step from the pipeline by name.
	 * @param {string} name The name of the step to remove.
	 * @returns {void} Nothing.
	 */
	removeStep (name: string): void {
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
	 * @returns {Promise<OperationResult>} The result of the operation.
	 */
	executeStep = async (name: string, data: any, originalData: any): Promise<OperationResult> => {
		const step = this._steps.get(name);
		if (!step) throw new Error(`No step with the name "${name}" exists!`);

		return await step.func(data, originalData);
	}

	/**
	 * Execute the pipeline steps with the passed data.
	 * @param {Object} [data] The data to pass to the pipeline.
	 * @param {PipelineStepExecutionOptions} options An options object.
	 * @returns {Promise<OperationResults>} The result of the operation.
	 */
	execute = async (data: any, options: PipelineStepExecutionOptions = {"$atomic": false, "$ordered": false}): Promise<OperationResults> => {
		const operationResult = new OperationResults();
		const originalData = data;
		const steps = this._steps.keys();

		let iteratorResult;
		let currentStepData = data;

		while ((iteratorResult = steps.next())) {
			if (iteratorResult.done) {
				break;
			}

			const stepName = iteratorResult.value;
			const stepResult = await this.executeStep(stepName, currentStepData, originalData);

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
			if (stepResult.data !== undefined) {
				currentStepData = stepResult.data;
			}
		}

		return operationResult;
	}
}

export default Pipeline;