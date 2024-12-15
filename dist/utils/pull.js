"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pull = void 0;
var pull = exports.pull = function pull(arr, itemToRemove) {
  return arr.reduce(function (newArr, arrItem) {
    if (itemToRemove === arrItem) return newArr;
    newArr.push(arrItem);
    return newArr;
  }, []);
};