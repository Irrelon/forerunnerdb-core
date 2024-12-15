"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _assert = _interopRequireDefault(require("assert"));
var _update = require("./update");
var _operate = require("./operate.js");
describe("update", function () {
  describe("Modes of operation", function () {
    it("By query", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var dataArr, updateResult;
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
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              });
            case 4:
              updateResult = _context.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, false, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
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
    it("By query with $in", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": "true"
              }, {
                "_id": "3",
                "foo": false
              }, {
                "_id": "4",
                "foo": "false"
              }];
              _assert["default"].strictEqual(dataArr.length, 4, "Number of documents is correct");
              _context2.next = 4;
              return (0, _update.update)(dataArr, {
                "foo": {
                  $in: [true, "true"]
                }
              }, {
                "foo": false,
                "newVal": "bar"
              });
            case 4:
              updateResult = _context2.sent;
              _assert["default"].strictEqual(updateResult.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 4, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, false, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "2",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "3",
                "foo": false
              }, {
                "_id": "4",
                "foo": "false"
              }], "Correct value");
            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it("By query with nested $in", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                arr: [{
                  "foo": true,
                  arr: [{
                    "foo": "some value"
                  }, {
                    "foo": "some other value"
                  }, {
                    "foo": true
                  }, {
                    "foo": "true"
                  }, {
                    "foo": "some value"
                  }, {
                    "foo": "some other value"
                  }]
                }, {
                  "foo": "true"
                }, {
                  "foo": false
                }, {
                  "foo": "false"
                }]
              }];
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");

              // Where I left this was that this use case doesn't work yet. We don't have a way to track
              // the array indexes of each path that was modified in order to apply the update to the
              // correct sub-document. I'm also not sure about the update query structure and if it should
              // have an array index placeholder with a $ so that we know we should be filling in the
              // array index data there. I almost certainly think we should be.

              // As we match and iterate through an array, let's record the array indexes
              // that way, each array we encounter can have the index recorded so if we iterate
              // through two arrays the indexes might be recorded as [[0, 3], [1, 2]] then this can be
              // passed to the update operation and for each index list, we can fill the appropriate
              // index values where the dollars are and target the correct item in the object to
              // update. We need an array of array indexes because multiple sub-documents can match
              // a query so the update needs to be applied to each matching sub document
              _context3.next = 4;
              return (0, _update.update)(dataArr, {
                "arr.arr.foo": {
                  $in: [true, "true"]
                }
              }, {
                "arr.$.arr.$.foo": false,
                "arr.$.arr.$.newVal": "bar"
              });
            case 4:
              updateResult = _context3.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                arr: [{
                  "foo": true,
                  arr: [{
                    "foo": "some value"
                  }, {
                    "foo": "some other value"
                  }, {
                    "foo": false,
                    "newVal": "bar"
                  }, {
                    "foo": false,
                    "newVal": "bar"
                  }, {
                    "foo": "some value"
                  }, {
                    "foo": "some other value"
                  }]
                }, {
                  "foo": "true"
                }, {
                  "foo": false
                }, {
                  "foo": "false"
                }]
              }], "Correct value");
            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it("By query with $exists", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "arr": undefined
              }, {
                "_id": "2",
                "arr": []
              }, {
                "_id": "3",
                "arr": [{
                  here: true
                }]
              }, {
                "_id": "4",
                "arr": [{
                  here: false
                }]
              }];
              _assert["default"].strictEqual(dataArr.length, 4, "Number of documents is correct");
              _context4.next = 4;
              return (0, _update.update)(dataArr, {
                "arr": {
                  $exists: false
                }
              }, {
                $set: {
                  "arr": [{
                    here: true
                  }]
                }
              });
            case 4:
              updateResult = _context4.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 4, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "arr": [{
                  here: true
                }]
              }, {
                "_id": "2",
                "arr": []
              }, {
                "_id": "3",
                "arr": [{
                  here: true
                }]
              }, {
                "_id": "4",
                "arr": [{
                  here: false
                }]
              }], "Correct value");
            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it("Using $one", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var dataArr, updateResult;
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
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              });
            case 4:
              updateResult = _context5.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, false, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it("Using $skipAssignment", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var dataArr, updateResult;
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
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              }, {
                "$skipAssignment": true
              });
            case 4:
              updateResult = _context6.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].notStrictEqual(dataArr, updateResult, "Data has been immutably updated");
              _assert["default"].notStrictEqual(dataArr[0], updateResult[0], "Data has been immutably updated");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
              _assert["default"].deepStrictEqual(updateResult, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }], "Correct value");
            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it("Using $preFlight() false result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var dataArr, updateResult;
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
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id !== "1";
                }
              });
            case 4:
              updateResult = _context7.sent;
              _assert["default"].strictEqual(updateResult.length, 0, "Number of documents is correct");
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
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it("Using $preFlight() true result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context8.next = 4;
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                }
              });
            case 4:
              updateResult = _context8.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, false, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it("Using $preFlight() true result, $postFlight() false result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context9.next = 4;
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                },
                "$postFlight": function $postFlight(updatedDoc, originalDoc) {
                  return updatedDoc._id !== "1";
                }
              });
            case 4:
              updateResult = _context9.sent;
              _assert["default"].strictEqual(updateResult.length, 0, "Number of documents is correct");
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
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    it("Using $preFlight() true result, $postFlight() true result", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var dataArr, updateResult;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              dataArr = [{
                "_id": "1",
                "foo": true
              }, {
                "_id": "2",
                "foo": true
              }];
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _context10.next = 4;
              return (0, _update.update)(dataArr, {
                "_id": "1"
              }, {
                "foo": false,
                "newVal": "bar"
              }, {
                "$preFlight": function $preFlight(doc) {
                  return doc._id === "1";
                },
                "$postFlight": function $postFlight(updatedDoc, originalDoc) {
                  return updatedDoc._id === "1";
                }
              });
            case 4:
              updateResult = _context10.sent;
              _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
              _assert["default"].strictEqual(dataArr[0].foo, false, "Correct value");
              _assert["default"].deepStrictEqual(dataArr, [{
                "_id": "1",
                "foo": false,
                "newVal": "bar"
              }, {
                "_id": "2",
                "foo": true
              }], "Correct value");
            case 10:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  describe("Operations", function () {
    describe("$inc", function () {
      it("Increase by value", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": {
                    "val": 1
                  }
                }, {
                  "_id": "2",
                  "data": {
                    "val": 12
                  }
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context11.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$inc": {
                    "data.val": 1
                  }
                });
              case 4:
                updateResult = _context11.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0].data.val, 2, "Correct value");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": {
                    "val": 2
                  }
                }, {
                  "_id": "2",
                  "data": {
                    "val": 12
                  }
                }], "Correct value");
              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      })));
      it("Decrease by value", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee12() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": {
                    "val": 1
                  }
                }, {
                  "_id": "2",
                  "data": {
                    "val": 12
                  }
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context12.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$inc": {
                    "data.val": -1
                  }
                });
              case 4:
                updateResult = _context12.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": {
                    "val": 0
                  }
                }, {
                  "_id": "2",
                  "data": {
                    "val": 12
                  }
                }], "Correct value");
              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      })));
    });
    describe("$push", function () {
      it("Add item to array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee13() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 12
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context13.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$push": {
                    "data": {
                      "val": 24
                    }
                  }
                });
              case 4:
                updateResult = _context13.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 12
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 9:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      })));
    });
    describe("$pull", function () {
      it("Remove object from array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 12
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context14.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$pull": {
                    "data": {
                      "val": 12
                    }
                  }
                });
              case 4:
                updateResult = _context14.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 9:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      })));
      it("Remove number from array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [1, 12, 24]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context15.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$pull": {
                    "data": 12
                  }
                });
              case 4:
                updateResult = _context15.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [1, 24]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 8:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      })));
      it("Remove first string from array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": ["1", "12", "12", "24", 1, 12, true]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context16.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$pull": {
                    "data": "12"
                  }
                });
              case 4:
                updateResult = _context16.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": ["1", "12", "24", 1, 12, true]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 8:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      })));
      it("Remove first object from array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [{
                    "val": {
                      "calc": 1,
                      "foo": false
                    }
                  }, {
                    "val": {
                      "calc": 12,
                      "foo": true
                    }
                  }, {
                    "val": {
                      "calc": 24,
                      "foo": "bar"
                    }
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context17.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$pull": {
                    "data": {
                      "val": {
                        "calc": 12
                      }
                    }
                  }
                });
              case 4:
                updateResult = _context17.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [{
                    "val": {
                      "calc": 1,
                      "foo": false
                    }
                  }, {
                    "val": {
                      "calc": 24,
                      "foo": "bar"
                    }
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 9:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      })));
    });
    describe("$pop", function () {
      it("Pops the first item from the end of the array", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee18() {
        var dataArr, updateResult;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 12
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context18.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$pop": {
                    "data": true
                  }
                });
              case 4:
                updateResult = _context18.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [{
                    "val": 1
                  }, {
                    "val": 12
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
              case 9:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      })));
    });
    describe("$unset", function () {
      it("Removes a key from an object at the specified path with array indexes", /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee19() {
        var dataArr, updateResult, keys;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                dataArr = [{
                  "_id": "1",
                  "data": [{
                    "val": 1,
                    "other": true
                  }, {
                    "val": 12
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }];
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _context19.next = 4;
                return (0, _update.update)(dataArr, {
                  "_id": "1"
                }, {
                  "$unset": {
                    "data.0.val": 1
                  }
                });
              case 4:
                updateResult = _context19.sent;
                _assert["default"].strictEqual(updateResult.length, 1, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr.length, 2, "Number of documents is correct");
                _assert["default"].strictEqual(dataArr[0]._id, "1", "Number of documents is correct");
                _assert["default"].deepStrictEqual(dataArr, [{
                  "_id": "1",
                  "data": [{
                    "other": true
                  }, {
                    "val": 12
                  }, {
                    "val": 24
                  }]
                }, {
                  "_id": "2",
                  "data": []
                }], "Correct value");
                keys = Object.keys(dataArr[0].data[0]);
                _assert["default"].strictEqual(keys.indexOf("val"), -1, "Key is not present");
              case 11:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19);
      })));
    });
  });
});