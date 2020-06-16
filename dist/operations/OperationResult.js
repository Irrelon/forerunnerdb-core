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

var _CoreClass2 = _interopRequireDefault(require("../core/CoreClass"));

var _OperationFailure = _interopRequireDefault(require("./OperationFailure"));

var _OperationSuccess = _interopRequireDefault(require("./OperationSuccess"));

function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], () => {})); return true; } catch (e) { return false; } }

var OperationResult = /*#__PURE__*/function (_CoreClass) {
	(0, _inherits2["default"])(OperationResult, _CoreClass);

	var _super = _createSuper(OperationResult);

	function OperationResult () {
		var _this;

		var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck2["default"])(this, OperationResult);
		_this = _super.call(this);
		_this.failure = [];
		_this.success = [];

		if (data.failure) {
			_this.addFailure(data.failure);
		}

		if (data.success) {
			_this.addSuccess(data.success);
		}

		return _this;
	}

	(0, _createClass2["default"])(OperationResult, [{
		"key": "addResult",
		"value": function addResult (op) {
			var _this2 = this;

			if (Array.isArray(op)) {
				op.forEach((item) => {
					_this2.addResult(item);
				});
				return;
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
     */

	}, {
		"key": "addFailure",
		"value": function addFailure (failure) {
			var _this3 = this;

			if (Array.isArray(failure)) {
				failure.forEach((item) => {
					_this3.addFailure(item);
				});
				return;
			}

			this.failure.push(failure);
		}
		/**
     * Add a success to the operation result.
     * @param {OperationSuccess|Array<OperationSuccess>} success The success or array of successes.
     */

	}, {
		"key": "addSuccess",
		"value": function addSuccess (success) {
			var _this4 = this;

			if (Array.isArray(success)) {
				success.forEach((item) => {
					_this4.addSuccess(item);
				});
				return;
			}

			this.success.push(success);
		}
	}]);
	return OperationResult;
}(_CoreClass2["default"]);

var _default = OperationResult;
exports["default"] = _default;