"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationLookup = exports.$count = exports.$distinct = exports.$fastNin = exports.$fastIn = exports.$nin = exports.$in = exports.$nee = exports.$ne = exports.$eeq = exports.$eq = exports.$exists = exports.$lte = exports.$lt = exports.$gte = exports.$gt = exports.$or = exports.$not = exports.$and = exports.matchPipeline = exports.gates = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _path = require("@irrelon/path");

var _this = void 0;

var gates = ["$and", "$or", "$not", "$nor"];
exports.gates = gates;

var matchPipeline = function matchPipeline(pipeline, data) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  var opFunc = operationLookup[pipeline.op];

  if (!opFunc) {
    throw new Error("Unknown operation \"".concat(pipeline.op, "\""));
  }

  return opFunc(data, pipeline.value, {
    "originalQuery": extraInfo.originalQuery,
    "operation": pipeline
  });
};

exports.matchPipeline = matchPipeline;

var $and = function $and(dataItem, opArr) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  // Match true on ALL operations to pass, if any are
  // returned then we have found a NON MATCHING entity
  return opArr.every(function (opData) {
    var dataValue;
    var opValue;
    var opFunc;

    if (gates.indexOf(opData.op) > -1) {
      // The operation is a gate
      return operationLookup[opData.op](dataItem, opData.value, extraInfo);
    }

    dataValue = (0, _path.get)(dataItem, opData.path, undefined, {
      "arrayTraversal": true
    });
    opFunc = operationLookup[opData.op];
    opValue = opData.value;

    if (!opFunc) {
      throw new Error("Unknown operation \"".concat(opData.op, "\" in operation ").concat(JSON.stringify(opData)));
    }

    return opFunc(dataValue, opValue, {
      "originalQuery": extraInfo.originalQuery,
      "operation": opData
    });
  });
};

exports.$and = $and;

var $not = function $not(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  // Not operator
  return !$and(data, query, extraInfo);
};

exports.$not = $not;

var $or = function $or(dataItem, opArr) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": {}
  };
  // Match true on ANY operations to pass, if any are
  // returned then we have found a NON MATCHING entity
  return opArr.some(function (opData) {
    var dataValue;
    var opValue;
    var opFunc;

    if (gates.indexOf(opData.op) > -1) {
      // The operation is a gate
      return operationLookup[opData.op](dataItem, opData.value, extraInfo);
    }

    dataValue = (0, _path.get)(dataItem, opData.path, undefined, {
      "arrayTraversal": true
    });
    opFunc = operationLookup[opData.op];
    opValue = opData.value;

    if (!opFunc) {
      throw new Error("Unknown operation \"".concat(opData.op, "\""));
    }

    return opFunc(dataValue, opValue, {
      "originalQuery": extraInfo.originalQuery,
      "operation": opData
    });
  });
};

exports.$or = $or;

var normalise = function normalise(data) {
  if (data instanceof Date) {
    return data.toISOString();
  }

  return data;
};

var $gt = function $gt(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Greater than
  return normalise(data) > normalise(query);
};

exports.$gt = $gt;

var $gte = function $gte(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Greater than or equal
  return normalise(data) >= normalise(query);
};

exports.$gte = $gte;

var $lt = function $lt(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Less than
  return normalise(data) < normalise(query);
};

exports.$lt = $lt;

var $lte = function $lte(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Less than or equal
  return normalise(data) <= normalise(query);
};

exports.$lte = $lte;

var $exists = function $exists(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Property exists
  return data === undefined !== normalise(query);
};

exports.$exists = $exists;

var $eq = function $eq(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Equals
  return normalise(data) == normalise(query); // jshint ignore:line
};

exports.$eq = $eq;

var $eeq = function $eeq(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Equals equals
  return normalise(data) === normalise(query);
};

exports.$eeq = $eeq;

var $ne = function $ne(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Not equals
  return normalise(data) != normalise(query); // eslint ignore:line
}; // Not equals equals


exports.$ne = $ne;

var $nee = function $nee(data, query) {
  var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return normalise(data) !== normalise(query);
};

exports.$nee = $nee;

var $in = function $in(data, query) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": undefined,
    "operation": undefined
  },
      originalQuery = _ref.originalQuery,
      operation = _ref.operation;

  // Check that the in query is an array
  if (Array.isArray(query)) {
    var inArr = query,
        inArrCount = inArr.length,
        inArrIndex;

    for (inArrIndex = 0; inArrIndex < inArrCount; inArrIndex++) {
      if ($eeq(data, inArr[inArrIndex], {
        originalQuery: originalQuery,
        operation: operation
      })) {
        return true;
      }
    }

    return false;
  }

  console.log("Cannot use an $in operator on non-array data in query ".concat(JSON.stringify(originalQuery)));
  return false;
};

exports.$in = $in;

var $nin = function $nin(data, query) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": undefined,
    "operation": undefined
  },
      originalQuery = _ref2.originalQuery,
      operation = _ref2.operation;

  // Check that the in query is an array
  if (Array.isArray(query)) {
    var inArr = query,
        inArrCount = inArr.length,
        inArrIndex;

    for (inArrIndex = 0; inArrIndex < inArrCount; inArrIndex++) {
      if ($eeq(data, inArr[inArrIndex], {
        originalQuery: originalQuery,
        operation: operation
      })) {
        return false;
      }
    }

    return true;
  }

  console.log("Cannot use an $in operator on non-array data in query ".concat(JSON.stringify(originalQuery)));
  return false;
};

exports.$nin = $nin;

var $fastIn = function $fastIn(data, query) {
  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": undefined,
    "operation": undefined
  },
      originalQuery = _ref3.originalQuery,
      operation = _ref3.operation;

  if (query instanceof Array) {
    // Data is a string or number, use indexOf to identify match in array
    return query.indexOf(data) !== -1;
  }

  console.log("Cannot use an $in operator on non-array data in query ".concat(JSON.stringify(originalQuery)));
  return false;
};

exports.$fastIn = $fastIn;

var $fastNin = function $fastNin(data, query) {
  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    "originalQuery": undefined,
    "operation": undefined
  },
      originalQuery = _ref4.originalQuery,
      operation = _ref4.operation;

  if (query instanceof Array) {
    // Data is a string or number, use indexOf to identify match in array
    return query.indexOf(data) === -1;
  }

  console.log("Cannot use an $in operator on non-array data in query ".concat(JSON.stringify(originalQuery)));
  return false;
};

exports.$fastNin = $fastNin;

var $distinct = function $distinct(data, query) {
  var lookupPath, value, finalDistinctProp; // Ensure options holds a distinct lookup

  options.$rootData["//distinctLookup"] = options.$rootData["//distinctLookup"] || {};

  for (var distinctProp in query) {
    if (query.hasOwnProperty(distinctProp)) {
      if ((0, _typeof2["default"])(query[distinctProp]) === "object") {
        // Get the path string from the object
        lookupPath = _this.sharedPathSolver.parse(query)[0].path; // Use the path string to find the lookup value from the data data

        value = _this.sharedPathSolver.get(data, lookupPath);
        finalDistinctProp = lookupPath;
      } else {
        value = data[distinctProp];
        finalDistinctProp = distinctProp;
      }

      options.$rootData["//distinctLookup"][finalDistinctProp] = options.$rootData["//distinctLookup"][finalDistinctProp] || {}; // Check if the options distinct lookup has this field's value

      if (options.$rootData["//distinctLookup"][finalDistinctProp][value]) {
        // Value is already in use
        return false;
      } else {
        // Set the value in the lookup
        options.$rootData["//distinctLookup"][finalDistinctProp][value] = true; // Allow the item in the results

        return true;
      }
    }
  }
};

exports.$distinct = $distinct;

var $count = function $count(data, query) {
  var countKey, countArr, countVal; // Iterate the count object's keys

  for (countKey in query) {
    if (query.hasOwnProperty(countKey)) {
      // Check the property exists and is an array. If the property being counted is not
      // an array (or doesn't exist) then use a value of zero in any further count logic
      countArr = data[countKey];

      if ((0, _typeof2["default"])(countArr) === "object" && countArr instanceof Array) {
        countVal = countArr.length;
      } else {
        countVal = 0;
      } // Now recurse down the query chain further to satisfy the query for this key (countKey)


      if (!_this._match(countVal, query[countKey], queryOptions, "and", options)) {
        return false;
      }
    }
  } // Allow the item in the results


  return true;
};

exports.$count = $count;
var operationLookup = {
  $eq: $eq,
  $eeq: $eeq,
  $ne: $ne,
  $nee: $nee,
  $gt: $gt,
  $gte: $gte,
  $lt: $lt,
  $lte: $lte,
  $and: $and,
  $or: $or,
  $in: $in,
  $nin: $nin,
  $fastIn: $fastIn,
  $fastNin: $fastNin
};
exports.operationLookup = operationLookup;