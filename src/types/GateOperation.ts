import {GenericOperation} from "./GenericOperation";

export type GateOperation = (path: string, value: any[]) => GenericOperation;