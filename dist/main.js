"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
	"value": true
});
Object.defineProperty(exports, "Collection", {
	"enumerable": true,
	"get": function get () {
		return _Collection["default"];
	}
});
Object.defineProperty(exports, "find", {
	"enumerable": true,
	"get": function get () {
		return _find.find;
	}
});
Object.defineProperty(exports, "update", {
	"enumerable": true,
	"get": function get () {
		return _update.update;
	}
});
Object.defineProperty(exports, "queryToPipeline", {
	"enumerable": true,
	"get": function get () {
		return _build.queryToPipeline;
	}
});

var _Collection = _interopRequireDefault(require("./core/Collection"));

var _find = require("./core/operation/find");

var _update = require("./core/operation/update");

var _build = require("./core/operation/build");