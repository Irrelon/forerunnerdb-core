import {CollectionDocument} from "./CollectionDocument";

export interface InsertOperation {
	isArray: boolean;
	isAtomic: boolean;
	isOrdered: boolean;
	data: CollectionDocument[];
}