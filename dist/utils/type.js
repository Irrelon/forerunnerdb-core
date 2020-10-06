"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendedType = exports.type = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/**
 * @typedef {String} TypeString A string describing a JavaScript primative type
 * limited to "undefined", "object", "boolean", "number", "string", "function",
 * "symbol", "null", "array", "unknown" and "bigint".
 */

/**
 * @typedef ExtendedTypeObject {Object}
 * @property {Boolean} isFlat Is true if the type is non-recursive. Instances
 * such as Date or RegExp are considered flat as they do not contain sub-object
 * data that is usefully recursive.
 * @property {TypeString} type The name of the type
 * @property {String} [instance] If the type is an object, this will be the name
 * of the constructor as reported by obj.constructor.name.
 */

/**
 * Returns the type from the item passed. Similar to JavaScript's
 * built-in typeof except it will distinguish between arrays, nulls
 * and objects as well.
 * @param {*} item The item to get the type of.
 * @returns {TypeString}
 */
var type = function type(item) {
  if (item === null) {
    return "null";
  }

  if (Array.isArray(item)) {
    return "array";
  }

  return (0, _typeof2["default"])(item);
};
/**
 * Returns extended information about the type from the item passed.
 * Similar to JavaScript's built-in typeof except it will distinguish
 * between arrays, nulls and objects as well.
 * @param {*} item The item to get the type of.
 * @returns {ExtendedTypeObject} The extended type information object.
 */


exports.type = type;

var extendedType = function extendedType(item) {
  var typeData = {
    "isFlat": false,
    "instance": "",
    "type": "foo"
  };

  if (item === null) {
    typeData.type = "null";
  } else if (Array.isArray(item)) {
    typeData.type = "array";
  } else {
    typeData.type = (0, _typeof2["default"])(item);

    if (typeData.type === "object") {
      typeData.instance = item.constructor.name;
    }
  }

  if (typeData.type === "string" || typeData.type === "number" || typeData.type === "null" || typeData.type === "boolean" || typeData.instance === "Date" || typeData.instance === "RegExp") {
    typeData.isFlat = true;
  }

  return typeData;
};

exports.extendedType = extendedType;