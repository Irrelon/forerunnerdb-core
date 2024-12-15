import {CoreClass} from "../core/CoreClass";
import {get as pathGet} from "@irrelon/path";
import {IndexInterface} from "../types/IndexInterface";
import {CollectionDocument} from "../types/CollectionDocument";
import {IndexKeys} from "../types/IndexKeys";
import {IndexOptions} from "../types/IndexOptions";
import {ForerunnerQuery} from "../types/ForerunnerQuery";

export class IndexHashMap extends CoreClass implements IndexInterface {
	_keyArr: string[] = [];
	_keys: IndexKeys = {};
	_data: Record<string, any> = {};
	_name = "";
	_options: IndexOptions = {};

	constructor (keys: IndexKeys = {}, options: IndexOptions = {}) {
		super();

		this._options = options;
		this._name = this._options.name || Object.entries(keys).reduce((name, [key, val]) => {
			name += "_" + key + ":" + val;
			return name;
		}, "");
		this._data = {};
		this.keys(keys);
	}

	keys (keys: IndexKeys) {
		this._keys = keys;
		this._keyArr = Object.keys(keys);
	}

	hash (doc: CollectionDocument): string {
		let hash = "";

		for (let i = 0; i < this._keyArr.length; i++) {
			if (hash) { hash += "_"; }
			hash += pathGet(doc, this._keyArr[i]);
		}

		return hash;
	}

	exists (hash: string) {
		return this._data[hash] && this._data[hash].length > 0;
	}

	isUnique () {
		return this._options.unique === true;
	}

	willViolate (doc: CollectionDocument): boolean {
		const hash = this.hash(doc);
		return this.willViolateByHash(hash);
	}

	willViolateByHash (hash: string) {
		return this.isUnique() && this.exists(hash);
	}

	insert (doc: CollectionDocument) {
		const hash = this.hash(doc);
		const violationCheckResult = this.willViolateByHash(hash);

		if (violationCheckResult) {
			// This is a violation / collision
			return false;
		}

		this._data[hash] = this._data[hash] || [];
		this._data[hash].push(doc);

		return true;
	}

	find (query: ForerunnerQuery) {

	}

	remove (doc: CollectionDocument) {
		const hash = this.hash(doc);
		if (!this._data[hash]) return false;

		const index = this._data[hash].indexOf(doc);

		if (index === -1) return false;

		this._data[hash].splice(index, 1);
		return true;
	}

	/**
	 * Creates a new index of the same type with the same setup
	 * as this index, but with no data.
	 * @returns {IndexHashMap} A new replicated index.
	 */
	replicate () {
		return new IndexHashMap(this._keys, this._options);
	}
}