import {ForerunnerQuery} from "./ForerunnerQuery";
import {GenericOperation} from "./GenericOperation";

export type PipelineGeneratorFunction = (query: ForerunnerQuery, currentGate: string, parentPath: string) => GenericOperation[];