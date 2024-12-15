"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _testFlight = require("./testFlight");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * @typedef {Object} InsertOptions
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
 * @property {Function} [$assignment] If passed, overrides the function that
 * would normally push the final data to the `dataArr` argument.
 */

/**
 * @typedef {Object} InsertResult
 * @property {Array<Object>} inserted The array of documents that got inserted.
 * @property {Array<Object>} notInserted The array of documents that did not get
 * inserted.
 */

/**
 * Inserts a document or array of documents into the passed `dataArr`.
 * @param {Array<Object>} dataArr The array of data to query.
 * @param {Object|Array<Object>} insertArr A document or array of documents to insert.
 * @param {InsertOptions} [options] An options object.
 * @returns {Promise<InsertResult>} The result of the insert operation.
 */
var insert = exports.insert = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(dataArr, insertArr) {
    var options,
      inserted,
      notInserted,
      preFlightArr,
      postFlightArr,
      assignmentFunc,
      executeFlight,
      currentIndex,
      originalDoc,
      updatedDoc,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            if (!Array.isArray(insertArr)) {
              insertArr = [insertArr];
            }
            inserted = [];
            notInserted = [];
            preFlightArr = [];
            postFlightArr = [];
            assignmentFunc = options.$assignment || function (args) {
              dataArr.push.apply(dataArr, (0, _toConsumableArray2["default"])(args));
            };
            if (options.$preFlight) {
              preFlightArr.push(options.$preFlight);
            }
            if (options.$postFlight) {
              postFlightArr.push(options.$postFlight);
            }
            executeFlight = function executeFlight(doc) {
              // Decouple outer object
              return _objectSpread({}, doc);
            }; // Loop through each item of data and insert it
            currentIndex = 0;
          case 11:
            if (!(currentIndex < insertArr.length)) {
              _context.next = 28;
              break;
            }
            originalDoc = insertArr[currentIndex];
            _context.next = 15;
            return (0, _testFlight.testFlight)([originalDoc], preFlightArr, executeFlight, postFlightArr, {
              "$atomic": options.$atomic,
              "$ordered": options.$ordered
            });
          case 15:
            updatedDoc = _context.sent;
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL)) {
              _context.next = 19;
              break;
            }
            notInserted.push(originalDoc);
            return _context.abrupt("continue", 25);
          case 19:
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL_ORDERED)) {
              _context.next = 22;
              break;
            }
            notInserted.push(originalDoc);
            return _context.abrupt("break", 28);
          case 22:
            if (!(updatedDoc === _testFlight.EnumTestFlightResult.CANCEL_ATOMIC)) {
              _context.next = 24;
              break;
            }
            return _context.abrupt("return", {
              "inserted": [],
              "notInserted": insertArr
            });
          case 24:
            inserted.push(updatedDoc);
          case 25:
            currentIndex++;
            _context.next = 11;
            break;
          case 28:
            if (!options.$skipAssignment && inserted.length) {
              assignmentFunc(inserted);
            }
            return _context.abrupt("return", {
              inserted: inserted,
              notInserted: notInserted
            });
          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function insert(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports["default"] = insert;