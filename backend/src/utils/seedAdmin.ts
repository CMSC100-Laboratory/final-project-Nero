import User from "../models/userModel";
import bcrypt from "bcryptjs";
// this is to create the admin user in the database
export const seedAdmin = async () => {
  try {
    // check if any admin already exists in the database
    const adminExists = await User.findOne({ userType: "admin" });

    if (!adminExists) {
      const adminEmail = process.env.ADMIN_SEED_EMAIL;
      const adminPassword = process.env.ADMIN_SEED_PASSWORD;

      if (!adminEmail || !adminPassword) {
        console.warn(
          "ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set to seed the admin user. Skipping."
        );
        return;
      }

      // create a hashed password for the admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // create the admin document
      await User.create({
        firstname: "Department",
        middlename: "of",
        lastname: "Agriculture",
        email: adminEmail,
        password: hashedPassword,
        userType: "admin",
      });

      console.log("Admin user seeded successfully!");
    } else {
      console.log("Admin user already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
