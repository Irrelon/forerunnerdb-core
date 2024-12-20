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
var _CoreClass2 = _interopRequireDefault(require("../core/CoreClass"));
var _OperationFailure = _interopRequireDefault(require("./OperationFailure"));
var _OperationSuccess = _interopRequireDefault(require("./OperationSuccess"));
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var OperationResult = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(OperationResult, _CoreClass);
  var _super = _createSuper(OperationResult);
  function OperationResult() {
    var _this;
    var _data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, OperationResult);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setResultData", function (data) {
      _this.resultData = data;
    });
    _this.resultCode = null;
    _this.resultData = null;
    _this.failure = [];
    _this.success = [];
    if (_data.failure) {
      _this.addFailure(_data.failure);
    }
    if (_data.success) {
      _this.addSuccess(_data.success);
    }
    return _this;
  }
  (0, _createClass2["default"])(OperationResult, [{
    key: "addResult",
    value: function addResult(op) {
      var _this2 = this;
      if (Array.isArray(op)) {
        op.forEach(function (item) {
          _this2.addResult(item);
        });
        return this;
      }
      if (op instanceof _OperationFailure["default"]) {
        return this.addFailure(op);
      }
      if (op instanceof _OperationSuccess["default"]) {
        return this.addSuccess(op);
      }
      throw new Error("Operation being added is not an instance of OperationSuccess or OperationFailure!");
    }
    /**
     * Add an failure to the operation result.
     * @param {OperationFailure|Array<OperationFailure>} failure The failure or array of failures.
     * @returns {OperationResult} Returns a pointer to itself.
     */
  }, {
    key: "addFailure",
    value: function addFailure(failure) {
      var _this3 = this;
      if (Array.isArray(failure)) {
        failure.forEach(function (item) {
          _this3.addFailure(item);
        });
        return this;
      }
      this.failure.push(failure);
      return this;
    }
    /**
     * Add a success to the operation result.
     * @param {OperationSuccess|Array<OperationSuccess>} success The success or array of successes.
     * @returns {OperationResult} Returns a pointer to itself.
     */
  }, {
    key: "addSuccess",
    value: function addSuccess(success) {
      var _this4 = this;
      if (Array.isArray(success)) {
        success.forEach(function (item) {
          _this4.addSuccess(item);
        });
        return this;
      }
      this.success.push(success);
      return this;
    }
    /**
     * Removes all success results from the operation.
     */
  }, {
    key: "clearSuccess",
    value: function clearSuccess() {
      this.success = [];
    }
    /**
     * Removes all failure results from the operation.
     */
  }, {
    key: "clearFailure",
    value: function clearFailure() {
      this.failure = [];
    }
  }]);
  return OperationResult;
}(_CoreClass2["default"]);
var _default = exports["default"] = OperationResult;