import CoreClass from "./CoreClass";
import OperationResult from "../operations/OperationResult";
import OperationSuccess from "../operations/OperationSuccess";
import OperationFailure from "../operations/OperationFailure";

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

		const stepResult = step.func(data, originalData);

		// Check the result conforms with our expected output
		if (!(stepResult instanceof OperationSuccess || stepResult instanceof OperationFailure)) {
			throw new Error(`Return value from step "${name}" was not an OperationSuccess or OperationFailure instance!`);
		}

		return stepResult;
	}

	execute (data, options = {$atomic: false, $ordered: false}) {
		const operationResult = new OperationResult();
		const originalData = data;
		const steps = this._steps.keys();

		let currentStepData = data;

		for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
			const stepName = steps[stepIndex];
			const stepResult = this.executeStep(stepName, currentStepData, originalData);

			// Check if we are atomic and have a failure
			if (options.$atomic && stepResult instanceof OperationFailure) {
				// Fail the entire pipeline
				operationResult.addFailure(stepResult);
				return operationResult;
			}

			// Add the result to the overall operation
			operationResult.addResult(stepResult);


		}

		this._steps.forEach(([stepName, step]) => {

		});
	}
}

export default Pipeline;