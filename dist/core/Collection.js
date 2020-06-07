"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

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

var _find2 = _interopRequireDefault(require("./operation/find"));

var _update2 = _interopRequireDefault(require("./operation/update"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Collection = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(Collection, _CoreClass);

  var _super = _createSuper(Collection);

  function Collection(name) {
    var _this;

    (0, _classCallCheck2["default"])(this, Collection);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "ensurePrimaryKey", function (obj) {
      if ((0, _path.get)(obj, this._primaryKey) === undefined) {
        // Assign a primary key automatically
        return (0, _path.setImmutable)(obj, this._primaryKey, (0, _objectId["default"])());
      }

      return obj;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "indexViolationCheck", function (doc) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var indexArray = _this._index;

      if (options.indexArray) {
        indexArray = options.indexArray;
      } // Loop each index and ask it to check if this
      // document violates any index constraints


      return indexArray.map(function (indexObj) {
        // Check if the index has a unique flag, if not it cannot violate
        // so early exit
        if (!indexObj.index.isUnique()) return new _OperationSuccess["default"]({
          type: _OperationSuccess["default"].constants.INDEX_PREFLIGHT_SUCCESS,
          meta: {
            indexName: indexObj.name,
            doc: doc
          }
        });
        var hash = indexObj.index.hash(doc);
        var wouldBeViolated = indexObj.index.willViolateByHash(hash);

        if (wouldBeViolated) {
          return new _OperationFailure["default"]({
            type: _OperationFailure["default"].constants.INDEX_VIOLATION,
            meta: {
              indexName: indexObj.name,
              hash: hash,
              doc: doc
            }
          });
        } else {
          if (options.insert === true) {
            indexObj.index.insert(doc);
          }

          return new _OperationSuccess["default"]({
            type: _OperationSuccess["default"].constants.INDEX_PREFLIGHT_SUCCESS,
            meta: {
              indexName: indexObj.name,
              hash: hash,
              doc: doc
            }
          });
        }
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "pushData", function (data) {
      var finalData = _this.ensurePrimaryKey(data);

      if (_this._indexInsert(finalData)) {
        _this._data.push(finalData);

        return new _OperationSuccess["default"]({
          type: _OperationSuccess["default"].constants.INSERT_SUCCESS,
          meta: {
            doc: finalData
          }
        });
      } else {
        return new _OperationFailure["default"]({
          type: _OperationFailure["default"].constants.INSERT_FAILURE,
          meta: {
            doc: finalData
          }
        });
      }
    });
    _this._name = name;
    _this._cap = 0;
    _this._primaryKey = "_id";
    _this._data = [];
    _this._index = [{
      "name": "primaryKey",
      "index": new _IndexHashMap2["default"]((0, _defineProperty2["default"])({}, _this._primaryKey, 1), {
        unique: true
      })
    }];
    return _this;
  }
  /**
   * Checks for a primary key on the document and assigns one if none
   * currently exists.
   * @param {Object} obj The object to check a primary key against.
   * @private
   */


  (0, _createClass2["default"])(Collection, [{
    key: "_indexInsert",
    value: function _indexInsert(data) {
      // Return true if we DIDN'T find an error
      return !this._index.find(function (indexObj) {
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

  }, {
    key: "operation",

    /**
     * Run a single operation on a single or multiple data items.
     * @param {object|Array<object>} docOrArr An array of data items or
     * a single data item object.
     * @param {function} func The operation to run on each data item.
     * @param {object} [options={}] Optional options object.
     * @returns {OperationResult} The result of the operation(s).
     */
    value: function operation(docOrArr, func) {
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
    }
    /**
     * Run a single operation on a single or multiple data items.
     * @param {object|Array<object>} docOrArr An array of data items or
     * a single data item object.
     * @param {function} func The operation to run on each data item.
     * @param {object} [options={}] Optional options object.
     */

  }, {
    key: "silentOperation",
    value: function silentOperation(docOrArr, func) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var isArray = Array.isArray(docOrArr);
      var data = docOrArr;

      if (!isArray) {
        data = [docOrArr];
      }

      for (var currentIndex = 0; currentIndex < data.length; currentIndex++) {
        var doc = data[currentIndex];
        func(doc, options);
      }
    }
  }, {
    key: "insert",
    value: function insert(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        atomic: false,
        ordered: false
      };
      var isArray = Array.isArray(data);
      var isAtomic = options.atomic === true;
      var isOrdered = options.ordered === true;
      var insertResult = {
        "operation": {
          isArray: isArray,
          isAtomic: isAtomic,
          isOrdered: isOrdered,
          data: data
        },
        "stage": {
          "preflight": {},
          "postflight": {},
          "execute": {}
        },
        "nInserted": 0,
        "nFailed": 0
      }; // 1 Check index violations against existing data

      insertResult.stage.preflight = this.operation(data, this.indexViolationCheck); // 2 Check for index violations against itself when inserted

      insertResult.stage.postflight = this.operation(data, this.indexViolationCheck, {
        insert: true,
        breakOnFailure: isOrdered,
        indexArray: this._index.map(function (indexObj) {
          return _objectSpread(_objectSpread({}, indexObj), {}, {
            index: indexObj.index.replicate()
          });
        })
      });
      insertResult.nFailed = insertResult.stage.preflight.failure.length + insertResult.stage.postflight.failure.length; // 3 If anything will fail, check if we are running atomic and if so, exit with error

      if (isAtomic && insertResult.nFailed) {
        // Atomic operation and we failed at least one op, fail the whole op
        return insertResult;
      } // 4 If not atomic, run through only allowed operations and complete them


      if (isOrdered) {
        var result = this.operation(data, this.pushData, {
          breakOnFailure: true
        });
        insertResult.nInserted = result.success.length;
      } else {
        var _result = this.operation(data, this.pushData, {
          breakOnFailure: false
        });

        insertResult.nInserted = _result.success.length;
      } // Check capped collection status and remove first record
      // if we are over the threshold


      if (this._cap && this._data.length > this._cap) {
        // Remove the first item in the data array
        this.removeById((0, _path.get)(this._data[0], this._primaryKey));
      } // 5 Return result


      return insertResult;
    }
  }, {
    key: "find",
    value: function find() {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _find2["default"])(this._data, queryObj);
    }
  }, {
    key: "findOne",
    value: function findOne(queryObj, options) {
      return this.find(queryObj, options)[0];
    }
  }, {
    key: "findMany",
    value: function findMany(queryObj, options) {
      return this.find(queryObj, options);
    }
  }, {
    key: "update",
    value: function update(queryObj, updateObj, options) {
      // TODO: Add option to run a sanity check on each match before and update
      //  is performed so we can check if an index violation would occur
      var resultArr = (0, _update2["default"])(this._data, queryObj, updateObj, options); // TODO: Now loop the result array and check if any fields that are in the
      //  update object match fields that are in the index. If they are, remove each
      //  document from the index and re-index them

      return resultArr;
    }
  }, {
    key: "updateOne",
    value: function updateOne(queryObj, update, options) {
      return this.update(queryObj, update, _objectSpread(_objectSpread({}, options), {}, {
        "$one": true
      }));
    }
  }, {
    key: "updateMany",
    value: function updateMany(queryObj, update, options) {
      return this.update(queryObj, update, options);
    }
  }, {
    key: "remove",
    value: function remove() {
      var queryObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    }
  }, {
    key: "removeOne",
    value: function removeOne(queryObj, options) {
      return this.remove(queryObj, _objectSpread(_objectSpread({}, options), {}, {
        "$one": true
      }));
    }
  }, {
    key: "removeMany",
    value: function removeMany(queryObj, options) {
      return this.remove(queryObj, options);
    }
  }, {
    key: "removeById",
    value: function removeById(id) {
      return this.removeOne((0, _defineProperty2["default"])({}, this._primaryKey, id));
    }
  }]);
  return Collection;
}(_CoreClass2["default"]);

var _default = Collection;
exports["default"] = _default;