import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model";
import { UserRoles } from "../enums/UserRoles.enum";

dotenv.config();



// ✅ Role Descriptions (you can adjust these as needed)
const roleDescriptions: Record<UserRoles, string> = {
  [UserRoles.Reporter]: "Handles article/report creation",
  [UserRoles.DesignerAdPublisher]: "Designs and publishes advertisements",
  [UserRoles.Updator]: "Updates content regularly",
  [UserRoles.Moderator]: "Moderates content and user submissions",
  [UserRoles.Editor]: "Edits and manages written content",
  [UserRoles.TechSeoAnalyst]: "Performs technical SEO and analytics",
  [UserRoles.Publisher]: "Manages content publishing workflows",
  [UserRoles.SiteAdmin]: "Manages site settings and user access",
  [UserRoles.SuperAdmin]: "Has full access and system privileges"
};

// ✅ Seeder Up
export const up = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    const roles = Object.values(UserRoles).map(role => ({
      role_name: role,
      description: roleDescriptions[role as UserRoles],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await Role.insertMany(roles);
    console.log("✅ Role seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Role seeding failed:", error);
    process.exit(1);
  }
};

// ✅ Seeder Down
export const down = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    const deleted = await Role.deleteMany({
      role_name: { $in: Object.values(UserRoles) }
    });

    console.log(`✅ Deleted ${deleted.deletedCount} roles from the database.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to delete roles:", error);
    process.exit(1);
  }
};

// ======================= Developed by Sajith ===========================//
