"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assert = _interopRequireDefault(require("assert"));

var _Collection = _interopRequireDefault(require("./Collection"));

describe("Collection", function () {
  describe("operation()", function () {
    describe("Positive Path", function () {
      it("Can run an operation and provide the correct result", function () {
        var coll = new _Collection["default"]();
        var result = coll.operation({
          "_id": "1"
        }, coll.indexViolationCheck);

        _assert["default"].strictEqual(result.success.length, 1, "Correct");

        _assert["default"].strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
      });
      it("Can run multiple operations and provide the correct result", function () {
        var coll = new _Collection["default"]();
        var result = coll.operation([{
          "_id": "1"
        }, {
          "_id": "2"
        }], coll.indexViolationCheck);

        _assert["default"].strictEqual(result.success.length, 2, "Correct");

        _assert["default"].strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");

        _assert["default"].strictEqual(result.success[1].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");
      });
    });
    describe("Negative Path", function () {
      it("Can run an operation and provide the correct result", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var coll, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                coll = new _Collection["default"]();
                _context.next = 3;
                return coll.insert({
                  "_id": "1"
                });

              case 3:
                result = coll.operation({
                  "_id": "1"
                }, coll.indexViolationCheck);

                _assert["default"].strictEqual(result.success.length, 0, "Correct");

                _assert["default"].strictEqual(result.failure.length, 1, "Correct");

                _assert["default"].strictEqual(result.failure[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Correct");

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
      it("Can run multiple operations and provide the correct result", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var coll, result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                coll = new _Collection["default"]();
                _context2.next = 3;
                return coll.insert({
                  "_id": "1"
                });

              case 3:
                result = coll.operation([{
                  "_id": "1"
                }, {
                  "_id": "2"
                }], coll.indexViolationCheck);

                _assert["default"].strictEqual(result.success.length, 1, "Correct");

                _assert["default"].strictEqual(result.failure.length, 1, "Correct");

                _assert["default"].strictEqual(result.failure[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Correct");

                _assert["default"].strictEqual(result.success[0].type, "INDEX_VIOLATION_CHECK_SUCCESS", "Correct");

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
    });
  });
  describe("insert()", function () {
    it("Can insert a single document", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var coll, result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              coll = new _Collection["default"]();
              _context3.next = 3;
              return coll.insert({
                "foo": true
              });

            case 3:
              result = _context3.sent;

              //console.log(result);
              _assert["default"].strictEqual(result.nInserted, 1, "Number of inserted documents is correct");

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it("Can insert an array of documents", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var coll, result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              coll = new _Collection["default"]();
              _context4.next = 3;
              return coll.insert([{
                "_id": 20,
                "item": "lamp",
                "qty": 50,
                "type": "desk"
              }, {
                "_id": 21,
                "item": "lamp",
                "qty": 20,
                "type": "floor"
              }, {
                "_id": 22,
                "item": "bulk",
                "qty": 100
              }], {
                "$ordered": true
              });

            case 3:
              result = _context4.sent;

              _assert["default"].strictEqual(result.nInserted, 3, "Number of inserted documents is correct");

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it("Can insert an array of documents unordered", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var coll, result;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              coll = new _Collection["default"]();
              _context5.next = 3;
              return coll.insert([{
                "_id": 20,
                "item": "lamp",
                "qty": 50,
                "type": "desk"
              }, {
                "_id": 21,
                "item": "lamp",
                "qty": 20,
                "type": "floor"
              }, {
                "_id": 22,
                "item": "bulk",
                "qty": 100
              }], {
                "$ordered": false
              });

            case 3:
              result = _context5.sent;

              _assert["default"].strictEqual(result.nInserted, 3, "Number of inserted documents is correct");

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it("Can insert an array of documents ordered and fail correctly by index violation", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var coll, result;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              coll = new _Collection["default"]();
              _context6.next = 3;
              return coll.insert([{
                "_id": 30,
                "item": "lamp",
                "qty": 50,
                "type": "desk"
              }, {
                "_id": 30,
                "item": "lamp",
                "qty": 20,
                "type": "floor"
              }, {
                "_id": 32,
                "item": "bulk",
                "qty": 100
              }], {
                "$ordered": true
              });

            case 3:
              result = _context6.sent;

              // The below number should be 1 because we are inserting ordered so on the
              // second insert (which will fail) the operation should stop
              _assert["default"].strictEqual(result.nInserted, 1, "Number of inserted documents is correct");

              _assert["default"].strictEqual(result.nFailed, 1, "Number of failed documents is correct");

              _assert["default"].strictEqual(result.failures.length, 1, "Number of failed documents is correct");

              _assert["default"].strictEqual(result.failures[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Error code is correct");

            case 8:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it("Can insert an array of documents unordered and fail correctly by index violation", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var coll, result, findResult1;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              coll = new _Collection["default"]();
              _context7.next = 3;
              return coll.insert([{
                "_id": 40,
                "item": "lamp",
                "qty": 50,
                "type": "desk"
              }, {
                "_id": 40,
                "item": "lamp",
                "qty": 20,
                "type": "floor"
              }, {
                "_id": 42,
                "item": "bulk",
                "qty": 100
              }, {
                "_id": 40,
                "item": "lamp",
                "qty": 20,
                "type": "floor"
              }], {
                "$ordered": false
              });

            case 3:
              result = _context7.sent;
              _context7.next = 6;
              return coll.find();

            case 6:
              findResult1 = _context7.sent;

              _assert["default"].strictEqual(result.nInserted, 2, "Number of inserted documents is correct");

              _assert["default"].strictEqual(result.nFailed, 2, "Number of failed documents is correct");

              _assert["default"].strictEqual(result.failures.length, 2, "Number of failed documents is correct");

              _assert["default"].strictEqual(result.failures[0].type, "INDEX_VIOLATION_CHECK_FAILURE", "Error code is correct");

              _assert["default"].strictEqual(findResult1.length, 2, "Number of documents is correct");

              _assert["default"].deepStrictEqual(findResult1, [{
                "_id": 40,
                "item": "lamp",
                "qty": 50,
                "type": "desk"
              }, {
                "_id": 42,
                "item": "bulk",
                "qty": 100
              }], "Correct value");

            case 13:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }))); // TODO: Add an atomic operation insert test
  });
  describe("update()", function () {
    it("Can update a single document", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var coll, insertResult, findResult1, updateResult, findResult2;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              coll = new _Collection["default"]();
              _context8.next = 3;
              return coll.insert([{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }]);

            case 3:
              insertResult = _context8.sent;
              _context8.next = 6;
              return coll.find();

            case 6:
              findResult1 = _context8.sent;
              _context8.next = 9;
              return coll.updateOne({
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              });

            case 9:
              updateResult = _context8.sent;
              _context8.next = 12;
              return coll.find();

            case 12:
              findResult2 = _context8.sent;

              _assert["default"].strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");

              _assert["default"].strictEqual(findResult1.length, 2, "Number of documents is correct");

              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");

              _assert["default"].strictEqual(findResult2.length, 2, "Number of documents is correct");

              _assert["default"].strictEqual(findResult2[0]._id, "1", "Number of documents is correct");

              _assert["default"].strictEqual(findResult2[0].foo, false, "Correct value");

              _assert["default"].deepStrictEqual(findResult2, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");

            case 20:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it("Can update a single document with an operator", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var coll, insertResult, findResult1, updateResult, findResult2;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              coll = new _Collection["default"]();
              _context9.next = 3;
              return coll.insert([{
                "_id": "1",
                "count": 0
              }, {
                "_id": "2",
                "count": 12
              }]);

            case 3:
              insertResult = _context9.sent;
              _context9.next = 6;
              return coll.find();

            case 6:
              findResult1 = _context9.sent;
              _context9.next = 9;
              return coll.updateOne({
                "_id": "2"
              }, {
                "$inc": {
                  "count": 2
                }
              });

            case 9:
              updateResult = _context9.sent;
              _context9.next = 12;
              return coll.find();

            case 12:
              findResult2 = _context9.sent;

              _assert["default"].strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");

              _assert["default"].strictEqual(findResult1.length, 2, "Number of documents is correct");

              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");

              _assert["default"].strictEqual(findResult2.length, 2, "Number of documents is correct");

              _assert["default"].strictEqual(findResult2[1]._id, "2", "Number of documents is correct");

              _assert["default"].strictEqual(findResult2[1].count, 14, "Correct value");

              _assert["default"].deepStrictEqual(findResult2, [{
                "_id": "1",
                "count": 0
              }, {
                "_id": "2",
                "count": 14
              }], "Correct value");

            case 20:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
  });
  describe("remove()", function () {
    it("Can remove a single document", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var coll, insertResult, findResult1, updateResult, findResult2;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              coll = new _Collection["default"]();
              _context10.next = 3;
              return coll.insert([{
                "_id": "1",
                "count": 0
              }, {
                "_id": "2",
                "count": 12
              }]);

            case 3:
              insertResult = _context10.sent;
              _context10.next = 6;
              return coll.find();

            case 6:
              findResult1 = _context10.sent;
              _context10.next = 9;
              return coll.removeOne({
                "_id": "2"
              });

            case 9:
              updateResult = _context10.sent;
              _context10.next = 12;
              return coll.find();

            case 12:
              findResult2 = _context10.sent;

              _assert["default"].strictEqual(insertResult.nInserted, 2, "Number of inserted documents is correct");

              _assert["default"].strictEqual(findResult1.length, 2, "Number of documents is correct");

              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");

              _assert["default"].strictEqual(findResult2.length, 1, "Number of documents is correct");

              _assert["default"].deepStrictEqual(findResult2, [{
                "_id": "1",
                "count": 0
              }], "Correct value");

            case 18:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
});