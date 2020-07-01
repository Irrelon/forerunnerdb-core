import CoreClass from "../core/CoreClass";

/**
 * @typedef {Object} OperationSuccessData
 * @property {String} [type=""] The type of success.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere down the chain.
 * @property {*} [data] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */

class OperationSuccess extends CoreClass {
	/**
	 * Creates a new success response to an operation.
	 * @param {OperationSuccessData} info The operation result.
	 */
	constructor (info) {
		super();
		
		this.type = info.type || "";
		this.meta = info.meta;
		this.data = info.data;
	}
}

export default OperationSuccess;