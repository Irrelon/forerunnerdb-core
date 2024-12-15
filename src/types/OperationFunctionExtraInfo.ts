import {ForerunnerQuery} from "./ForerunnerQuery";
import {GenericOperation} from "./GenericOperation";

export interface OperationFunctionExtraInfo {
	originalQuery?: ForerunnerQuery;
	operation?: GenericOperation;
}