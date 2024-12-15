"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _CoreClass2 = _interopRequireDefault(require("../core/CoreClass"));
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * @typedef {Object} OperationFailureData
 * @property {String} [type=""] The type of failure. Useful for
 * signalling failure context to downstream code.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere downstream.
 * @property {*} [data] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */
var OperationFailure = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(OperationFailure, _CoreClass);
  var _super = _createSuper(OperationFailure);
  /**
   * Creates a new failure response to an operation.
   * @param {OperationFailureData} info The operation result.
   */
  function OperationFailure(info) {
    var _this;
    (0, _classCallCheck2["default"])(this, OperationFailure);
    _this = _super.call(this);
    _this.type = info.type || "";
    _this.meta = info.meta;
    _this.data = info.data;
    return _this;
  }
  return OperationFailure;
}(_CoreClass2["default"]);
var _default = exports["default"] = OperationFailure;