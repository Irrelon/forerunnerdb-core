"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _emitter = require("@irrelon/emitter");
function _createSuper(t) { var r = _isNativeReflectConstruct(); return function () { var e, o = (0, _getPrototypeOf2["default"])(t); if (r) { var s = (0, _getPrototypeOf2["default"])(this).constructor; e = Reflect.construct(o, arguments, s); } else e = o.apply(this, arguments); return (0, _possibleConstructorReturn2["default"])(this, e); }; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var _synth = {};
var CoreClass = /*#__PURE__*/function (_Emitter) {
  (0, _inherits2["default"])(CoreClass, _Emitter);
  var _super = _createSuper(CoreClass);
  function CoreClass() {
    (0, _classCallCheck2["default"])(this, CoreClass);
    return _super.apply(this, arguments);
  }
  (0, _createClass2["default"])(CoreClass, [{
    key: "synthesize",
    /**
     * Generates a generic getter/setter method for the passed method name.
     * @param {String} name The name of the getter/setter to generate.
     */
    value: function synthesize(name) {
      _synth[name] = _synth[name] || function (val) {
        if (val !== undefined) {
          this["_" + name] = val;
          return this;
        }
        return this["_" + name];
      };
      return _synth[name];
    }
  }]);
  return CoreClass;
}(_emitter.Emitter);
var _default = exports["default"] = CoreClass;