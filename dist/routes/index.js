"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = require("./v1/v1");
const router = (0, express_1.Router)();
const v1Router = (0, express_1.Router)();
(0, v1_1.getV1Routes)(v1Router); // All versioned routes are added to v1Router
router.use("/api/v1", v1Router); // Now /auth becomes /api/v1/auth
exports.default = router;
