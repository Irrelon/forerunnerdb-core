import {setImmutable as pathSetImmutable, get as pathGet} from "@irrelon/path";
import CoreClass from "./CoreClass";
import objectId from "../utils/objectId";
import IndexHashMap from "../indexes/IndexHashMap";
import OperationResult from "../operations/OperationResult";
import OperationFailure from "../operations/OperationFailure";
import OperationSuccess from "../operations/OperationSuccess";
import find from "./operation/find";
import update from "./operation/update";

class Collection extends CoreClass {
	constructor (name) {
		super();
		
		this._name = name;
		this._cap = 0;
		this._primaryKey = "_id";
		this._data = [];
		this._index = [{
			"name": "primaryKey",
			"index": new IndexHashMap({[this._primaryKey]: 1}, {unique: true})
		}];
	}
	
	/**
	 * Checks for a primary key on the document and assigns one if none
	 * currently exists.
	 * @param {Object} obj The object to check a primary key against.
	 * @private
	 */
	ensurePrimaryKey = function (obj) {
		if (pathGet(obj, this._primaryKey) === undefined) {
			// Assign a primary key automatically
			return pathSetImmutable(obj, this._primaryKey, objectId());
		}
		
		return obj;
	};
	
	_indexInsert (data) {
		// Return true if we DIDN'T find an error
		return !this._index.find((indexObj) => {
			// Return true (found an error) if the result was false
			return indexObj.index.insert(data) === false;
		});
	}
	
	/**
	 * Scans the collection indexes and checks that the passed doc does
	 * not violate any index constraints.
	 * @param doc
	 * @param options
	 * @returns {Array<OperationSuccess|OperationFailure>} An array of
	 * operation results.
	 */
	indexViolationCheck = (doc, options = {}) => {
		let indexArray = this._index;
		
		if (options.indexArray) {
			indexArray = options.indexArray;
		}
		
		// Loop each index and ask it to check if this
		// document violates any index constraints
		return indexArray.map((indexObj) => {
			// Check if the index has a unique flag, if not it cannot violate
			// so early exit
			if (!indexObj.index.isUnique()) return new OperationSuccess({
				type: OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS,
				meta: {
					indexName: indexObj.name,
					doc
				}
			});
			
			const hash = indexObj.index.hash(doc);
			const wouldBeViolated = indexObj.index.willViolateByHash(hash);
			
			if (wouldBeViolated) {
				return new OperationFailure({
					type: OperationFailure.constants.INDEX_VIOLATION,
					meta: {
						indexName: indexObj.name,
						hash,
						doc
					}
				});
			} else {
				if (options.insert === true) {
					indexObj.index.insert(doc);
				}
				
				return new OperationSuccess({
					type: OperationSuccess.constants.INDEX_PREFLIGHT_SUCCESS,
					meta: {
						indexName: indexObj.name,
						hash,
						doc
					}
				});
			}
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
	
	pushData = (data) => {
		const finalData = this.ensurePrimaryKey(data);
		
		if (this._indexInsert(finalData)) {
			this._data.push(finalData);
			return new OperationSuccess({type: OperationSuccess.constants.INSERT_SUCCESS, meta: {
				doc: finalData
			}});
		} else {
			return new OperationFailure({type: OperationFailure.constants.INSERT_FAILURE, meta: {
				doc: finalData
			}});
		}
	};
	
	insert (data, options = {atomic: false, ordered: false}) {
		const isArray = Array.isArray(data);
		const isAtomic = options.atomic === true;
		const isOrdered = options.ordered === true;
		
		const insertResult = {
			"operation": {
				isArray,
				isAtomic,
				isOrdered,
				data
			},
			"stage": {
				"preflight": {},
				"postflight": {},
				"execute": {}
			},
			"nInserted": 0,
			"nFailed": 0
		};
		
		// 1 Check index violations against existing data
		insertResult.stage.preflight = this.operation(data, this.indexViolationCheck);
		
		// 2 Check for index violations against itself when inserted
		insertResult.stage.postflight = this.operation(data, this.indexViolationCheck, {
			insert: true,
			breakOnFailure: isOrdered,
			indexArray: this._index.map((indexObj) => {
				return {
					...indexObj,
					index: indexObj.index.replicate()
				}
			})
		});
		
		insertResult.nFailed = insertResult.stage.preflight.failure.length + insertResult.stage.postflight.failure.length;
		
		// 3 If anything will fail, check if we are running atomic and if so, exit with error
		if (isAtomic && insertResult.nFailed) {
			// Atomic operation and we failed at least one op, fail the whole op
			return insertResult;
		}
		
		// 4 If not atomic, run through only allowed operations and complete them
		if (isOrdered) {
			const result = this.operation(data, this.pushData, {breakOnFailure: true});
			insertResult.nInserted = result.success.length;
		} else {
			const result = this.operation(data, this.pushData, {breakOnFailure: false});
			insertResult.nInserted = result.success.length;
		}
		
		// Check capped collection status and remove first record
		// if we are over the threshold
		if (this._cap && this._data.length > this._cap) {
			// Remove the first item in the data array
			this.removeById(pathGet(this._data[0], this._primaryKey));
		}
		
		// 5 Return result
		return insertResult;
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
		return this.remove(queryObj, {...options, "$one": true})
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