import {OperationFunctionExtraInfo} from "./OperationFunctionExtraInfo";

export type OperationFunction = (a: any, b: any, extraInfo?: OperationFunctionExtraInfo) => boolean;