import {FlightTestFunction} from "../../types/FlightTestFunction";
import {FlightExecuteFunction} from "../../types/FlightExecuteFunction";
import {OperationOptions} from "../../types/OperationOptions";
import {InsertOptions} from "../../types/InsertOptions";

export const EnumTestFlightResult = {
	"SUCCESS": "SUCCESS", // Allow individual flight to continue
	"CANCEL": "CANCEL", // Cancel an individual flight
	"CANCEL_ORDERED": "CANCEL_ORDERED", // Cancel this and all further flights
	"CANCEL_ATOMIC": "CANCEL_ATOMIC" // Cancel this and all related flights before and after
};

/**
 * Runs pre and post-flight checks on transformed data. If failures occur
 * it will return an error code based on the options flags present. This
 * function is primarily used to handle consistent behaviour for atomic
 * and ordered CRUD operations, as well as pre and post-operation triggers.
 * @param {Array} args An array of arguments to apply to the pre, execute
 * and post stage functions. Usually a document is passed as the first item
 * in the array of arguments so that functions can act on its data.
 * @param {Array<Function>} preFlightArr An array of functions to call with
 * the passed `args` as the function arguments. If any of these functions
 * returns false, it signals a cancellation of the operation.
 * @param {Function} execute The function to execute after pre-flight calls
 * have been successfully made. The result of this function call is passed
 * as the last argument to all postFlight function calls.
 * @param {Array<Function>} postFlightArr An array of functions to call with
 * the passed `args` as the function arguments however the final argument
 * passed to postFlight function calls will be the result of calling the
 * `execute` function. This way you can act on both the original arguments
 * and the result of `execute` should you need to.
 * @param {Object} options An options object.
 * @returns {Promise<any>} Either a cancellation constant value or the result
 * of calling `execute`. If either a preFlight or postFlight function returned
 * false, the return value from `testFlight()` will be one of the
 * ENUM_TEST_FLIGHT_RESULT values depending on the `options.$atomic` and
 * `options.$ordered` flags. If no functions returned false, the return value
 * will be the result of calling `execute`.
 */
export const testFlight = async (args: any[], preFlightArr: FlightTestFunction[], execute: FlightExecuteFunction, postFlightArr: FlightTestFunction[], options: InsertOptions = {"$atomic": false, "$ordered": false}): Promise<ReturnType<FlightExecuteFunction>> => {
	let cancellationConstant = EnumTestFlightResult.CANCEL;

	if (options.$atomic === true) { cancellationConstant = EnumTestFlightResult.CANCEL_ATOMIC; }
	if (options.$ordered === true) { cancellationConstant = EnumTestFlightResult.CANCEL_ORDERED; }

	// Check if we have a preflight function
	if (preFlightArr.length) {
		for (let index = 0; index < preFlightArr.length; index++) {
			const preFlight = preFlightArr[index];

			// We have a preflight function, pass the document we want to update
			// to the preflight function and see if it tells us to continue or not
			const result = await preFlight(...args);

			// If the preflight function returned false, skip updating this document
			if (result === false) return cancellationConstant;
		}
	}

	const executionResult = execute(...args);

	// Check if we have a postFlight function
	if (postFlightArr.length) {
		for (let index = 0; index < postFlightArr.length; index++) {
			const postFlight = postFlightArr[index];

			// We have a postFlight function, pass the document we want to update
			// to the postFlight function and see if it tells us to continue or not
			const result = await postFlight(...args, executionResult);

			// If the preflight function returned false, skip updating this document
			if (result === false) return cancellationConstant;
		}
	}

	return executionResult;
};