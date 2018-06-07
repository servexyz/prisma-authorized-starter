require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql_yoga__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql_yoga___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql_yoga__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prisma_binding__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prisma_binding___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prisma_binding__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aws_sls_auther__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_aws_sls_auther___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_aws_sls_auther__);





//TODO: Create resolvers directory with lazy loading index / spread
const resolvers = {
  Query: {
    allRoutes: (parent, { type }, ctx, info) => {
      const where = type ? { type_contains: type } : {};
      return ctx.db.query.routes({ where }, info);
    },
    allPublicRoutes: (parent, args, ctx, info) => {
      const where = { public: true };
      return ctx.db.query.routes({ where }, info);
    },
    isJwtAuthorized: async (parent, { jwt }, ctx, info) => {
      let autho = await Object(__WEBPACK_IMPORTED_MODULE_2_aws_sls_auther__["isAuthorized"])(jwt);
      console.log(autho);
      return autho;
    }
  },
  Mutation: {
    //First, get user/pass. Note: aws-sls-auther will need to flex b/w online & offline
    auth: async (parent, { username, password }, ctx, info) => {
      //Grab token, which we will use in mutation
      let jwt = await Object(__WEBPACK_IMPORTED_MODULE_2_aws_sls_auther__["authenticate"])(username, password);

      //Define condition for querying all users with specific username
      //Username should be unique. Assumption I'm making here is username==email
      const whereUsername = username ? { username } : {};

      //Grab id field from all users which have username (hopefully only 1)
      let userId = await ctx.db.query.users({ where: whereUsername }, `{ id }`);

      //Update the first user ID with JWT
      //TODO: add checking here to ensure there's only one returned user IDA
      const where = { id: userId[0].id };
      console.log(`jwt: ${jwt}`);

      //Creating this variable for visual consistency. Not necessary.
      const data = { jwt };

      //Finally, we update our user with the JWT received earlier
      return ctx.db.mutation.updateUser({ where, data }, info);
    }
  }
};

//test working copy

//TODO: Replace all endpoints with env variables
const server = new __WEBPACK_IMPORTED_MODULE_0_graphql_yoga__["GraphQLServer"]({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => Object.assign({}, req, {
    db: new __WEBPACK_IMPORTED_MODULE_1_prisma_binding__["Prisma"]({
      typeDefs: "src/generated/prisma.graphql", // the auto-generated GraphQL schema of the Prisma API
      endpoint: "http://localhost:4466", // the endpoint of the Prisma API
      debug: true // log all GraphQL queries & mutations sent to the Prisma API
      // secret: process.env.PRISMA_SECRET // only needed if specified in `database/prisma.yml`
    })
  })
});

server.start(() => {
  process.env.AUTHER_ENDPOINT = "http://localhost:3000/api";
  console.log(`Prisma-starter running => http://localhost:4000`);
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("graphql-yoga");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("prisma-binding");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("aws-sls-auther");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map