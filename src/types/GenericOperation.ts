import {ExtendedType} from "./ExtendedType";

/**
 * Describes an operation that will be handled during the execution of a pipeline.
 * The op is a dollar operation string like "$eeq" or "$and".
 */
export interface GenericOperation {
	op: string;
	path: string;
	value?: any;
	typeData?: ExtendedType;
	type?: string;
	instance?: string;
}