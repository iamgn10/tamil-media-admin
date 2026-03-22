"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("../app.config");
const path = __importStar(require("path"));
// Get seeder name from the command-line argument
const args = process.argv.slice(2);
const seederName = args[0];
if (!seederName) {
    console.error("⚠️ Please provide a seeder name. Example: npm run seed:specific RoleSeeder");
    process.exit(1);
}
console.log(`🌱 Running Seeder: ${seederName}`);
// Adjust seeders directory path
const seedersDir = path.join(__dirname, "../../seeders"); // Move up two levels
(async () => {
    var _a;
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(app_config_1.config.database.uri);
        console.log("✅ Connected to MongoDB");
        // Normalize seeder name: Ensure first letter is lowercase
        const normalizedSeederName = seederName.charAt(0).toLowerCase() + seederName.slice(1);
        // Construct the file path
        const seederPath = path.join(seedersDir, `${normalizedSeederName}.ts`);
        console.log(`📂 Looking for Seeder File: ${seederPath}`);
        // Dynamically import the seeder module
        const seederModule = await (_a = seederPath, Promise.resolve().then(() => __importStar(require(_a))));
        // Execute the up() function
        if (seederModule.up) {
            await seederModule.up();
            console.log(`✅ Seeder '${seederName}' executed successfully!`);
        }
        else {
            throw new Error(`Seeder '${seederName}' does not have an up() function.`);
        }
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error executing seeder:", error);
        process.exit(1);
    }
})();
