import CoreClass from "../core/CoreClass";

/**
 * @typedef {Object} OperationSuccessData
 * @property {String} [type=""] The type of success.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere down the chain.
 * @property {*} [returnData] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */

class OperationSuccess extends CoreClass {
	/**
	 * Creates a new success response to an operation.
	 * @param {OperationSuccessData} data The operation result.
	 */
	constructor (data) {
		super();
		
		this.type = data.type || "";
		this.meta = data.meta;
		this.returnData = data.returnData;
	}
}

export default OperationSuccess;