"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
	"value": true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _synth = {};

var CoreClass = /*#__PURE__*/function () {
	function CoreClass () {
		(0, _classCallCheck2["default"])(this, CoreClass);
	}

	(0, _createClass2["default"])(CoreClass, [{
		"key": "synthesize",

		/**
     * Generates a generic getter/setter method for the passed method name.
     * @param {String} name The name of the getter/setter to generate.
     */
		"value": function synthesize (name) {
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
}();

var _default = CoreClass;
exports["default"] = _default;