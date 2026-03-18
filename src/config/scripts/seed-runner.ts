import mongoose from "mongoose";
import { config } from "../app.config";
import * as path from "path";

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
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.uri);
    console.log("✅ Connected to MongoDB");

    // Normalize seeder name: Ensure first letter is lowercase
    const normalizedSeederName = seederName.charAt(0).toLowerCase() + seederName.slice(1);

    // Construct the file path
    const seederPath = path.join(seedersDir, `${normalizedSeederName}.ts`);

    console.log(`📂 Looking for Seeder File: ${seederPath}`);

    // Dynamically import the seeder module
    const seederModule = await import(seederPath);

    // Execute the up() function
    if (seederModule.up) {
      await seederModule.up();
      console.log(`✅ Seeder '${seederName}' executed successfully!`);
    } else {
      throw new Error(`Seeder '${seederName}' does not have an up() function.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error executing seeder:", error);
    process.exit(1);
  }
})();
