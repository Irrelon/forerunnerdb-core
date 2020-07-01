import CoreClass from "../core/CoreClass";

/**
 * @typedef {Object} OperationFailureData
 * @property {String} [type=""] The type of failure. Useful for
 * signalling failure context to downstream code.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere downstream.
 * @property {*} [data] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */

class OperationFailure extends CoreClass {
	/**
	 * Creates a new failure response to an operation.
	 * @param {OperationFailureData} info The operation result.
	 */
	constructor (info) {
		super();
		
		this.type = info.type || "";
		this.meta = info.meta;
		this.data = info.data;
	}
}

export default OperationFailure;