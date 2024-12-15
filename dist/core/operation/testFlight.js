"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testFlight = exports.EnumTestFlightResult = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var EnumTestFlightResult = exports.EnumTestFlightResult = {
  "SUCCESS": "SUCCESS",
  // Allow individual flight to continue
  "CANCEL": "CANCEL",
  // Cancel an individual flight
  "CANCEL_ORDERED": "CANCEL_ORDERED",
  // Cancel this and all further flights
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
 * @returns {Promise<*>} Either a cancellation constant value or the result
 * of calling `execute`. If either a preFlight or postFlight function returned
 * false, the return value from `testFlight()` will be one of the
 * ENUM_TEST_FLIGHT_RESULT values depending on the `options.$atomic` and
 * `options.$ordered` flags. If no functions returned false, the return value
 * will be the result of calling `execute`.
 */
var testFlight = exports.testFlight = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(args, preFlightArr, execute, postFlightArr) {
    var options,
      cancellationConstant,
      index,
      preFlight,
      result,
      executionResult,
      _index,
      postFlight,
      _result,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 4 && _args[4] !== undefined ? _args[4] : {
              "$atomic": false,
              "$ordered": false
            };
            cancellationConstant = EnumTestFlightResult.CANCEL;
            if (options.$atomic === true) {
              cancellationConstant = EnumTestFlightResult.CANCEL_ATOMIC;
            }
            if (options.$ordered === true) {
              cancellationConstant = EnumTestFlightResult.CANCEL_ORDERED;
            }

            // Check if we have a preflight function
            if (!preFlightArr.length) {
              _context.next = 16;
              break;
            }
            index = 0;
          case 6:
            if (!(index < preFlightArr.length)) {
              _context.next = 16;
              break;
            }
            preFlight = preFlightArr[index]; // We have a preflight function, pass the document we want to update
            // to the preflight function and see if it tells us to continue or not
            _context.next = 10;
            return preFlight.apply(void 0, (0, _toConsumableArray2["default"])(args));
          case 10:
            result = _context.sent;
            if (!(result === false)) {
              _context.next = 13;
              break;
            }
            return _context.abrupt("return", cancellationConstant);
          case 13:
            index++;
            _context.next = 6;
            break;
          case 16:
            executionResult = execute.apply(void 0, (0, _toConsumableArray2["default"])(args)); // Check if we have a postFlight function
            if (!postFlightArr.length) {
              _context.next = 29;
              break;
            }
            _index = 0;
          case 19:
            if (!(_index < postFlightArr.length)) {
              _context.next = 29;
              break;
            }
            postFlight = postFlightArr[_index]; // We have a postFlight function, pass the document we want to update
            // to the postFlight function and see if it tells us to continue or not
            _context.next = 23;
            return postFlight.apply(void 0, (0, _toConsumableArray2["default"])(args).concat([executionResult]));
          case 23:
            _result = _context.sent;
            if (!(_result === false)) {
              _context.next = 26;
              break;
            }
            return _context.abrupt("return", cancellationConstant);
          case 26:
            _index++;
            _context.next = 19;
            break;
          case 29:
            return _context.abrupt("return", executionResult);
          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function testFlight(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();