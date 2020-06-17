import CoreClass from "../core/CoreClass";

/**
 * @typedef {Object} OperationFailureData
 * @property {String} [type=""] The type of failure. Useful for
 * signalling failure context to downstream code.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere downstream.
 * @property {*} [returnData] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */

class OperationFailure extends CoreClass {
	/**
	 * Creates a new failure response to an operation.
	 * @param {OperationFailureData} data The operation result.
	 */
	constructor (data) {
		super();
		
		this.type = data.type|| "";
		this.meta = data.meta;
		this.returnData = data.returnData;
	}
}

export default OperationFailure;