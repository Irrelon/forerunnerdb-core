import {OperationResult} from "./OperationResult";

/**
 * @callback PipelineStepFunction
 * @param {any} data The data the function is given by the pipeline.
 * @param {any} originalData The value of the data before any pipeline steps
 * changed it. This will always be the value that `data` was before it got
 * changed.
 */
export type PipelineStepFunction = (data: any, originalData: any) => Promise<OperationResult>;