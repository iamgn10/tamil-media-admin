import mongoose from "mongoose";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model";
import Role from "../models/role.model";
import { UserRoles } from "../enums/UserRoles.enum";


dotenv.config();

export const up = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    // Fetch all roles from DB
    const roles = await Role.find();

    // Map each UserRoles enum to their ObjectId in DB
    const roleMap: Record<UserRoles, Types.ObjectId> = {} as Record<UserRoles, Types.ObjectId>;
    Object.values(UserRoles).forEach((role) => {
      const matched = roles.find((r) => r.role_name === role) as { _id: Types.ObjectId };
      if (!matched) throw new Error(`❌ Missing role in DB: ${role}`);
      roleMap[role as UserRoles] = matched._id;
    });

    // Hash passwords for each user
    const passwords = await Promise.all([
      bcrypt.hash("superadmin123", 10),
      bcrypt.hash("siteadmin123", 10),
      bcrypt.hash("publisher123", 10),
      bcrypt.hash("editor123", 10),
      bcrypt.hash("moderator123", 10),
      bcrypt.hash("updator123", 10),
      bcrypt.hash("designer123", 10),
      bcrypt.hash("reporter123", 10),
      bcrypt.hash("techseo123", 10),
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
        roleName: UserRoles.SuperAdmin,
        roleId: roleMap[UserRoles.SuperAdmin],
      },
      {
        fullname: "Site Admin",
        username: "siteadmin",
        email: "siteadmin@example.com",
        password: passwords[1],
        mobile: "0722222222",
        bio: "Manages the platform settings",
        roleName: UserRoles.SiteAdmin,
        roleId: roleMap[UserRoles.SiteAdmin],
      },
      {
        fullname: "Publisher",
        username: "publisher",
        email: "publisher@example.com",
        password: passwords[2],
        mobile: "0733333333",
        bio: "Responsible for publishing articles",
        roleName: UserRoles.Publisher,
        roleId: roleMap[UserRoles.Publisher],
      },
      {
        fullname: "Editor",
        username: "editor",
        email: "editor@example.com",
        password: passwords[3],
        mobile: "0744444444",
        bio: "Edits and reviews content",
        roleName: UserRoles.Editor,
        roleId: roleMap[UserRoles.Editor],
      },
      {
        fullname: "Moderator",
        username: "moderator",
        email: "moderator@example.com",
        password: passwords[4],
        mobile: "0755555555",
        bio: "Moderates submissions",
        roleName: UserRoles.Moderator,
        roleId: roleMap[UserRoles.Moderator],
      },
      {
        fullname: "Updator",
        username: "updator",
        email: "updator@example.com",
        password: passwords[5],
        mobile: "0766666666",
        bio: "Keeps content updated",
        roleName: UserRoles.Updator,
        roleId: roleMap[UserRoles.Updator],
      },
      {
        fullname: "Designer AD Publisher",
        username: "designerad",
        email: "designer@example.com",
        password: passwords[6],
        mobile: "0777777777",
        bio: "Designs and publishes ads",
        roleName: UserRoles.DesignerAdPublisher,
        roleId: roleMap[UserRoles.DesignerAdPublisher],
      },
      {
        fullname: "Reporter",
        username: "reporter",
        email: "reporter@example.com",
        password: passwords[7],
        mobile: "0788888888",
        bio: "Writes and submits reports",
        roleName: roleMap[UserRoles.Reporter],
        roleId: roleMap[UserRoles.Reporter],
      },
      {
        fullname: "Tech/SEO Analyst",
        username: "techseo",
        email: "techseo@example.com",
        password: passwords[8],
        mobile: "0799999999",
        bio: "Handles SEO analysis and audits",
        roleName: UserRoles.TechSeoAnalyst,
        roleId: roleMap[UserRoles.TechSeoAnalyst],
      },
    ];

    await User.insertMany(users);
    console.log("✅ User seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ User seeding failed:", error);
    process.exit(1);
  }
};

export const down = async () => {  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    // Make sure we are actually deleting existing users
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users from the database.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to delete users:", error);
    process.exit(1);
  }
};



// ======================= Developed by Sajith ===========================//
