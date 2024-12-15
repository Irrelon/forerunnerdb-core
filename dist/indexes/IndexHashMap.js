"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _CoreClass2 = _interopRequireDefault(require("../core/CoreClass"));
var _path = require("@irrelon/path");
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var IndexHashMap = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(IndexHashMap, _CoreClass);
  var _super = _createSuper(IndexHashMap);
  function IndexHashMap() {
    var _this;
    var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, IndexHashMap);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_keyArr", []);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_data", {});
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_name", "");
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_options", {});
    _this._options = options;
    _this._name = _this._options.name || Object.entries(keys).reduce(function (name, _ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      name += "_" + key + ":" + val;
      return name;
    }, "");
    _this._data = {};
    _this.keys(keys);
    return _this;
  }
  (0, _createClass2["default"])(IndexHashMap, [{
    key: "keys",
    value: function keys(_keys) {
      this._keys = _keys;
      this._keyArr = Object.keys(_keys);
    }
  }, {
    key: "hash",
    value: function hash(doc) {
      var hash = "";
      for (var i = 0; i < this._keyArr.length; i++) {
        if (hash) {
          hash += "_";
        }
        hash += (0, _path.get)(doc, this._keyArr[i]);
      }
      return hash;
    }
  }, {
    key: "exists",
    value: function exists(hash) {
      return this._data[hash] && this._data[hash].length > 0;
    }
  }, {
    key: "isUnique",
    value: function isUnique() {
      return this._options.unique === true;
    }
  }, {
    key: "willViolate",
    value: function willViolate(doc) {
      var hash = this.hash(doc);
      return this.willViolateByHash(hash);
    }
  }, {
    key: "willViolateByHash",
    value: function willViolateByHash(hash) {
      return this.isUnique() && this.exists(hash);
    }
  }, {
    key: "insert",
    value: function insert(doc) {
      var hash = this.hash(doc);
      var violationCheckResult = this.willViolateByHash(hash);
      if (violationCheckResult) {
        // This is a violation / collision
        return false;
      }
      this._data[hash] = this._data[hash] || [];
      this._data[hash].push(doc);
      return true;
    }
  }, {
    key: "find",
    value: function find(query) {}
  }, {
    key: "remove",
    value: function remove(doc) {
      var hash = this.hash(doc);
      if (!this._data[hash]) return;
      var index = this._data[hash].indexOf(doc);
      if (index === -1) return;
      this._data[hash].splice(index, 1);
    }
    /**
     * Creates a new index of the same type with the same setup
     * as this index, but with no data.
     * @returns {IndexHashMap}
     */
  }, {
    key: "replicate",
    value: function replicate() {
      return new IndexHashMap(this._keys, this._options);
    }
  }]);
  return IndexHashMap;
}(_CoreClass2["default"]);
var _default = exports["default"] = IndexHashMap;