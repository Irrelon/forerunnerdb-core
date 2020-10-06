"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Pipeline = _interopRequireDefault(require("./Pipeline"));

var _OperationSuccess = _interopRequireDefault(require("../operations/OperationSuccess"));

var _assert = _interopRequireDefault(require("assert"));

var _OperationFailure = _interopRequireDefault(require("../operations/OperationFailure"));

describe("Pipeline", function () {
  describe("execute()", function () {
    it("Will correctly return data on success", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var pipeline, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pipeline = new _Pipeline["default"]();
              pipeline.addStep("preFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "first", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "second"
                });
              });
              pipeline.addStep("midFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "second", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "third"
                });
              });
              pipeline.addStep("postFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "third", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "fourth"
                });
              });
              _context.next = 6;
              return pipeline.execute("first");

            case 6:
              result = _context.sent;

              _assert["default"].strictEqual(result.success.length, 3, "The number of successful results is correct");

              _assert["default"].strictEqual(result.success[0].data, "second", "The return data is correct");

              _assert["default"].strictEqual(result.success[1].data, "third", "The return data is correct");

              _assert["default"].strictEqual(result.success[2].data, "fourth", "The return data is correct");

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("Will correctly fail on a failure response", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var pipeline, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              pipeline = new _Pipeline["default"]();
              pipeline.addStep("preFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "first", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "second"
                });
              });
              pipeline.addStep("midFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "second", "The return data is correct");

                return new _OperationFailure["default"]({
                  "data": "third"
                });
              });
              pipeline.addStep("postFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "third", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "fourth"
                });
              });
              _context2.next = 6;
              return pipeline.execute("first");

            case 6:
              result = _context2.sent;

              _assert["default"].strictEqual(result.success.length, 2, "The number of successful results is correct");

              _assert["default"].strictEqual(result.failure.length, 1, "The number of failed results is correct");

              _assert["default"].strictEqual(result.success[0].data, "second", "The return data is correct");

              _assert["default"].strictEqual(result.success[1].data, "fourth", "The return data is correct");

              _assert["default"].strictEqual(result.failure[0].data, "third", "The return data is correct");

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it("Will correctly fail completely on a failure response in atomic mode", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var pipeline, result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              pipeline = new _Pipeline["default"]();
              pipeline.addStep("preFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "first", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "second"
                });
              });
              pipeline.addStep("midFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "second", "The return data is correct");

                return new _OperationFailure["default"]({
                  "data": "third"
                });
              });
              pipeline.addStep("postFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "third", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "fourth"
                });
              });
              _context3.next = 6;
              return pipeline.execute("first", {
                "$atomic": true
              });

            case 6:
              result = _context3.sent;

              _assert["default"].strictEqual(result.success.length, 0, "The number of successful results is correct");

              _assert["default"].strictEqual(result.failure.length, 1, "The number of failed results is correct");

              _assert["default"].strictEqual(result.failure[0].data, "third", "The return data is correct");

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it("Will correctly fail at the first error in ordered mode", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var pipeline, result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              pipeline = new _Pipeline["default"]();
              pipeline.addStep("preFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "first", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "second"
                });
              });
              pipeline.addStep("midFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "second", "The return data is correct");

                return new _OperationFailure["default"]({
                  "data": "third"
                });
              });
              pipeline.addStep("postFlight", function (data, originalData) {
                _assert["default"].strictEqual(originalData, "first", "The return data is correct");

                _assert["default"].strictEqual(data, "third", "The return data is correct");

                return new _OperationSuccess["default"]({
                  "data": "fourth"
                });
              });
              _context4.next = 6;
              return pipeline.execute("first", {
                "$ordered": true
              });

            case 6:
              result = _context4.sent;

              _assert["default"].strictEqual(result.success.length, 1, "The number of successful results is correct");

              _assert["default"].strictEqual(result.failure.length, 1, "The number of failed results is correct");

              _assert["default"].strictEqual(result.success[0].data, "second", "The return data is correct");

              _assert["default"].strictEqual(result.failure[0].data, "third", "The return data is correct");

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});