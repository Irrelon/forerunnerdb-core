"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
	"value": true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _CoreClass2 = _interopRequireDefault(require("./CoreClass"));

function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], () => {})); return true; } catch (e) { return false; } }

var Pipeline = /*#__PURE__*/function (_CoreClass) {
	(0, _inherits2["default"])(Pipeline, _CoreClass);

	var _super = _createSuper(Pipeline);

	function Pipeline (query) {
		var _this;

		(0, _classCallCheck2["default"])(this, Pipeline);
		_this = _super.call(this);
		_this._steps = queryToPipeline(query);
		return _this;
	}

	(0, _createClass2["default"])(Pipeline, [{
		"key": "addStep",
		"value": function addStep (stepData) {
			this._steps.push(stepData);
		}
	}]);
	return Pipeline;
}(_CoreClass2["default"]);

var _default = Pipeline;
exports["default"] = _default;