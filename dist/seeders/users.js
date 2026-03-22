"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const UserRoles_enum_1 = require("../enums/UserRoles.enum");
dotenv_1.default.config();
const up = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
        // Fetch all roles from DB
        const roles = await role_model_1.default.find();
        // Map each UserRoles enum to their ObjectId in DB
        const roleMap = {};
        Object.values(UserRoles_enum_1.UserRoles).forEach((role) => {
            const matched = roles.find((r) => r.role_name === role);
            if (!matched)
                throw new Error(`❌ Missing role in DB: ${role}`);
            roleMap[role] = matched._id;
        });
        // Hash passwords for each user
        const passwords = await Promise.all([
            bcryptjs_1.default.hash("superadmin123", 10),
            bcryptjs_1.default.hash("siteadmin123", 10),
            bcryptjs_1.default.hash("publisher123", 10),
            bcryptjs_1.default.hash("editor123", 10),
            bcryptjs_1.default.hash("moderator123", 10),
            bcryptjs_1.default.hash("updator123", 10),
            bcryptjs_1.default.hash("designer123", 10),
            bcryptjs_1.default.hash("reporter123", 10),
            bcryptjs_1.default.hash("techseo123", 10),
        ]);
        // Seed users
        const users = [
            {
                fullname: "Super Admin",
                username: "superadmin",
                email: "superadmin@example.com",
                password: passwords[0],
                mobile: "0711111111",
                bio: "System level administrator",
                roleName: UserRoles_enum_1.UserRoles.SuperAdmin,
                roleId: roleMap[UserRoles_enum_1.UserRoles.SuperAdmin],
            },
            {
                fullname: "Site Admin",
                username: "siteadmin",
                email: "siteadmin@example.com",
                password: passwords[1],
                mobile: "0722222222",
                bio: "Manages the platform settings",
                roleName: UserRoles_enum_1.UserRoles.SiteAdmin,
                roleId: roleMap[UserRoles_enum_1.UserRoles.SiteAdmin],
            },
            {
                fullname: "Publisher",
                username: "publisher",
                email: "publisher@example.com",
                password: passwords[2],
                mobile: "0733333333",
                bio: "Responsible for publishing articles",
                roleName: UserRoles_enum_1.UserRoles.Publisher,
                roleId: roleMap[UserRoles_enum_1.UserRoles.Publisher],
            },
            {
                fullname: "Editor",
                username: "editor",
                email: "editor@example.com",
                password: passwords[3],
                mobile: "0744444444",
                bio: "Edits and reviews content",
                roleName: UserRoles_enum_1.UserRoles.Editor,
                roleId: roleMap[UserRoles_enum_1.UserRoles.Editor],
            },
            {
                fullname: "Moderator",
                username: "moderator",
                email: "moderator@example.com",
                password: passwords[4],
                mobile: "0755555555",
                bio: "Moderates submissions",
                roleName: UserRoles_enum_1.UserRoles.Moderator,
                roleId: roleMap[UserRoles_enum_1.UserRoles.Moderator],
            },
            {
                fullname: "Updator",
                username: "updator",
                email: "updator@example.com",
                password: passwords[5],
                mobile: "0766666666",
                bio: "Keeps content updated",
                roleName: UserRoles_enum_1.UserRoles.Updator,
                roleId: roleMap[UserRoles_enum_1.UserRoles.Updator],
            },
            {
                fullname: "Designer AD Publisher",
                username: "designerad",
                email: "designer@example.com",
                password: passwords[6],
                mobile: "0777777777",
                bio: "Designs and publishes ads",
                roleName: UserRoles_enum_1.UserRoles.DesignerAdPublisher,
                roleId: roleMap[UserRoles_enum_1.UserRoles.DesignerAdPublisher],
            },
            {
                fullname: "Reporter",
                username: "reporter",
                email: "reporter@example.com",
                password: passwords[7],
                mobile: "0788888888",
                bio: "Writes and submits reports",
                roleName: roleMap[UserRoles_enum_1.UserRoles.Reporter],
                roleId: roleMap[UserRoles_enum_1.UserRoles.Reporter],
            },
            {
                fullname: "Tech/SEO Analyst",
                username: "techseo",
                email: "techseo@example.com",
                password: passwords[8],
                mobile: "0799999999",
                bio: "Handles SEO analysis and audits",
                roleName: UserRoles_enum_1.UserRoles.TechSeoAnalyst,
                roleId: roleMap[UserRoles_enum_1.UserRoles.TechSeoAnalyst],
            },
        ];
        await user_model_1.default.insertMany(users);
        console.log("✅ User seeding completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ User seeding failed:", error);
        process.exit(1);
    }
};
exports.up = up;
const down = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
        // Make sure we are actually deleting existing users
        const deleteResult = await user_model_1.default.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} users from the database.`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Failed to delete users:", error);
        process.exit(1);
    }
};
exports.down = down;
// ======================= Developed by Sajith ===========================//
