import {CollectionDocument} from "./CollectionDocument";
import {FlightTestFunction} from "./FlightTestFunction";

/**
 * @typedef {Object} InsertOptions
 * @property {boolean} [$atomic=false] If true, any insert failure will roll back all
 * documents in the `data` argument.
 * @property {boolean} [$ordered=false] If true, inserts will stop at any failure but
 * previously inserted documents will still remain inserted.
 * @property {boolean} [$one=false] If true, inserts will stop after the first document.
 */
export interface InsertOptions {
	$one?: boolean;
	$atomic?: boolean;
	$ordered?: boolean;
	$assignment?: (args: CollectionDocument[]) => void;
	$skipAssignment?: boolean;
	$preFlight?: FlightTestFunction;
	$postFlight?: FlightTestFunction;
}