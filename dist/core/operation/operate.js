"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationLookup = exports.operatePipeline = exports.$updateReplaceMode = exports.$unset = exports.$shift = exports.$set = exports.$replaceValue = exports.$push = exports.$pullAll = exports.$pull = exports.$pop = exports.$inc = void 0;
var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _path = require("@irrelon/path");
var operatePipeline = exports.operatePipeline = function operatePipeline(pipeline, data) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalUpdate": {}
  };
  var opFunc = operationLookup[pipeline.op];
  if (!opFunc) {
    throw new Error("Unknown operation \"".concat(pipeline.op, "\""));
  }
  return opFunc(data, pipeline.value, {
    "originalUpdate": extraInfo.originalUpdate,
    "operation": pipeline
  });
};
var $updateReplaceMode = exports.$updateReplaceMode = function $updateReplaceMode(dataItem, opArr) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  // Run through each operation and return a completely replaced
  // data item based on data from the original
  return opArr.reduce(function (newDataItem, opData) {
    var opPath = opData.path;
    var opValue = opData.value;
    var opFunc = operationLookup[opData.op];
    if (!opFunc) {
      throw new Error("Unknown operation \"".concat(opData.op, "\""));
    }
    if (!opFunc.selfControlled) {
      var currentValue = (0, _path.get)(dataItem, opData.path, undefined, {
        "arrayTraversal": true
      });
      var newData = opFunc(currentValue, opValue, {
        "originalQuery": extraInfo.originalQuery,
        "operation": opData
      });
      newDataItem = (0, _path.setImmutable)(newDataItem, opPath, newData);
    } else {
      newDataItem = opFunc(newDataItem, opPath, opValue, {
        "originalQuery": extraInfo.originalQuery,
        "operation": opData
      });
    }
    if (!opFunc) {
      throw new Error("Unknown operation \"".concat(opData.op, "\" in operation ").concat(JSON.stringify(opData)));
    }
    return newDataItem;
  }, dataItem);
};
var normalise = function normalise(data) {
  // No normalisation currently needed - change this as required later - ROB
  return data;
};
var $inc = exports.$inc = function $inc(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return normalise(data) + normalise(value);
};
var $replaceValue = exports.$replaceValue = function $replaceValue(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return value;
};
var $push = exports.$push = function $push(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return [].concat((0, _toConsumableArray2["default"])(data), [value]);
};
var $pull = exports.$pull = function $pull(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var found = false;
  return data.reduce(function (newArr, item) {
    if (!found && (0, _path.match)(item, value)) {
      found = true;
    } else {
      newArr.push(item);
    }
    return newArr;
  }, []);
};
var $pullAll = exports.$pullAll = function $pullAll(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return data.reduce(function (newArr, item) {
    if (!(0, _path.match)(item, value)) {
      newArr.push(item);
    }
    return newArr;
  }, []);
};
var $pop = exports.$pop = function $pop(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return data.slice(0, data.length - 1);
};
var $shift = exports.$shift = function $shift(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _data = (0, _toArray2["default"])(data),
    newArr = _data.slice(1);
  return newArr;
};
var $set = exports.$set = function $set(newDataItem, opPath, opValue) {
  var extraInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _path.setImmutable)(newDataItem, opPath, opValue);
};
var $unset = exports.$unset = function $unset(newDataItem, opPath, opValue) {
  var extraInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _path.unSetImmutable)(newDataItem, opPath);
};
$set.selfControlled = true;
$unset.selfControlled = true;
var operationLookup = exports.operationLookup = {
  $replaceValue: $replaceValue,
  $updateReplaceMode: $updateReplaceMode,
  $inc: $inc,
  $push: $push,
  $pull: $pull,
  $pullAll: $pullAll,
  $pop: $pop,
  $shift: $shift,
  $set: $set,
  $unset: $unset
};

// TODO: Write
/*
$addToSet
$cast
$each
$inc - DONE
$move
$mul
$overwrite
$push - DONE
$pull - DONE
$pullAll - DONE
$pop - DONE
$shift - DONE
$rename
$replace
$splicePush
$splicePull
$toggle
$unset
Array Positional in Updates (.$)
 */