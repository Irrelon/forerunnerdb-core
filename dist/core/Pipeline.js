"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _CoreClass2 = _interopRequireDefault(require("./CoreClass"));

var _OperationResult = _interopRequireDefault(require("../operations/OperationResult"));

var _OperationSuccess = _interopRequireDefault(require("../operations/OperationSuccess"));

var _OperationFailure = _interopRequireDefault(require("../operations/OperationFailure"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @typedef {Object} ExecuteOptions
 * @property {Boolean} [$atomic] If true, any failure at any point in the
 * pipeline will result in the complete failure of the whole pipeline.
 * @property {Boolean} [$ordered] If true, any failure at any point in the
 * pipeline will result in the pipeline cancelling at that point but all
 * previous work will remain in place.
 */

/**
 * @callback StepFunction
 * @param {*} data The data the function is given by the pipeline.
 * @param {*} originalData The value of the data before any pipeline steps
 * changed it. This will always be the value that `data` was before it got
 * changed.
 */
var Pipeline = /*#__PURE__*/function (_CoreClass) {
  (0, _inherits2["default"])(Pipeline, _CoreClass);

  var _super = _createSuper(Pipeline);

  function Pipeline() {
    var _this;

    (0, _classCallCheck2["default"])(this, Pipeline);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "executeStep", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, data, originalData) {
        var step, stepResult;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                step = _this._steps.get(name);

                if (step) {
                  _context.next = 3;
                  break;
                }

                throw new Error("No step with the name \"".concat(name, "\" exists!"));

              case 3:
                _context.next = 5;
                return step.func(data, originalData);

              case 5:
                stepResult = _context.sent;

                if (stepResult instanceof _OperationSuccess["default"] || stepResult instanceof _OperationFailure["default"]) {
                  _context.next = 8;
                  break;
                }

                throw new Error("Return value from step \"".concat(name, "\" was not an OperationSuccess or OperationFailure instance!"));

              case 8:
                return _context.abrupt("return", stepResult);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "execute", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
        var options,
            operationResult,
            originalData,
            steps,
            iteratorResult,
            currentStepData,
            stepName,
            stepResult,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {
                  "$atomic": false,
                  "$ordered": false
                };
                operationResult = new _OperationResult["default"]();
                originalData = data;
                steps = _this._steps.keys();
                currentStepData = data;

              case 5:
                if (!(iteratorResult = steps.next())) {
                  _context2.next = 24;
                  break;
                }

                if (!iteratorResult.done) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("break", 24);

              case 8:
                stepName = iteratorResult.value;
                _context2.next = 11;
                return _this.executeStep(stepName, currentStepData, originalData);

              case 11:
                stepResult = _context2.sent;

                if (!(stepResult instanceof _OperationFailure["default"])) {
                  _context2.next = 20;
                  break;
                }

                if (!options.$atomic) {
                  _context2.next = 17;
                  break;
                }

                // Fail the entire pipeline
                operationResult.clearSuccess();
                operationResult.addFailure(stepResult);
                return _context2.abrupt("return", operationResult);

              case 17:
                if (!options.$ordered) {
                  _context2.next = 20;
                  break;
                }

                // Fail the rest of the pipeline
                operationResult.addFailure(stepResult);
                return _context2.abrupt("return", operationResult);

              case 20:
                // Add the result to the overall operation
                operationResult.addResult(stepResult); // Check if the result provided us with new data to pass to the
                // next step in the pipeline

                if (stepResult.data !== undefined) {
                  currentStepData = stepResult.data;
                }

                _context2.next = 5;
                break;

              case 24:
                return _context2.abrupt("return", operationResult);

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x4) {
        return _ref2.apply(this, arguments);
      };
    }());
    _this._steps = new Map();
    return _this;
  }
  /**
   * Add a step to the pipeline.
   * @param {String} name The unique name of the step.
   * @param {StepFunction} func The function to run when the step is executed.
   * @param {ExecuteOptions} [options] An options object.
   * @returns {Boolean} True if the step was added, false if a step of
   * that name already exists.
   */


  (0, _createClass2["default"])(Pipeline, [{
    key: "addStep",
    value: function addStep(name, func, options) {
      if (this._steps.get(name)) return false;

      this._steps.set(name, {
        name: name,
        func: func,
        options: options
      });

      return true;
    }
    /**
     * Removes a step from the pipeline by name.
     * @param {String} name The name of the step to remove.
     * @returns {void} Nothing.
     */

  }, {
    key: "removeStep",
    value: function removeStep(name) {
      this._steps["delete"](name);
    }
    /**
     * Execute the pipeline steps with the passed data.
     * @param {String} name The name of the step to execute.
     * @param {Object} [data] The data to pass to the pipeline.
     * @param {Object} [originalData] The original data passed to the
     * pipeline. This is different from `data` in that `data` can be
     * updated by a pipeline step whereas `originalData` remains the
     * value that `data` was originally before the pipeline was executed.
     * @returns {Promise<OperationSuccess|OperationFailure>} The result of the operation.
     */

  }]);
  return Pipeline;
}(_CoreClass2["default"]);

var _default = Pipeline;
exports["default"] = _default;