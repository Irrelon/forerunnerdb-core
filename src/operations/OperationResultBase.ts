import {CoreClass} from "../core/CoreClass";
import {OperationData} from "../types/OperationData";

export class OperationResultBase extends CoreClass {
	type: string;
	meta: any;
	data: any;
	atIndex?: number;

	/**
	 * Creates a new failure response to an operation.
	 * @param {OperationData} info The operation result.
	 */
	constructor (info: OperationData) {
		super();

		this.type = info.type || "";
		this.meta = info.meta;
		this.data = info.data;
	}
}