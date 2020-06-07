"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationLookup = exports.queryToPipeline = exports.$or = exports.$and = exports.gateOperation = exports.reduceArray = exports.objectToArray = exports.$ne = exports.$in = exports.$gte = exports.$gt = exports.$lte = exports.$lt = exports.$eq = exports.$eeq = exports.genericOperation = exports.queryFromObject = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _type = require("../../utils/type");

var _match = require("./match");

var _path = require("@irrelon/path");

var queryFromObject = function queryFromObject(obj) {
  return (0, _path.flattenValues)(obj, undefined, "", {
    transformKey: function transformKey(key, info) {
      return info.isArrayIndex ? "$" : key;
    },
    leavesOnly: true
  });
};

exports.queryFromObject = queryFromObject;

var genericOperation = function genericOperation() {
  var op = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return function (path, value, typeData) {
    return {
      op: op,
      "type": typeData.type,
      "instance": typeData.instance,
      path: path,
      value: value
    };
  };
};

exports.genericOperation = genericOperation;
var $eeq = genericOperation("$eeq");
exports.$eeq = $eeq;
var $eq = genericOperation("$eq");
exports.$eq = $eq;
var $lt = genericOperation("$lt");
exports.$lt = $lt;
var $lte = genericOperation("$lte");
exports.$lte = $lte;
var $gt = genericOperation("$gt");
exports.$gt = $gt;
var $gte = genericOperation("$gte");
exports.$gte = $gte;
var $in = genericOperation("$in");
exports.$in = $in;
var $ne = genericOperation("$ne");
exports.$ne = $ne;

var objectToArray = function objectToArray(obj) {
  return Object.entries(obj).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return (0, _defineProperty2["default"])({}, key, val);
  });
};

exports.objectToArray = objectToArray;

var reduceArray = function reduceArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.reduce(function (finalArr, item) {
    if (Array.isArray(item)) {
      return finalArr.concat(reduceArray(item));
    }

    finalArr.push(item);
    return finalArr;
  }, []);
};

exports.reduceArray = reduceArray;

var gateOperation = function gateOperation(op) {
  return function (path, value) {
    var finalValue = function () {
      return value.reduce(function (itemArr, item) {
        if (!Array.isArray(item) && Object.keys(item).length > 1) {
          // The `value` is an object with multiple keys / paths
          // so split the object into an array of objects, each
          // object containing one of the key/val pairs of the
          // original `value` object
          return itemArr.concat(reduceArray(objectToArray(item).map(function (item) {
            return queryToPipeline(item, op, path);
          })));
        }

        return itemArr.concat(reduceArray(queryToPipeline(item, op, path)));
      }, []);
    }();

    return {
      op: op,
      "type": "array",
      "instance": "",
      "path": "",
      "value": finalValue
    };
  };
};

exports.gateOperation = gateOperation;
var $and = gateOperation("$and");
exports.$and = $and;
var $or = gateOperation("$or");
exports.$or = $or;

var queryToPipeline = function queryToPipeline(query) {
  var currentGate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var parentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  if (!currentGate) {
    var queryKeyArr = Object.keys(query); // Check if we already have gate operations

    var gateKey = _match.gates.find(function (key) {
      return queryKeyArr.indexOf(key) > -1;
    });

    if (gateKey && queryKeyArr.length > 1) {
      // This is an error. A query can either be fully gated
      // or fully un-gated (implicit $and) but not both
      throw new Error("A query cannot contain both gated and un-gated field properties!");
    }

    if (gateKey) {
      return operationLookup[gateKey](parentPath, query[gateKey]);
    } else {
      // Implicit $and
      return $and(parentPath, objectToArray(query));
    }
  } // ROB: When we call a gate operation we pass an empty path but it needs
  // to be the path to the data - do a step through with the tests to see
  // what's breaking... we're bringing match.js back up to speed after
  // doing a fantastic job rationalising the queryToPipeline() call but it
  // needs to handle paths correctly AND it needs to handle $in correctly...
  // which I suspect means we need a new type of genericOperation() like
  // genericArrayOperation() or whatever. X


  return Object.entries(query).map(function (_ref4) {
    var _ref5 = (0, _slicedToArray2["default"])(_ref4, 2),
        path = _ref5[0],
        value = _ref5[1];

    var valTypeData = (0, _type.extendedType)(value);

    if (path.indexOf("$") === 0) {
      // This is an operation
      if (!operationLookup[path]) {
        throw new Error("Operation \"".concat(path, "\" not recognised"));
      }

      return operationLookup[path](parentPath, value, (0, _type.extendedType)(value));
    } // The path is not an operation so check if it is holding a recursive
    // value or not


    if (!valTypeData.isFlat) {
      // Wrap this in an $and
      if (currentGate !== "$and") {
        return $and((0, _path.join)(parentPath, path), objectToArray(value));
      } else {
        // Merge our current data with the parent data
        return objectToArray(value).map(function (item) {
          return queryToPipeline(item, currentGate, path);
        });
      }
    } // The path is not an operation, the value is not recursive so
    // we have an implicit $eeq


    return $eeq((0, _path.join)(parentPath, path), value, (0, _type.extendedType)(value));
  })[0];
};

exports.queryToPipeline = queryToPipeline;
var operationLookup = {
  $eeq: $eeq,
  $eq: $eq,
  $and: $and,
  $or: $or,
  $gt: $gt,
  $gte: $gte,
  $lt: $lt,
  $lte: $lte,
  $in: $in,
  $ne: $ne
};
exports.operationLookup = operationLookup;