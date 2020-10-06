"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.remove = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _match = require("./match");

var _build = require("./build");

var _testFlight = require("./testFlight");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {Object} RemoveOptions
 * @property {Boolean} [$one=false] When true, will only update the first
 * document that matched the query. The return array will only contain
 * one element at most.
 * @property {Boolean} [$ordered=false] When true, will stop processing on
 * the first update failure but leave previous updates intact.
 * @property {Boolean} [$atomic=false] When true, will cancel all updates on
 * the first update failure, reverting any previous updates.
 * @property {Boolean} [$skipAssignment=false] When true, the passed `data`
 * will not be updated at all but the returned array will still contain the
 * updated documents.
 * @property {Function} [$preFlight] If passed, will be called with the document
 * to update and if the preFlight function returns true, we will continue but if
 * it returns false we will cancel the update.
 * @property {Function} [$postFlight] If passed, will be called with the document
 * being updated and the result of the update and if the $postFlight function
 * returns true, we will continue but if it returns false we will cancel the
 * update.
 */

/**
 * Remove does a search for matching records in an array of data based on
 * the passed query and then removes the matching records from the array.
 * @param {Array<Object>} dataArr The array of data to query.
 * @param {Object} query A query object.
 * @param {RemoveOptions} [options] An options object.
 * @returns {Promise<Array<Object>>} The new array of documents with the
 * matching documents removed.
 */
var remove = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(dataArr) {
    var query,
        options,
        pipeline,
        removed,
        removeMap,
        preFlightArr,
        postFlightArr,
        executeFlight,
        currentIndex,
        originalDoc,
        matchResult,
        removedDoc,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            // Break query into operations
            pipeline = (0, _build.queryToPipeline)(query);
            removed = [];
            removeMap = [];
            preFlightArr = [];
            postFlightArr = [];

            if (options.$preFlight) {
              preFlightArr.push(options.$preFlight);
            }

            if (options.$postFlight) {
              postFlightArr.push(options.$postFlight);
            }

            executeFlight = function executeFlight(originalDoc) {
              return _objectSpread({}, originalDoc);
            }; // Loop through each item of data and check if it matches the query


            currentIndex = 0;

          case 11:
            if (!(currentIndex < dataArr.length)) {
              _context.next = 32;
              break;
            }

            originalDoc = dataArr[currentIndex];
            matchResult = (0, _match.matchPipeline)(pipeline, originalDoc, {
              "originalQuery": query
            }); // If the document did not match our query, start on the next one

            if (matchResult) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("continue", 29);

          case 16:
            _context.next = 18;
            return (0, _testFlight.testFlight)([originalDoc], preFlightArr, executeFlight, postFlightArr, {
              "$atomic": options.$atomic,
              "$ordered": options.$ordered
            });

          case 18:
            removedDoc = _context.sent;

            if (!(removedDoc === _testFlight.EnumTestFlightResult.CANCEL)) {
              _context.next = 21;
              break;
            }

            return _context.abrupt("continue", 29);

          case 21:
            if (!(removedDoc === _testFlight.EnumTestFlightResult.CANCEL_ORDERED)) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("break", 32);

          case 23:
            if (!(removedDoc === _testFlight.EnumTestFlightResult.CANCEL_ATOMIC)) {
              _context.next = 25;
              break;
            }

            return _context.abrupt("return", []);

          case 25:
            removeMap.push(currentIndex);
            removed.push(removedDoc);

            if (!(options.$one === true)) {
              _context.next = 29;
              break;
            }

            return _context.abrupt("break", 32);

          case 29:
            currentIndex++;
            _context.next = 11;
            break;

          case 32:
            if (!options.$skipAssignment) {
              // Update the document array by removing the matching records
              removeMap.reverse().forEach(function (documentIndex) {
                dataArr.splice(documentIndex, 1);
              });
            } // TODO support $immutable and return a whole new dataArr


            return _context.abrupt("return", removed);

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function remove(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.remove = remove;
var _default = remove;
exports["default"] = _default;