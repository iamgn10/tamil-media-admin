"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getV1Routes = getV1Routes;
const auth_routes_1 = __importDefault(require("../auth.routes"));
const roles_routes_1 = __importDefault(require("../roles.routes"));
const user_routes_1 = __importDefault(require("../user.routes"));
const keyword_routes_1 = __importDefault(require("../keyword.routes"));
const advertiesment_routes_1 = __importDefault(require("../advertiesment.routes"));
const content_routes_1 = __importDefault(require("../content.routes"));
const dashboard_routes_1 = __importDefault(require("../dashboard.routes"));
const media_routes_1 = __importDefault(require("../media.routes"));
function getV1Routes(router) {
    // const router = Router();
    // Use Auth routes
    router.use('/auth', auth_routes_1.default);
    router.use('/user-role', roles_routes_1.default);
    router.use('/user', user_routes_1.default);
    router.use('/keyword', keyword_routes_1.default);
    router.use('/advertiesment', advertiesment_routes_1.default);
    router.use('/content', content_routes_1.default);
    router.use('/dashboard', dashboard_routes_1.default);
    router.use('/media', media_routes_1.default);
    //return router;
}
