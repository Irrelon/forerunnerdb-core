import {get as pathGet, setImmutable as pathSetImmutable} from "@irrelon/path";
import {CoreClass} from "./CoreClass";
import objectId from "../utils/objectId";
import {IndexHashMap} from "../indexes/IndexHashMap";
import OperationResults from "../operations/OperationResults";
import OperationFailure from "../operations/OperationFailure";
import OperationSuccess from "../operations/OperationSuccess";
import find from "./operation/find";
import update from "./operation/update";
import remove from "./operation/remove";
import {pull} from "../utils/pull";
import {IndexDefinition} from "../types/IndexDefinition";
import {OperationOptions} from "../types/OperationOptions";
import {CollectionDocument} from "../types/CollectionDocument";
import {OperationResult} from "../types/OperationResult";
import {InsertResult} from "../types/InsertResult";
import {InsertOptions} from "../types/InsertOptions";
import {ForerunnerQuery} from "../types/ForerunnerQuery";
import {ForerunnerQueryOptions} from "../types/ForerunnerQueryOptions";
import {ForerunnerUpdate} from "../types/ForerunnerUpdate";

class Collection extends CoreClass {
	_receivers: Collection[] = [];
	_name?: string;
	_cap: number;
	_primaryKey: string;
	_data: any[];
	_index: IndexDefinition[];

	constructor (name?: string) {
		super();

		this._name = name;
		this._cap = 0;
		this._primaryKey = "_id";
		this._data = [];
		this._index = [{
			"name": "primaryKey",
			"index": new IndexHashMap({[this._primaryKey]: 1}, {"unique": true})
		}];
	}

	/**
	 * Checks for a primary key on the document and assigns one if none
	 * currently exists.
	 * @param {Object} doc The document to check a primary key against.
	 * @returns {Object} The document passed in `obj`.
	 * @private
	 */
	ensurePrimaryKey = (doc: CollectionDocument): CollectionDocument => {
		if (pathGet(doc, this._primaryKey) === undefined) {
			// Assign a primary key automatically
			return pathSetImmutable(doc, this._primaryKey, objectId());
		}

		return doc;
	};

	/**
	 * Inserts a document into the indexes currently defined in the collection.
	 * @param {Object} doc The document to insert.
	 * @returns {boolean} True if successful, false if unsuccessful.
	 * @private
	 */
	_indexInsert = (doc: CollectionDocument): boolean => {
		// Return true if we DIDN'T find an error
		return !this._index.find((indexObj) => {
			// Return true (found an error) if the result was false
			return !indexObj.index.insert(doc);
		});
	};

	/**
	 * Scans the collection indexes and checks that the passed doc does
	 * not violate any index constraints.
	 * @param {CollectionDocument} doc The document to check.
	 * @param {Object} [options] An options object.
	 * @returns {OperationResult} An operation result.
	 */
	indexViolationCheck = (doc: CollectionDocument, options: OperationOptions = {}): OperationResult => {
		let indexArray = this._index;

		if (options.indexArray) {
			indexArray = options.indexArray;
		}

		// Loop each index and ask it to check if this
		// document violates any index constraints
		for (let indexNum = 0; indexNum < indexArray.length; indexNum++) {
			const indexObj = indexArray[indexNum];

			// Check if the index has a unique flag, if not it cannot violate
			// so early exit
			if (!indexObj.index.isUnique()) continue;

			const hash = indexObj.index.hash(doc);
			const wouldBeViolated = indexObj.index.willViolateByHash(hash);

			if (wouldBeViolated) {
				return new OperationFailure({
					"type": "INDEX_VIOLATION_CHECK_FAILURE",
					"meta": {
						"stage": "preFlight",
						"indexName": indexObj.name,
						hash
					},
					"data": doc
				});
			}
		}

		return new OperationSuccess({
			"type": "INDEX_VIOLATION_CHECK_SUCCESS",
			"data": doc
		});
	};

	/**
	 * Run a single operation on a single or multiple data items.
	 * @param {object|Array<object>} docOrArr An array of data items or
	 * a single data item object.
	 * @param {function} func The operation to run on each data item.
	 * @param {object} [options={}] Optional options object.
	 * @returns {OperationResults} The result of the operation(s).
	 */
	operation = (docOrArr: CollectionDocument | CollectionDocument[], func: (doc: CollectionDocument, options: OperationOptions) => OperationResult, options: OperationOptions = {}): OperationResults => {
		const opResult = new OperationResults();
		const isArray = Array.isArray(docOrArr);

		let data: CollectionDocument[];

		if (isArray) {
			data = docOrArr;
		} else {
			data = [docOrArr];
		}

		for (let currentIndex = 0; currentIndex < data.length; currentIndex++) {
			const doc = data[currentIndex];
			const result = func(doc, options);

			if (!result) {
				continue;
			}

			result.atIndex = currentIndex;
			opResult.addResult(result);

			if (options.breakOnFailure && result instanceof OperationFailure) {
				// The result was a failure, break now
				break;
			}
		}

		return opResult;
	};

	pushData = (doc: CollectionDocument) => {
		this._indexInsert(doc);
		this._data.push(doc);
	};

	_insertUnordered = async (data: CollectionDocument[]) => {
		const insertResult: InsertResult = {
			nInserted: 0,
			nFailed: 0,
			inserted: [],
			notInserted: [],
			failures: []
		};

		// Loop the array of data and fire off an insert operation for each
		// document, collating the result of each insert into an insert result
		const promiseArr: Promise<OperationResult>[] = [];
		data.forEach((doc) => promiseArr.push(this._insertDocument(doc)));

		const promiseResultArr = await Promise.all(promiseArr);

		promiseResultArr.forEach((result) => {
			if (result instanceof OperationFailure) {
				insertResult.failures.push(result);
				insertResult.notInserted.push(result.data);

				return;
			}

			insertResult.inserted.push(result.data);
		});

		insertResult.nInserted = insertResult.inserted.length;
		insertResult.nFailed = insertResult.failures.length;

		return insertResult;
	};

	_insertOrdered = async (data: CollectionDocument[]) => {
		const insertResult: InsertResult = {
			nInserted: 0,
			nFailed: 0,
			inserted: [],
			notInserted: [],
			failures: []
		};

		// Loop the array of data and fire off an insert operation for each
		// document, collating the result of each insert into an insert result
		for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
			const insertDocumentResult = await this._insertDocument(data[dataIndex]);

			if (insertDocumentResult instanceof OperationFailure) {
				// This doc failed to insert, return operation result now
				insertResult.notInserted.push(insertDocumentResult.data);
				insertResult.failures.push(insertDocumentResult);

				return insertResult;
			}

			insertResult.inserted.push(insertDocumentResult.data);
		}

		return insertResult;
	};

	_insertDocument = async (doc: CollectionDocument) => {
		// 1. Ensure primary key
		const newDoc = this.ensurePrimaryKey(doc);

		// 2. Check for index violation
		const indexViolationResult = this.indexViolationCheck(newDoc);
		if (indexViolationResult instanceof OperationFailure) return indexViolationResult;

		// 3. Insert into internal data array
		this._data.push(newDoc);

		// 4. Insert into indexes
		this._indexInsert(newDoc);

		// 5. Return a successful operation
		return new OperationSuccess({
			data: newDoc
		});
	};

	/**
	 * Insert a document or array of documents into the collection.
	 * @param  data The document or array of documents to insert.
	 * @param {InsertOptions} [options={$atomic: false, $ordered: false}] Options object.
	 * @returns {Promise<InsertResult>} The result of the insert operation.
	 */
	insert = async (data: CollectionDocument | CollectionDocument[], options: InsertOptions = {"$atomic": false, "$ordered": false}): Promise<InsertResult> => {
		const isArray = Array.isArray(data);
		const isAtomic = Boolean(options.$atomic);
		const isOrdered = Boolean(options.$ordered);

		// Make sure the data is an array
		let dataArr: CollectionDocument[];

		if (isArray) {
			dataArr = data;
		} else {
			dataArr = [data];
		}

		const insertResult: InsertResult = {
			"operation": {
				isArray,
				isAtomic,
				isOrdered,
				data: dataArr
			},
			"nInserted": 0,
			"nFailed": 0,
			"inserted": [],
			"notInserted": [],
			"failures": []
		};

		let insertOperationResult;

		if (isOrdered) {
			insertOperationResult = await this._insertOrdered(dataArr);
		} else if (isAtomic) {
			insertOperationResult = await this._insertUnordered(dataArr);
		} else {
			insertOperationResult = await this._insertUnordered(dataArr);
		}

		// Check capped collection status and remove first record
		// if we are over the threshold
		if (this._cap && this._data.length > this._cap) {
			// Remove the first item in the data array
			// TODO this assumes a single insert, modify to handle multiple docs inserted at once
			await this.removeById(pathGet(this._data[0], this._primaryKey));
		}

		this.emit("insert", {insertResult, insertOperationResult, data});

		// 5 Return result
		return {
			...insertResult,
			...insertOperationResult,
			nInserted: insertOperationResult.inserted.length,
			nFailed: insertOperationResult.notInserted.length
		};
	};

	insertOne = async (data: CollectionDocument, options = {"$atomic": false, "$ordered": false}) => {
		return this.insert(data, {...options, "$one": true});
	};

	insertMany = async (data: CollectionDocument[], options = {"$atomic": false, "$ordered": false}) => {
		return this.insert(data, options);
	};

	find = (queryObj: ForerunnerQuery = {}, options: ForerunnerQueryOptions = {}) => {
		return find(this._data, queryObj);
	};

	findOne = (queryObj: ForerunnerQuery = {}, options: ForerunnerQueryOptions = {}) => {
		return this.find(queryObj, options)[0];
	};

	findMany = (queryObj: ForerunnerQuery = {}, options: ForerunnerQueryOptions = {}) => {
		return this.find(queryObj, options);
	};

	update = (queryObj: ForerunnerQuery, updateObj: ForerunnerUpdate, options = {}) => {
		// TODO: Add option to run a sanity check on each match before and update
		//  is performed so we can check if an index violation would occur
		const resultArr = update(this._data, queryObj, updateObj, options);

		this.emit("update", {resultArr, queryObj, updateObj, options});

		// TODO: Now loop the result array and check if any fields that are in the
		//  update object match fields that are in the index. If they are, remove each
		//  document from the index and re-index them
		return resultArr;
	};

	updateOne = (queryObj: ForerunnerQuery, updateObj: ForerunnerUpdate, options = {}) => {
		return this.update(queryObj, updateObj, {...options, "$one": true});
	};

	updateMany = (queryObj: ForerunnerQuery, updateObj: ForerunnerUpdate, options = {}) => {
		return this.update(queryObj, updateObj, options);
	};

	remove = (queryObj = {}, options = {}) => {
		const resultArr = remove(this._data, queryObj, options);

		this.emit("remove", {resultArr, queryObj, options});

		// TODO: Now loop the result array and check if any fields that are in the
		//  remove array match objects that are in the index. If they are, remove each
		//  document from the index
		return resultArr;
	};

	removeOne = (queryObj: ForerunnerQuery, options = {}) => {
		return this.remove(queryObj, {...options, "$one": true});
	};

	removeMany = (queryObj: ForerunnerQuery, options = {}) => {
		return this.remove(queryObj, options);
	};

	removeById = (id: string) => {
		return this.removeOne({
			[this._primaryKey]: id
		});
	};

	pipe = (receiver: Collection) => {
		this._receivers.push(receiver);

		this.on("insert", (args) => {

		});
	};

	unPipe = (receiver: Collection) => {
		pull(this._receivers, receiver);
	};

	/**
	 *
	 * @param query
	 * @returns {Promise<Collection>}
	 */
	virtual = async (query: any | ForerunnerQuery): Promise<Collection> => {
		const newCollection = new Collection();

		// Set initial data
		// TODO: Make path selection with .$. work
		const initialData = await this.find(query);
		await newCollection.insert(initialData);

		this.pipe(newCollection);

		return newCollection;
	};
}

export default Collection;