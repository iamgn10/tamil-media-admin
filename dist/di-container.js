"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const userRole_service_1 = require("./services/userRole.service");
const userRole_controller_1 = require("./controllers/userRole.controller");
const user_service_1 = require("./services/user.service");
const user_controller_1 = require("./controllers/user.controller");
// Register classes with the container
tsyringe_1.container.registerSingleton(auth_service_1.AuthService);
tsyringe_1.container.registerSingleton(auth_controller_1.default, auth_controller_1.default);
tsyringe_1.container.registerSingleton(userRole_service_1.UserRoleService);
tsyringe_1.container.registerSingleton(userRole_controller_1.UserRoleController, userRole_controller_1.UserRoleController);
tsyringe_1.container.registerSingleton(user_service_1.UserService);
tsyringe_1.container.registerSingleton(user_controller_1.UserController, user_controller_1.UserController);
