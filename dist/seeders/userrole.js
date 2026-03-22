"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const role_model_1 = __importDefault(require("../models/role.model"));
const UserRoles_enum_1 = require("../enums/UserRoles.enum");
dotenv_1.default.config();
// ✅ Role Descriptions (you can adjust these as needed)
const roleDescriptions = {
    [UserRoles_enum_1.UserRoles.Reporter]: "Handles article/report creation",
    [UserRoles_enum_1.UserRoles.DesignerAdPublisher]: "Designs and publishes advertisements",
    [UserRoles_enum_1.UserRoles.Updator]: "Updates content regularly",
    [UserRoles_enum_1.UserRoles.Moderator]: "Moderates content and user submissions",
    [UserRoles_enum_1.UserRoles.Editor]: "Edits and manages written content",
    [UserRoles_enum_1.UserRoles.TechSeoAnalyst]: "Performs technical SEO and analytics",
    [UserRoles_enum_1.UserRoles.Publisher]: "Manages content publishing workflows",
    [UserRoles_enum_1.UserRoles.SiteAdmin]: "Manages site settings and user access",
    [UserRoles_enum_1.UserRoles.SuperAdmin]: "Has full access and system privileges"
};
// ✅ Seeder Up
const up = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
        const roles = Object.values(UserRoles_enum_1.UserRoles).map(role => ({
            role_name: role,
            description: roleDescriptions[role],
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await role_model_1.default.insertMany(roles);
        console.log("✅ Role seeding completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Role seeding failed:", error);
        process.exit(1);
    }
};
exports.up = up;
// ✅ Seeder Down
const down = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
        const deleted = await role_model_1.default.deleteMany({
            role_name: { $in: Object.values(UserRoles_enum_1.UserRoles) }
        });
        console.log(`✅ Deleted ${deleted.deletedCount} roles from the database.`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Failed to delete roles:", error);
        process.exit(1);
    }
};
exports.down = down;
// ======================= Developed by Sajith ===========================//
