import {PipelineStepFunction} from "./PipelineStepFunction";
import {PipelineStepExecutionOptions} from "./PipelineStepExecutionOptions";

export interface PipelineStep {
	name: string;
	func: PipelineStepFunction;
	options: PipelineStepExecutionOptions;
}