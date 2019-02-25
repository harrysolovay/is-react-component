"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isReactComponent;

var _cherow = require("cherow");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isReactCreateElementCall(node) {
  if (node.type === 'CallExpression') {
    var callee = node.callee;

    switch (callee.type) {
      case 'Identifier':
        return callee.name === 'createElement';

      case 'MemberExpression':
        return callee.property.name === 'createElement';

      default:
        return false;
    }
  }

  return false;
} // breadth-first


function traverse(node, callback) {
  if (!node) return;
  var queue = [node];

  while (queue.length !== 0) {
    var current = queue.pop();
    var shouldReturn = callback(current);
    if (shouldReturn) return true;

    if (_typeof(current) === 'object') {
      for (var i in current) {
        queue.unshift(current[i]);
      }
    }
  }

  return false;
}

var memo = new Map();

function isReactComponent(inQuestion) {
  var predicate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isReactCreateElementCall;

  if (typeof inQuestion === 'function') {
    if (inQuestion.prototype.isReactComponent) return true;
    var cached = memo.get(inQuestion);
    if (cached) return cached;
    var contents = inQuestion.toString();

    var _parseSource$body = _slicedToArray((0, _cherow.parseSource)(contents).body, 1),
        ast = _parseSource$body[0];

    var result = traverse(ast, predicate);
    memo.set(inQuestion, result);
    return result;
  }

  return false;
}
