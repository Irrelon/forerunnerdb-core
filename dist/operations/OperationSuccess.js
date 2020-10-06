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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @typedef {Object} OperationSuccessData
 * @property {String} [type=""] The type of success.
 * @property {*} [meta] Any meta-data you wish to include with your
 * success response that may be useful somewhere down the chain.
 * @property {*} [data] Any data you specifically intend to be
 * returned by your operation for use by the calling function.
 */
var OperationSuccess = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(OperationSuccess, _CoreClass);

  var _super = _createSuper(OperationSuccess);

  /**
   * Creates a new success response to an operation.
   * @param {OperationSuccessData} info The operation result.
   */
  function OperationSuccess(info) {
    var _this;

    (0, _classCallCheck2["default"])(this, OperationSuccess);
    _this = _super.call(this);
    _this.type = info.type || "";
    _this.meta = info.meta;
    _this.data = info.data;
    return _this;
  }

  return OperationSuccess;
}(_CoreClass2["default"]);

var _default = OperationSuccess;
exports["default"] = _default;