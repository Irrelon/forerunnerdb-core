"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnum = void 0;
/**
 * Creates an enum.
 * @param {Object|Array<String>} objOrArr An object or array of strings to
 * make an enum from.
 * @returns {*} A function that also has the enum keys assigned to it.
 */
var createEnum = exports.createEnum = function createEnum(objOrArr) {
  var keysByValue = new Map();
  var EnumLookup = function EnumLookup(value) {
    return keysByValue.get(value);
  };
  var obj = objOrArr;
  if (Array.isArray(objOrArr)) {
    obj = objOrArr.reduce(function (newObj, item, index) {
      newObj[item] = index;
      return newObj;
    }, {});
  }
  for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    EnumLookup[key] = obj[key];
    keysByValue.set(EnumLookup[key], key);
  }

  // Return a function with all your enum properties attached.
  // Calling the function with the value will return the key.
  return Object.freeze(EnumLookup);
};