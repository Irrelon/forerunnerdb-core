"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateToPipeline = exports.reduceArray = exports.queryToPipeline = exports.queryFromObject = exports.operationLookup = exports.objectToArray = exports.genericOperation = exports.gateOperation = exports.$updateSetMode = exports.$updateReplaceMode = exports.$or = exports.$and = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _type = require("../../utils/type");
var _match = require("./match");
var _path = require("@irrelon/path");
var queryFromObject = exports.queryFromObject = function queryFromObject(obj) {
  return (0, _path.flattenValues)(obj, undefined, "", {
    "transformKey": function transformKey(key, info) {
      return info.isArrayIndex ? "$" : key;
    },
    "leavesOnly": true
  });
};

/**
 * Generates a generic operation function and returns it.
 * @param {String} op The dollar op name e.g. "$eeq".
 * @returns {Object}
 */
var genericOperation = exports.genericOperation = function genericOperation() {
  var op = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var path = arguments.length > 1 ? arguments[1] : undefined;
  var value = arguments.length > 2 ? arguments[2] : undefined;
  var typeData = arguments.length > 3 ? arguments[3] : undefined;
  return {
    op: op,
    "type": typeData.type,
    "instance": typeData.instance,
    path: path,
    value: value
  };
};

// Query operations
/*export const $eeq = genericOperation("$eeq");
export const $eq = genericOperation("$eq");
export const $lt = genericOperation("$lt");
export const $lte = genericOperation("$lte");
export const $gt = genericOperation("$gt");
export const $gte = genericOperation("$gte");
export const $in = genericOperation("$in");
export const $nin = genericOperation("$nin");
export const $ne = genericOperation("$ne");
export const $nee = genericOperation("$nee");
export const $fastIn = genericOperation("$fastIn");
export const $fastNin = genericOperation("$fastNin");*/

// Update operations
/*export const $replaceValue = genericOperation("$replaceValue");
export const $inc = genericOperation("$inc");
export const $push = genericOperation("$push");*/

var objectToArray = exports.objectToArray = function objectToArray(obj) {
  return Object.entries(obj).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      key = _ref2[0],
      val = _ref2[1];
    return (0, _defineProperty2["default"])({}, key, val);
  });
};
var reduceArray = exports.reduceArray = function reduceArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.reduce(function (finalArr, item) {
    if (Array.isArray(item)) {
      return finalArr.concat(reduceArray(item));
    }
    finalArr.push(item);
    return finalArr;
  }, []);
};
var gateOperation = exports.gateOperation = function gateOperation(op, pipelineGenerator) {
  return function (path, value) {
    var finalValue = function () {
      return value.reduce(function (itemArr, item) {
        if (!Array.isArray(item) && Object.keys(item).length > 1) {
          // The `value` is an object with multiple keys / paths
          // so split the object into an array of objects, each
          // object containing one of the key/val pairs of the
          // original `value` object
          return itemArr.concat(reduceArray(objectToArray(item).map(function (item) {
            return pipelineGenerator(item, op, path);
          })));
        }
        return itemArr.concat(reduceArray(pipelineGenerator(item, op, path)));
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
var queryToPipeline = exports.queryToPipeline = function queryToPipeline(query) {
  var currentGate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var parentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  if (!currentGate) {
    var queryKeyArr = Object.keys(query);

    // Check if we already have gate operations
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
    }

    // Implicit $and
    return $and(parentPath, objectToArray(query));
  }
  // ROB: When we call a gate operation we pass an empty path but it needs
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
      return genericOperation(path, parentPath, value, (0, _type.extendedType)(value));
    }

    // The path is not an operation so check if it is holding a recursive
    // value or not
    if (!valTypeData.isFlat) {
      // Wrap this in an $and
      if (currentGate !== "$and") {
        return $and((0, _path.join)(parentPath, path), objectToArray(value));
      }

      // Merge our current data with the parent data
      return objectToArray(value).map(function (item) {
        return queryToPipeline(item, currentGate, path);
      });
    }

    // The path is not an operation, the value is not recursive so
    // we have an implicit $eeq
    return genericOperation("$eeq", (0, _path.join)(parentPath, path), value, (0, _type.extendedType)(value));
  })[0];
};
var updateToPipeline = exports.updateToPipeline = function updateToPipeline(query) {
  var currentGate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var parentPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  if (!currentGate) {
    var queryKeyArr = Object.keys(query);

    // Check if we already have gate operations
    var gateKey = _match.gates.find(function (key) {
      return queryKeyArr.indexOf(key) > -1;
    });
    if (gateKey && queryKeyArr.length > 1) {
      // This is an error. A query can either be fully gated
      // or fully un-gated (implicit $updateReplaceMode) but not both
      throw new Error("An update cannot contain both gated and un-gated field properties!");
    }
    if (gateKey) {
      return operationLookup[gateKey](parentPath, query[gateKey]);
    }

    // Implicit $updateReplaceMode
    return $updateReplaceMode(parentPath, objectToArray(query));
  }
  return Object.entries(query).map(function (_ref6) {
    var _ref7 = (0, _slicedToArray2["default"])(_ref6, 2),
      path = _ref7[0],
      value = _ref7[1];
    var valTypeData = (0, _type.extendedType)(value);
    if (path.indexOf("$") === 0) {
      // This is an operation
      if (valTypeData.isFlat) {
        return genericOperation(path, parentPath, value, (0, _type.extendedType)(value));
      }

      // Break each path into a separate operation
      return Object.entries(value).map(function (_ref8) {
        var _ref9 = (0, _slicedToArray2["default"])(_ref8, 2),
          key = _ref9[0],
          item = _ref9[1];
        return genericOperation(path, key, item, (0, _type.extendedType)(item));
      });
    }

    // The path is not an operation so check if it is holding a recursive
    // value or not
    if (!valTypeData.isFlat) {
      // Wrap this in a $updateReplaceMode
      if (currentGate !== "$updateReplaceMode") {
        return $updateReplaceMode((0, _path.join)(parentPath, path), objectToArray(value));
      } else {
        // Merge our current data with the parent data
        return objectToArray(value).map(function (item) {
          return updateToPipeline(item, currentGate, path);
        });
      }
    }

    // The path is not an operation, the value is not recursive so
    // we have an implicit $replacePath
    return genericOperation("$replaceValue", (0, _path.join)(parentPath, path), value, (0, _type.extendedType)(value));
  })[0];
};

// Query gates
var $and = exports.$and = gateOperation("$and", queryToPipeline);
var $or = exports.$or = gateOperation("$or", queryToPipeline);

// Update gates
var $updateSetMode = exports.$updateSetMode = gateOperation("$updateSetMode", updateToPipeline);
var $updateReplaceMode = exports.$updateReplaceMode = gateOperation("$updateReplaceMode", updateToPipeline);
var operationLookup = exports.operationLookup = {
  // Query operations
  $and: $and,
  $or: $or,
  // Update operations
  $updateReplaceMode: $updateReplaceMode,
  $updateSetMode: $updateSetMode
};