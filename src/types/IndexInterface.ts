import {CollectionDocument} from "./CollectionDocument";
import {IndexKeys} from "./IndexKeys";

export interface IndexInterface {
	isUnique: () => boolean;
	willViolate: (doc: CollectionDocument) => boolean;
	willViolateByHash: (hash: string) => boolean;
	exists: (hash: string) => boolean;
	insert: (doc: CollectionDocument) => boolean;
	remove: (doc: CollectionDocument) => boolean;
	hash: (doc: CollectionDocument) => string;
	keys: (keys: IndexKeys) => void;
}