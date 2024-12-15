import {CollectionDocument} from "./CollectionDocument";
import OperationFailure from "../operations/OperationFailure";
import {InsertOperation} from "./InsertOperation";

/**
 * @typedef {Object} InsertResult
 * @property {Object} operation Describes the operation being carried out.
 * @property {Boolean} operation.isArray If true, the insert data is an array of
 * documents.
 * @property {Boolean} operation.isAtomic True if the operation is atomic.
 * @property {Boolean} operation.isOrdered True if the operation is ordered.
 * @property {Object|Array} operation.data The data passed to the operation.
 * @property {Number} nInserted The number of documents inserted.
 * @property {Number} nFailed The number of documents that failed to insert.
 * @property {Array<Object>} inserted Array of documents inserted.
 * @property {Array<Object>} notInserted Array of documents that failed to insert.
 * @property {Array<OperationFailure>} failures Array of failed operation results.
 */
export interface InsertResult {
	operation?: InsertOperation;
	nInserted: number;
	nFailed: number;
	inserted: CollectionDocument[];
	notInserted: CollectionDocument[];
	failures: OperationFailure[];
}