"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationLookup = exports.$unset = exports.$shift = exports.$pop = exports.$pullAll = exports.$pull = exports.$push = exports.$replaceValue = exports.$inc = exports.$updateReplaceMode = exports.operatePipeline = void 0;

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _path = require("@irrelon/path");

var operatePipeline = function operatePipeline(pipeline, data) {
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

exports.operatePipeline = operatePipeline;

var $updateReplaceMode = function $updateReplaceMode(dataItem, opArr) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  // Run through each operation and return a completely replaced
  // data item based on data from the original
  return opArr.reduce(function (newDataItem, opData) {
    var opPath = opData.path;
    var opValue = opData.value;
    var opFunc = operationLookup[opData.op];

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

exports.$updateReplaceMode = $updateReplaceMode;

var normalise = function normalise(data) {
  // No normalisation currently needed - change this as required later - ROB
  return data;
};

var $inc = function $inc(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return normalise(data) + normalise(value);
};

exports.$inc = $inc;

var $replaceValue = function $replaceValue(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return value;
};

exports.$replaceValue = $replaceValue;

var $push = function $push(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return [].concat((0, _toConsumableArray2["default"])(data), [value]);
};

exports.$push = $push;

var $pull = function $pull(data, value) {
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

exports.$pull = $pull;

var $pullAll = function $pullAll(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return data.reduce(function (newArr, item) {
    if (!(0, _path.match)(item, value)) {
      newArr.push(item);
    }

    return newArr;
  }, []);
};

exports.$pullAll = $pullAll;

var $pop = function $pop(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return data.slice(0, data.length - 1);
};

exports.$pop = $pop;

var $shift = function $shift(data, value) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _data = (0, _toArray2["default"])(data),
      newArr = _data.slice(1);

  return newArr;
};

exports.$shift = $shift;

var $unset = function $unset(newDataItem, opPath, opValue) {
  var extraInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return (0, _path.unSetImmutable)(newDataItem, opPath);
};

exports.$unset = $unset;
$unset.selfControlled = true;
var operationLookup = {
  $replaceValue: $replaceValue,
  $updateReplaceMode: $updateReplaceMode,
  $inc: $inc,
  $push: $push,
  $pull: $pull,
  $pullAll: $pullAll,
  $pop: $pop,
  $shift: $shift,
  $unset: $unset
}; // TODO: Write

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

exports.operationLookup = operationLookup;