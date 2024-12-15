/**
 * @typedef {Object} PipelineStepExecutionOptions
 * @property {Boolean} [$atomic] If true, any failure at any point in the
 * pipeline will result in the complete failure of the whole pipeline.
 * @property {Boolean} [$ordered] If true, any failure at any point in the
 * pipeline will result in the pipeline cancelling at that point but all
 * previous work will remain in place.
 */
export interface PipelineStepExecutionOptions {
	$atomic?: boolean;
	$ordered?: boolean;
}