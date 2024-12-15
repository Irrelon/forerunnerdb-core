"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _assert = _interopRequireDefault(require("assert"));
var _remove = require("./remove");
describe("remove", function () {
  describe("Modes of operation", function () {
    it("By query", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1",
                "foo": true
              });
            case 4:
              removeResult = _context.sent;
              _assert["default"].strictEqual(removeResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "2", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, true, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("Using $one", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context2.next = 4;
              return (0, _remove.remove)(dataArr, {
                "foo": true
              }, {
                "$one": true
              });
            case 4:
              removeResult = _context2.sent;
              _assert["default"].strictEqual(removeResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "2", "Number of documents is correct");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it("Using $skipAssignment", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context3.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1"
              }, {
                "$skipAssignment": true
              });
            case 4:
              removeResult = _context3.sent;
              _assert["default"].strictEqual(removeResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].notStrictEqual(dataArr, removeResult, "Data has been immutably removed");
              _assert["default"].notStrictEqual(dataArr[0], removeResult[0], "Data has been immutably removed");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
              _assert["default"].deepStrictEqual(removeResult, [{
                "_id": "1",
                "foo": true
              }], "Correct value");
            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it("Using $preFlight() false result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context4.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id !== "1";
                }
              });
            case 4:
              removeResult = _context4.sent;
              _assert["default"].strictEqual(removeResult.length, 0, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, true, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it("Using $preFlight() true result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context5.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                }
              });
            case 4:
              removeResult = _context5.sent;
              _assert["default"].strictEqual(removeResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it("Using $preFlight() true result, $postFlight() false result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context6.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                },
                "$postFlight": function $postFlight(removedDoc, originalDoc) {
                  return removedDoc._id !== "1";
                }
              });
            case 4:
              removeResult = _context6.sent;
              _assert["default"].strictEqual(removeResult.length, 0, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, true, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it("Using $preFlight() true result, $postFlight() true result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var dataArr, removeResult;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context7.next = 4;
              return (0, _remove.remove)(dataArr, {
                "_id": "1"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                },
                "$postFlight": function $postFlight(removedDoc, originalDoc) {
                  return removedDoc._id === "1";
                }
              });
            case 4:
              removeResult = _context7.sent;
              _assert["default"].strictEqual(removeResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 8:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
  });
});