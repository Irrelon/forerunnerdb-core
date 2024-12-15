"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _path = require("@irrelon/path");
var _match = require("./match");
var _build = require("./build");
var _testFlight = require("./testFlight");
var _operate = require("./operate");
/**
 * @typedef {Object} UpdateOptions
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
 * Update does a search for matching records in an array of data based on
 * the passed query and then modifies the data based on the passed update
 * object.
 * @param {Array<Object>} dataArr The array of data to query.
 * @param {Object} query A query object.
 * @param {Object} update The update object.
 * @param {UpdateOptions} [options] An options object.
 * @returns {Promise<Array<Object>>} The array of data that matched the passed query
 * and received an update.
 */
var update = exports.update = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(dataArr, query) {
    var update,
      options,
      pipeline,
      updated,
      updateMap,
      preFlightArr,
      postFlightArr,
      executeFlight,
      currentIndex,
      originalDoc,
      matchResult,
      updatedDoc,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            update = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
            // Break query into operations
            pipeline = (0, _build.queryToPipeline)(query);
            updated = [];
            updateMap = {};
            preFlightArr = [];
            postFlightArr = [];
            if (options.$preFlight) {
              preFlightArr.push(options.$preFlight);
            }
            if (options.$postFlight) {
              postFlightArr.push(options.$postFlight);
            }
            executeFlight = function executeFlight(originalDoc) {
              // Build an update object for this document
              var updatePipeline = (0, _build.updateToPipeline)(update);
              var updatedDoc = (0, _operate.operatePipeline)(updatePipeline, originalDoc, {
                "originalUpdate": update
              });
              return (0, _path.update)(originalDoc, "", updatedDoc, {
                "immutable": true
              });
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
            updatedDoc = _context.sent;
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL)) {
              _context.next = 21;
              break;
            }
            return _context.abrupt("continue", 29);
          case 21:
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL_ORDERED)) {
              _context.next = 23;
              break;
            }
            return _context.abrupt("break", 32);
          case 23:
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL_ATOMIC)) {
              _context.next = 25;
              break;
            }
            return _context.abrupt("return", []);
          case 25:
            updateMap[currentIndex] = updatedDoc;
            updated.push(updatedDoc);
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
              // Update the document array
              Object.entries(updateMap).forEach(function (_ref2) {
                var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
                  documentIndex = _ref3[0],
                  updatedDoc = _ref3[1];
                dataArr[documentIndex] = updatedDoc;
              });
            }

            // TODO support $immutable and return a whole new dataArr
            return _context.abrupt("return", updated);
          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function update(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports["default"] = update;