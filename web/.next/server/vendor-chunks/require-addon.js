/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/require-addon";
exports.ids = ["vendor-chunks/require-addon"];
exports.modules = {

/***/ "(ssr)/./node_modules/require-addon/index.js":
/*!*********************************************!*\
  !*** ./node_modules/require-addon/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const runtime = __webpack_require__(/*! ./lib/runtime */ \"(ssr)/./node_modules/require-addon/lib/runtime.js\")\n\nif (runtime === 'bare') {\n  module.exports = __webpack_require__(/*! ./lib/runtime/bare */ \"(ssr)/./node_modules/require-addon/lib/runtime/bare.js\")\n} else if (runtime === 'node') {\n  module.exports = __webpack_require__(/*! ./lib/runtime/node */ \"(ssr)/./node_modules/require-addon/lib/runtime/node.js\")\n} else {\n  module.exports = __webpack_require__(/*! ./lib/runtime/default */ \"(ssr)/./node_modules/require-addon/lib/runtime/default.js\")\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVxdWlyZS1hZGRvbi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0IsbUJBQU8sQ0FBQyx3RUFBZTs7QUFFdkM7QUFDQSxFQUFFLHdIQUE4QztBQUNoRCxFQUFFO0FBQ0YsRUFBRSx3SEFBOEM7QUFDaEQsRUFBRTtBQUNGLEVBQUUsOEhBQWlEO0FBQ25EIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFVTVUFSSU9cXERvY3VtZW50c1xcR2l0aHViXFxHYWxheHlLSi13YWxsZXQtLS1IYWNrXFx3ZWJcXG5vZGVfbW9kdWxlc1xccmVxdWlyZS1hZGRvblxcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcnVudGltZSA9IHJlcXVpcmUoJy4vbGliL3J1bnRpbWUnKVxuXG5pZiAocnVudGltZSA9PT0gJ2JhcmUnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvcnVudGltZS9iYXJlJylcbn0gZWxzZSBpZiAocnVudGltZSA9PT0gJ25vZGUnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvcnVudGltZS9ub2RlJylcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvcnVudGltZS9kZWZhdWx0Jylcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/require-addon/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/require-addon/lib/runtime.js":
/*!***************************************************!*\
  !*** ./node_modules/require-addon/lib/runtime.js ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports =\n  typeof Bare !== 'undefined'\n    ? 'bare'\n    : typeof process !== 'undefined'\n      ? 'node'\n      : 'unknown'\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVxdWlyZS1hZGRvbi9saWIvcnVudGltZS5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVVNVQVJJT1xcRG9jdW1lbnRzXFxHaXRodWJcXEdhbGF4eUtKLXdhbGxldC0tLUhhY2tcXHdlYlxcbm9kZV9tb2R1bGVzXFxyZXF1aXJlLWFkZG9uXFxsaWJcXHJ1bnRpbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB0eXBlb2YgQmFyZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/ICdiYXJlJ1xuICAgIDogdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnXG4gICAgICA/ICdub2RlJ1xuICAgICAgOiAndW5rbm93bidcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/require-addon/lib/runtime.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/require-addon/lib/runtime/bare.js":
/*!********************************************************!*\
  !*** ./node_modules/require-addon/lib/runtime/bare.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\").addon.bind(__webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\"))\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVxdWlyZS1hZGRvbi9saWIvcnVudGltZS9iYXJlLmpzIiwibWFwcGluZ3MiOiJBQUFBLGlCQUFpQixvRkFBTyxZQUFZLG9GQUFPIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXFVTVUFSSU9cXERvY3VtZW50c1xcR2l0aHViXFxHYWxheHlLSi13YWxsZXQtLS1IYWNrXFx3ZWJcXG5vZGVfbW9kdWxlc1xccmVxdWlyZS1hZGRvblxcbGliXFxydW50aW1lXFxiYXJlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZS5hZGRvbi5iaW5kKHJlcXVpcmUpXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/require-addon/lib/runtime/bare.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/require-addon/lib/runtime/default.js":
/*!***********************************************************!*\
  !*** ./node_modules/require-addon/lib/runtime/default.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("if (typeof __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\").addon === 'function') {\n  module.exports = __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\").addon.bind(__webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\"))\n} else {\n  module.exports = function addon(specifier, parentURL) {\n    throw new Error(\n      `Cannot find addon '${specifier}' imported from '${parentURL}'`\n    )\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVxdWlyZS1hZGRvbi9saWIvcnVudGltZS9kZWZhdWx0LmpzIiwibWFwcGluZ3MiOiJBQUFBLFdBQVcsb0ZBQU87QUFDbEIsbUJBQW1CLG9GQUFPLFlBQVksb0ZBQU87QUFDN0MsRUFBRTtBQUNGO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVSxtQkFBbUIsVUFBVTtBQUNuRTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVVNVQVJJT1xcRG9jdW1lbnRzXFxHaXRodWJcXEdhbGF4eUtKLXdhbGxldC0tLUhhY2tcXHdlYlxcbm9kZV9tb2R1bGVzXFxyZXF1aXJlLWFkZG9uXFxsaWJcXHJ1bnRpbWVcXGRlZmF1bHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaWYgKHR5cGVvZiByZXF1aXJlLmFkZG9uID09PSAnZnVuY3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZS5hZGRvbi5iaW5kKHJlcXVpcmUpXG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFkZG9uKHNwZWNpZmllciwgcGFyZW50VVJMKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYENhbm5vdCBmaW5kIGFkZG9uICcke3NwZWNpZmllcn0nIGltcG9ydGVkIGZyb20gJyR7cGFyZW50VVJMfSdgXG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/require-addon/lib/runtime/default.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/require-addon/lib/runtime/node.js":
/*!********************************************************!*\
  !*** ./node_modules/require-addon/lib/runtime/node.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("if (typeof __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\").addon === 'function') {\n  module.exports = __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\").addon.bind(__webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\"))\n} else {\n  const url = __webpack_require__(/*! url */ \"url\")\n  const resolve = __webpack_require__(/*! bare-addon-resolve */ \"(ssr)/./node_modules/bare-addon-resolve/index.js\")\n\n  const host = process.platform + '-' + process.arch\n  const conditions = ['node', process.platform, process.arch]\n  const extensions = ['.node']\n\n  module.exports = function addon(specifier, parentURL) {\n    if (typeof parentURL === 'string') parentURL = url.pathToFileURL(parentURL)\n\n    for (const resolution of resolve(\n      specifier,\n      parentURL,\n      { host, conditions, extensions },\n      readPackage\n    )) {\n      switch (resolution.protocol) {\n        case 'file:':\n          try {\n            return __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\")(url.fileURLToPath(resolution))\n          } catch {\n            continue\n          }\n      }\n    }\n\n    throw new Error(\n      `Cannot find addon '${specifier}' imported from '${parentURL.href}'`\n    )\n\n    function readPackage(packageURL) {\n      try {\n        return __webpack_require__(\"(ssr)/./node_modules/require-addon/lib/runtime sync recursive\")(url.fileURLToPath(packageURL))\n      } catch (err) {\n        return null\n      }\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVxdWlyZS1hZGRvbi9saWIvcnVudGltZS9ub2RlLmpzIiwibWFwcGluZ3MiOiJBQUFBLFdBQVcsb0ZBQU87QUFDbEIsbUJBQW1CLG9GQUFPLFlBQVksb0ZBQU87QUFDN0MsRUFBRTtBQUNGLGNBQWMsbUJBQU8sQ0FBQyxnQkFBSztBQUMzQixrQkFBa0IsbUJBQU8sQ0FBQyw0RUFBb0I7O0FBRTlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsOEJBQThCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUZBQVEsNkJBQTZCLENBQUM7QUFDekQsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCLFVBQVUsbUJBQW1CLGVBQWU7QUFDeEU7O0FBRUE7QUFDQTtBQUNBLGVBQWUscUZBQVEsNkJBQTZCLENBQUM7QUFDckQsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcVVNVQVJJT1xcRG9jdW1lbnRzXFxHaXRodWJcXEdhbGF4eUtKLXdhbGxldC0tLUhhY2tcXHdlYlxcbm9kZV9tb2R1bGVzXFxyZXF1aXJlLWFkZG9uXFxsaWJcXHJ1bnRpbWVcXG5vZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaWYgKHR5cGVvZiByZXF1aXJlLmFkZG9uID09PSAnZnVuY3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZS5hZGRvbi5iaW5kKHJlcXVpcmUpXG59IGVsc2Uge1xuICBjb25zdCB1cmwgPSByZXF1aXJlKCd1cmwnKVxuICBjb25zdCByZXNvbHZlID0gcmVxdWlyZSgnYmFyZS1hZGRvbi1yZXNvbHZlJylcblxuICBjb25zdCBob3N0ID0gcHJvY2Vzcy5wbGF0Zm9ybSArICctJyArIHByb2Nlc3MuYXJjaFxuICBjb25zdCBjb25kaXRpb25zID0gWydub2RlJywgcHJvY2Vzcy5wbGF0Zm9ybSwgcHJvY2Vzcy5hcmNoXVxuICBjb25zdCBleHRlbnNpb25zID0gWycubm9kZSddXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRvbihzcGVjaWZpZXIsIHBhcmVudFVSTCkge1xuICAgIGlmICh0eXBlb2YgcGFyZW50VVJMID09PSAnc3RyaW5nJykgcGFyZW50VVJMID0gdXJsLnBhdGhUb0ZpbGVVUkwocGFyZW50VVJMKVxuXG4gICAgZm9yIChjb25zdCByZXNvbHV0aW9uIG9mIHJlc29sdmUoXG4gICAgICBzcGVjaWZpZXIsXG4gICAgICBwYXJlbnRVUkwsXG4gICAgICB7IGhvc3QsIGNvbmRpdGlvbnMsIGV4dGVuc2lvbnMgfSxcbiAgICAgIHJlYWRQYWNrYWdlXG4gICAgKSkge1xuICAgICAgc3dpdGNoIChyZXNvbHV0aW9uLnByb3RvY29sKSB7XG4gICAgICAgIGNhc2UgJ2ZpbGU6JzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUodXJsLmZpbGVVUkxUb1BhdGgocmVzb2x1dGlvbikpXG4gICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQ2Fubm90IGZpbmQgYWRkb24gJyR7c3BlY2lmaWVyfScgaW1wb3J0ZWQgZnJvbSAnJHtwYXJlbnRVUkwuaHJlZn0nYFxuICAgIClcblxuICAgIGZ1bmN0aW9uIHJlYWRQYWNrYWdlKHBhY2thZ2VVUkwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKHVybC5maWxlVVJMVG9QYXRoKHBhY2thZ2VVUkwpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/require-addon/lib/runtime/node.js\n");

/***/ })

};
;