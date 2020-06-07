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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _CoreClass2 = _interopRequireDefault(require("../core/CoreClass"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var OperationFailure = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(OperationFailure, _CoreClass);

  var _super = _createSuper(OperationFailure);

  function OperationFailure() {
    var _this;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      "type": OperationFailure.constants.UNDEFINED_FAILURE,
      meta: {}
    };
    (0, _classCallCheck2["default"])(this, OperationFailure);
    _this = _super.call(this);
    _this.type = data.type;
    _this.meta = data.meta;
    return _this;
  }

  return OperationFailure;
}(_CoreClass2["default"]);

(0, _defineProperty2["default"])(OperationFailure, "constants", {
  "UNDEFINED_FAILURE": "UNDEFINED_FAILURE",
  "INDEX_VIOLATION": "INDEX_VIOLATION",
  "INSERT_FAILURE": "INSERT_FAILURE"
});
var _default = OperationFailure;
exports["default"] = _default;