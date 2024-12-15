"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = require("@irrelon/path");
var _CoreClass2 = _interopRequireDefault(require("./CoreClass"));
var _objectId = _interopRequireDefault(require("../utils/objectId"));
var _IndexHashMap2 = _interopRequireDefault(require("../indexes/IndexHashMap"));
var _OperationResult = _interopRequireDefault(require("../operations/OperationResult"));
var _OperationFailure = _interopRequireDefault(require("../operations/OperationFailure"));
var _OperationSuccess = _interopRequireDefault(require("../operations/OperationSuccess"));
var _find = _interopRequireDefault(require("./operation/find"));
var _update = _interopRequireDefault(require("./operation/update"));
var _remove = _interopRequireDefault(require("./operation/remove"));
var _pull = require("../utils/pull");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * @typedef {Object} InsertOptions
 * @property {Boolean} [$atomic=false] If true, any insert failure will roll back all
 * documents in the `data` argument.
 * @property {Boolean} [$ordered=false] If true, inserts will stop at any failure but
 * previously inserted documents will still remain inserted.
 * @property {Boolean} [$one=false] If true, inserts will stop after the first document.
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
var Collection = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(Collection, _CoreClass);
  var _super = _createSuper(Collection);
  function Collection(name) {
    var _this;
    (0, _classCallCheck2["default"])(this, Collection);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_receivers", []);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ensurePrimaryKey", function (doc) {
      if ((0, _path.get)(doc, this._primaryKey) === undefined) {
        // Assign a primary key automatically
        return (0, _path.setImmutable)(doc, this._primaryKey, (0, _objectId["default"])());
      }
      return doc;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_indexInsert", function (doc) {
      // Return true if we DIDN'T find an error
      return !_this._index.find(function (indexObj) {
        // Return true (found an error) if the result was false
        return indexObj.index.insert(doc) === false;
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "indexViolationCheck", function (doc) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var indexArray = _this._index;
      if (options.indexArray) {
        indexArray = options.indexArray;
      }

      // Loop each index and ask it to check if this
      // document violates any index constraints
      for (var indexNum = 0; indexNum < indexArray.length; indexNum++) {
        var indexObj = indexArray[indexNum];

        // Check if the index has a unique flag, if not it cannot violate
        // so early exit
        if (!indexObj.index.isUnique()) continue;
        var hash = indexObj.index.hash(doc);
        var wouldBeViolated = indexObj.index.willViolateByHash(hash);
        if (wouldBeViolated) {
          return new _OperationFailure["default"]({
            "type": "INDEX_VIOLATION_CHECK_FAILURE",
            "meta": {
              "stage": "preFlight",
              "indexName": indexObj.name,
              hash: hash
            },
            "data": doc
          });
        }
      }
      return new _OperationSuccess["default"]({
        "type": "INDEX_VIOLATION_CHECK_SUCCESS",
        "data": doc
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "operation", function (docOrArr, func) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var opResult = new _OperationResult["default"]();
      var isArray = Array.isArray(docOrArr);
      var data = docOrArr;
      if (!isArray) {
        data = [docOrArr];
      }
      for (var currentIndex = 0; currentIndex < data.length; currentIndex++) {
        var doc = data[currentIndex];
        var result = func(doc, options);
        if (!result) {
          continue;
        }
        result.atIndex = currentIndex;
        opResult.addResult(result);
        if (options.breakOnFailure && result instanceof _OperationFailure["default"]) {
          // The result was a failure, break now
          break;
        }
      }
      return opResult;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pushData", function (doc) {
      _this._indexInsert(doc);
      _this._data.push(doc);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_insertUnordered", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
        var insertResult, promiseArr, promiseResultArr;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                insertResult = {
                  "inserted": [],
                  "notInserted": [],
                  "failures": []
                }; // Loop the array of data and fire off an insert operation for each
                // document, collating the result of each insert into an insert result
                promiseArr = [];
                data.forEach(function (doc) {
                  return promiseArr.push(_this._insertDocument(doc));
                });
                _context.next = 5;
                return Promise.all(promiseArr);
              case 5:
                promiseResultArr = _context.sent;
                promiseResultArr.forEach(function (result) {
                  if (result instanceof _OperationFailure["default"]) {
                    insertResult.failures.push(result);
                    insertResult.notInserted.push(result.data);
                    return;
                  }
                  insertResult.inserted.push(result.data);
                });
                return _context.abrupt("return", insertResult);
              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_insertOrdered", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
        var insertResult, dataIndex, insertDocumentResult;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                insertResult = {
                  "inserted": [],
                  "notInserted": [],
                  "failures": []
                }; // Loop the array of data and fire off an insert operation for each
                // document, collating the result of each insert into an insert result
                dataIndex = 0;
              case 2:
                if (!(dataIndex < data.length)) {
                  _context2.next = 14;
                  break;
                }
                _context2.next = 5;
                return _this._insertDocument(data[dataIndex]);
              case 5:
                insertDocumentResult = _context2.sent;
                if (!(insertDocumentResult instanceof _OperationFailure["default"])) {
                  _context2.next = 10;
                  break;
                }
                // This doc failed to insert, return operation result now
                insertResult.notInserted.push(insertDocumentResult.data);
                insertResult.failures.push(insertDocumentResult);
                return _context2.abrupt("return", insertResult);
              case 10:
                insertResult.inserted.push(insertDocumentResult.data);
              case 11:
                dataIndex++;
                _context2.next = 2;
                break;
              case 14:
                return _context2.abrupt("return", insertResult);
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_insertDocument", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(doc) {
        var newDoc, indexViolationResult;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // 1. Ensure primary key
                newDoc = _this.ensurePrimaryKey(doc); // 2. Check for index violation
                indexViolationResult = _this.indexViolationCheck(newDoc);
                if (!(indexViolationResult instanceof _OperationFailure["default"])) {
                  _context3.next = 4;
                  break;
                }
                return _context3.abrupt("return", indexViolationResult);
              case 4:
                // 3. Insert into internal data array
                _this._data.push(newDoc);

                // 4. Insert into indexes
                _this._indexInsert(newDoc);

                // 5. Return a successful operation
                return _context3.abrupt("return", new _OperationSuccess["default"]({
                  data: newDoc
                }));
              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "insert", /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
        var options,
          isArray,
          isAtomic,
          isOrdered,
          insertResult,
          insertOperationResult,
          _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {
                  "$atomic": false,
                  "$ordered": false
                };
                isArray = Array.isArray(data);
                isAtomic = options.$atomic === true;
                isOrdered = options.$ordered === true; // Make sure the data is an array
                if (!isArray) {
                  data = [data];
                }
                insertResult = {
                  "operation": {
                    isArray: isArray,
                    isAtomic: isAtomic,
                    isOrdered: isOrdered,
                    data: data
                  },
                  "nInserted": 0,
                  "nFailed": 0,
                  "inserted": [],
                  "notInserted": [],
                  "failures": []
                };
                if (!isOrdered) {
                  _context4.next = 12;
                  break;
                }
                _context4.next = 9;
                return _this._insertOrdered(data);
              case 9:
                insertOperationResult = _context4.sent;
                _context4.next = 21;
                break;
              case 12:
                if (!isAtomic) {
                  _context4.next = 18;
                  break;
                }
                _context4.next = 15;
                return _this._insertUnordered(data);
              case 15:
                insertOperationResult = _context4.sent;
                _context4.next = 21;
                break;
              case 18:
                _context4.next = 20;
                return _this._insertUnordered(data);
              case 20:
                insertOperationResult = _context4.sent;
              case 21:
                if (!(_this._cap && _this._data.length > _this._cap)) {
                  _context4.next = 24;
                  break;
                }
                _context4.next = 24;
                return _this.removeById((0, _path.get)(_this._data[0], _this._primaryKey));
              case 24:
                _this.emit("insert", {
                  insertResult: insertResult,
                  insertOperationResult: insertOperationResult,
                  data: data
                });

                // 5 Return result
                return _context4.abrupt("return", _objectSpread(_objectSpread(_objectSpread({}, insertResult), insertOperationResult), {}, {
                  nInserted: insertOperationResult.inserted.length,
                  nFailed: insertOperationResult.notInserted.length
                }));
              case 26:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));
      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "insertOne", /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(data) {
        var options,
          _args5 = arguments;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                options = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {
                  "$atomic": false,
                  "$ordered": false
                };
                return _context5.abrupt("return", _this.insert(data, _objectSpread(_objectSpread({}, options), {}, {
                  "$one": true
                })));
              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));
      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "insertMany", /*#__PURE__*/function () {
      var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
        var options,
          _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {
                  "$atomic": false,
                  "$ordered": false
                };
                return _context6.abrupt("return", _this.insert(data, options));
              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));
      return function (_x6) {
        return _ref6.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "find", function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _find["default"])(_this._data, queryObj);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "findOne", function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this.find(queryObj, options)[0];
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "findMany", function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this.find(queryObj, options);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "update", function (queryObj, updateObj) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      // TODO: Add option to run a sanity check on each match before and update
      //  is performed so we can check if an index violation would occur
      var resultArr = (0, _update["default"])(_this._data, queryObj, updateObj, options);
      _this.emit("update", {
        resultArr: resultArr,
        queryObj: queryObj,
        updateObj: updateObj,
        options: options
      });

      // TODO: Now loop the result array and check if any fields that are in the
      //  update object match fields that are in the index. If they are, remove each
      //  document from the index and re-index them
      return resultArr;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateOne", function (queryObj, update) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.update(queryObj, update, _objectSpread(_objectSpread({}, options), {}, {
        "$one": true
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateMany", function (queryObj, update) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _this.update(queryObj, update, options);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "remove", function () {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var resultArr = (0, _remove["default"])(_this._data, queryObj, options);
      _this.emit("remove", {
        resultArr: resultArr,
        queryObj: queryObj,
        options: options
      });

      // TODO: Now loop the result array and check if any fields that are in the
      //  remove array match objects that are in the index. If they are, remove each
      //  document from the index
      return resultArr;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeOne", function (queryObj) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this.remove(queryObj, _objectSpread(_objectSpread({}, options), {}, {
        "$one": true
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeMany", function (queryObj) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _this.remove(queryObj, options);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeById", function (id) {
      return _this.removeOne((0, _defineProperty2["default"])({}, _this._primaryKey, id));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pipe", function (receiver) {
      _this._receivers.push(receiver);
      _this.on("insert", function (args) {});
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "unPipe", function (receiver) {
      (0, _pull.pull)(_this._receivers, receiver);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "virtual", /*#__PURE__*/function () {
      var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(path) {
        var newCollection, initialData;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                newCollection = new Collection(); // Set initial data
                // TODO: Make path selection with .$. work
                _context7.next = 3;
                return _this.find(path);
              case 3:
                initialData = _context7.sent;
                _context7.next = 6;
                return newCollection.insert(initialData);
              case 6:
                _this.pipe(newCollection);
                return _context7.abrupt("return", newCollection);
              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));
      return function (_x7) {
        return _ref7.apply(this, arguments);
      };
    }());
    _this._name = name;
    _this._cap = 0;
    _this._primaryKey = "_id";
    _this._data = [];
    _this._index = [{
      "name": "primaryKey",
      "index": new _IndexHashMap2["default"]((0, _defineProperty2["default"])({}, _this._primaryKey, 1), {
        "unique": true
      })
    }];
    return _this;
  }

  /**
   * Checks for a primary key on the document and assigns one if none
   * currently exists.
   * @param {Object} doc The document to check a primary key against.
   * @returns {Object} The document passed in `obj`.
   * @private
   */

  /**
   * Inserts a document into the indexes currently defined in the collection.
   * @param {Object} doc The document to insert.
   * @returns {boolean} True if successful, false if unsuccessful.
   * @private
   */

  /**
   * Scans the collection indexes and checks that the passed doc does
   * not violate any index constraints.
   * @param {Object} doc The document to check.
   * @param {Object} [options] An options object.
   * @returns {OperationSuccess|OperationFailure} An operation result.
   */

  /**
   * Run a single operation on a single or multiple data items.
   * @param {object|Array<object>} docOrArr An array of data items or
   * a single data item object.
   * @param {function} func The operation to run on each data item.
   * @param {object} [options={}] Optional options object.
   * @returns {OperationResult} The result of the operation(s).
   */

  /**
   * Insert a document or array of documents into the collection.
   * @param {Object|Array} data The document or array of documents to insert.
   * @param {InsertOptions} [options={$atomic: false, $ordered: false}] Options object.
   * @returns {Promise<InsertResult>} The result of the insert operation.
   */

  /**
   *
   * @param path
   * @returns {Promise<Collection>}
   */
  return Collection;
}(_CoreClass2["default"]);
var _default = exports["default"] = Collection;