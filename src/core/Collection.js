import {setImmutable as pathSetImmutable, get as pathGet} from "@irrelon/path";
import CoreClass from "./CoreClass";
import objectId from "../utils/objectId";
import IndexHashMap from "../indexes/IndexHashMap";
import OperationResult from "../operations/OperationResult";
import OperationFailure from "../operations/OperationFailure";
import OperationSuccess from "../operations/OperationSuccess";
import find from "./operation/find";
import update from "./operation/update";

/**
 * @typedef {Object} InsertOptions
 * @property {Boolean} [$atomic=false] If true, any insert failure will roll back all
 * documents in the `data` argument.
 * @property {Boolean} [$ordered=false] If true, inserts will stop at any failure but
 * previously inserted documents will still remain inserted.
 */

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

class Collection extends CoreClass {
	constructor (name) {
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
	ensurePrimaryKey = function (doc) {
		if (pathGet(doc, this._primaryKey) === undefined) {
			// Assign a primary key automatically
			return pathSetImmutable(doc, this._primaryKey, objectId());
		}
		
		return doc;
	};
	
	_indexInsert (doc) {
		// Return true if we DIDN'T find an error
		return !this._index.find((indexObj) => {
			// Return true (found an error) if the result was false
			return indexObj.index.insert(doc) === false;
		});
	}
	
	/**
	 * Scans the collection indexes and checks that the passed doc does
	 * not violate any index constraints.
	 * @param {Object} doc The document to check.
	 * @param {Object} [options] An options object.
	 * @returns {OperationSuccess|OperationFailure} An operation result.
	 */
	indexViolationCheck = (doc, options = {}) => {
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
	 * @returns {OperationResult} The result of the operation(s).
	 */
	operation (docOrArr, func, options = {}) {
		const opResult = new OperationResult();
		const isArray = Array.isArray(docOrArr);
		
		let data = docOrArr;
		
		if (!isArray) {
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
	}
	
	/**
	 * Run a single operation on a single or multiple data items.
	 * @param {object|Array<object>} docOrArr An array of data items or
	 * a single data item object.
	 * @param {function} func The operation to run on each data item.
	 * @param {object} [options={}] Optional options object.
	 */
	silentOperation (docOrArr, func, options = {}) {
		const isArray = Array.isArray(docOrArr);
		
		let data = docOrArr;
		
		if (!isArray) {
			data = [docOrArr];
		}
		
		for (let currentIndex = 0; currentIndex < data.length; currentIndex++) {
			const doc = data[currentIndex];
			func(doc, options);
		}
	}
	
	pushData = (doc) => {
		this._indexInsert(doc);
		this._data.push(doc);
	};

	_insertUnordered = async (data) => {
		const insertResult = {
			"inserted": [],
			"notInserted": [],
			"failures": []
		};

		// Loop the array of data and fire off an insert operation for each
		// document, collating the result of each insert into an insert result
		const promiseArr = [];
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

		return insertResult;
	}

	_insertOrdered = async (data) => {
		const insertResult = {
			"inserted": [],
			"notInserted": [],
			"failures": []
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
	}

	_insertDocument = async (doc) => {
		// 1. Ensure primary key
		const newDoc = this.ensurePrimaryKey(doc);

		// 2. Check for index violation
		const indexViolationResult = this.indexViolationCheck(newDoc);
		if (indexViolationResult instanceof OperationFailure) return indexViolationResult;

		// 3. Insert into internal data array
		this._data.push(newDoc);

		// 4. Insert into indexes
		this._indexInsert(newDoc);

		return new OperationSuccess({
			data: newDoc
		});
	}

	/**
	 * Insert a document or array of documents into the collection.
	 * @param {Object|Array} data The document or array of documents to insert.
	 * @param {InsertOptions} [options={$atomic: false, $ordered: false}] Options object.
	 * @returns {Promise<InsertResult>} The result of the insert operation.
	 */
	insert = async (data, options = {"$atomic": false, "$ordered": false}) => {
		const isArray = Array.isArray(data);
		const isAtomic = options.$atomic === true;
		const isOrdered = options.$ordered === true;

		// Make sure the data is an array
		if (!isArray) {
			data = [data];
		}
		
		const insertResult = {
			"operation": {
				isArray,
				isAtomic,
				isOrdered,
				data
			},
			"nInserted": 0,
			"nFailed": 0,
			"inserted": [],
			"notInserted": [],
			"failures": []
		};

		let insertOperationResult;

		if (isOrdered) {
			insertOperationResult = await this._insertOrdered(data);
		} else if (isAtomic) {
			insertOperationResult = await this._insertUnordered(data);
		} else {
			insertOperationResult = await this._insertUnordered(data);
		}
		
		// Check capped collection status and remove first record
		// if we are over the threshold
		if (this._cap && this._data.length > this._cap) {
			// Remove the first item in the data array
			// TODO this assumes a single insert, modify to handle multiple docs inserted at once
			this.removeById(pathGet(this._data[0], this._primaryKey));
		}
		
		// 5 Return result
		return {
			...insertResult,
			...insertOperationResult,
			nInserted: insertOperationResult.inserted.length,
			nFailed: insertOperationResult.notInserted.length,
		};
	}
	
	find (queryObj = {}, options = {}) {
		return find(this._data, queryObj);
	}
	
	findOne (queryObj, options) {
		return this.find(queryObj, options)[0];
	}
	
	findMany (queryObj, options) {
		return this.find(queryObj, options);
	}
	
	update (queryObj, updateObj, options) {
		// TODO: Add option to run a sanity check on each match before and update
		//  is performed so we can check if an index violation would occur
		const resultArr = update(this._data, queryObj, updateObj, options);
		
		// TODO: Now loop the result array and check if any fields that are in the
		//  update object match fields that are in the index. If they are, remove each
		//  document from the index and re-index them
		return resultArr;
	}
	
	updateOne (queryObj, update, options) {
		return this.update(queryObj, update, {...options, "$one": true});
	}
	
	updateMany (queryObj, update, options) {
		return this.update(queryObj, update, options);
	}
	
	remove (queryObj = {}, options = {}) {
	
	}
	
	removeOne (queryObj, options) {
		return this.remove(queryObj, {...options, "$one": true});
	}
	
	removeMany (queryObj, options) {
		return this.remove(queryObj, options);
	}
	
	removeById (id) {
		return this.removeOne({
			[this._primaryKey]: id
		});
	}
}

export default Collection;