import { CoreClass } from "../core/CoreClass";
import OperationFailure from "./OperationFailure";
import OperationSuccess from "./OperationSuccess";
import {OperationResult} from "../types/OperationResult";

export interface OperationResultsData {
	failure?: OperationFailure;
	success?: OperationSuccess;
}

class OperationResults extends CoreClass {
	resultCode: string | null = null;
	resultData: any = null;
	failure: OperationFailure[] = [];
	success: OperationSuccess[] = [];

	constructor (data: OperationResultsData = {}) {
		super();

		this.resultCode = null;
		this.resultData = null;
		this.failure = [];
		this.success = [];

		if (data.failure) {
			this.addFailure(data.failure);
		}

		if (data.success) {
			this.addSuccess(data.success);
		}
	}

	addResult (op: OperationResult) {
		if (Array.isArray(op)) {
			op.forEach((item) => {
				this.addResult(item);
			});

			return this;
		}

		if (op instanceof OperationFailure) {
			return this.addFailure(op);
		}

		return this.addSuccess(op);
	}

	/**
	 * Add an failure to the operation result.
	 * @param {OperationFailure|Array<OperationFailure>} failure The failure or array of failures.
	 * @returns {OperationResults} Returns a pointer to itself.
	 */
	addFailure (failure: OperationFailure) {
		if (Array.isArray(failure)) {
			failure.forEach((item) => {
				this.addFailure(item);
			});

			return this;
		}

		this.failure.push(failure);
		return this;
	}

	/**
	 * Add a success to the operation result.
	 * @param {OperationSuccess|Array<OperationSuccess>} success The success or array of successes.
	 * @returns {OperationResults} Returns a pointer to itself.
	 */
	addSuccess (success: OperationSuccess) {
		if (Array.isArray(success)) {
			success.forEach((item) => {
				this.addSuccess(item);
			});

			return this;
		}

		this.success.push(success);
		return this;
	}

	/**
	 * Removes all success results from the operation.
	 */
	clearSuccess () {
		this.success = [];
	}

	/**
	 * Removes all failure results from the operation.
	 */
	clearFailure () {
		this.failure = [];
	}

	// TODO: Find out what type `data` should be
	setResultData = (data: any) => {
		this.resultData = data;
	}
}

export default OperationResults;