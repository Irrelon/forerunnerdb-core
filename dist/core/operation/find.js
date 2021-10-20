"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.findDeep = exports.findOne = exports.find = void 0;

var _match = require("./match");

var _build = require("./build");

/**
 * Find searches for matching records in an array of data based on
 * the passed query.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @returns {Array} The array of data that matched the passed query.
 */
var find = function find(data, query) {
  // Break query into operations
  var pipeline = (0, _build.queryToPipeline)(query); // TODO: Loop each operation and check if an index (or multiple indexes) matches the path
  //  and then order indexes that do match by how much they match. Take the most-matching
  //  index and pull the data lookup from it rather than using the whole data array to do
  //  effectively a table scan

  /*if (false) {
  	data = index.find();
  }*/
  // Loop through each item of data and return a final filtered array

  return data.filter(function (item) {
    return (0, _match.matchPipeline)(pipeline, item, {
      "originalQuery": query
    });
  });
};

exports.find = find;

var findOne = function findOne(data, query) {
  // Break query into operations
  var pipeline = (0, _build.queryToPipeline)(query); // TODO: Currently only returns the first matching item but we need to take into
  //  account sorting first if a sort operator is specified (which we need to define
  //  since we haven't implemented sorting yet anyway)
  // Loop through each item of data and return the first matching item

  return data.find(function (item) {
    return (0, _match.matchPipeline)(pipeline, item, {
      "originalQuery": query
    });
  });
};
/**
 * Find searches for matching records in an array of data based on
 * the passed query. This function will traverse object hierarchies
 * to find matching data.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @returns {Array} The array of data that matched the passed query.
 */


exports.findOne = findOne;

var findDeep = function findDeep(data, query) {
  return [];
}; // TODO support calling explain that returns a query plan


exports.findDeep = findDeep;
var _default = find;
exports["default"] = _default;