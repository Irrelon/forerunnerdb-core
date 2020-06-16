"use strict";

Object.defineProperty(exports, "__esModule", {
	"value": true
});
exports["default"] = exports.update = void 0;

var _path = require("@irrelon/path");

var _match = require("./match");

var _build = require("./build");

/**
 * Update searches for matching records in an array of data based on
 * the passed query.
 * @param {Array} data The array of data to query.
 * @param {Object} query A query object.
 * @param {Object} update The update object.
 * @param {Object} [options] An options object.
 * @returns {Array} The array of data that matched the passed query.
 */
var update = function update (data, query) {
	var update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	// Break query into operations
	var pipeline = (0, _build.queryToPipeline)(query);
	var updated = []; // Loop through each item of data and check if it matches the query

	for (var currentIndex = 0; currentIndex < data.length; currentIndex++) {
		var item = data[currentIndex];
		var matchResult = (0, _match.matchPipeline)(pipeline, item, {
			"originalQuery": query
		});
		if (!matchResult) continue; // We found a matching record, update it

		(0, _path.update)(item, update);
		updated.push(item);

		if (options.$one === true) {
			// Quit since we only wanted to update the first matching record ($one)
			break;
		}
	}

	return updated;
};

exports.update = update;
var _default = update;
exports["default"] = _default;