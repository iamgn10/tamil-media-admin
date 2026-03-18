import * as fs from "fs/promises";
import * as path from "path";

// Get command-line arguments
const args = process.argv.slice(2);
const seederName = args[0];

if (!seederName) {
  console.error("⚠️ Please provide a seeder name. Example: npm run make:seeder SeederName");
  process.exit(1);
}

console.log(`🌱 Seeder Name: ${seederName}`);

// Paths
const seedersDir = path.join(process.cwd(), "src", "seeders");
const seederFileName = `${seederName.toLowerCase()}.seeder.ts`;
const seederFilePath = path.join(seedersDir, seederFileName);

// Seeder template
const seederTemplate = `
import mongoose from "mongoose";
import { ${seederName} } from "../models/${seederName.toLowerCase()}.model";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const demo${seederName}s = [
    {
        // Define your seeder data here
        title: "Sample ${seederName} 1",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Sample ${seederName} 2",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const up = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("✅ Connected to MongoDB");

        await ${seederName}.insertMany(demo${seederName}s);
        console.log("✅ Seeder data inserted into '${seederName.toLowerCase()}s' collection");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder execution failed:", error);
        process.exit(1);
    }
};

export const down = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log("✅ Connected to MongoDB");

        await ${seederName}.deleteMany({});
        console.log("✅ Cleared '${seederName.toLowerCase()}s' collection");

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to clear collection:", error);
        process.exit(1);
    }
};

if (require.main === module) {
    up();
}

// ======================= Developed by Sajith ===========================//
`;

// Create the seeder file
(async () => {
  try {
    // Ensure the seeders directory exists
    await fs.mkdir(seedersDir, { recursive: true });

    // Write the seeder file
    await fs.writeFile(seederFilePath, seederTemplate, "utf8");
    console.log(`✅ Seeder file created successfully: ${seederFilePath} `);
  } catch (err) {
    console.error("❌ Error creating seeder file:", err);
  }
})();
