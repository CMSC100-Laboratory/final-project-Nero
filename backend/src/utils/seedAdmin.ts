import User from "../models/userModel";
import bcrypt from "bcryptjs";
// this is to create the admin user in the database
export const seedAdmin = async () => {
  try {
    // check if any admin already exists in the database
    const adminExists = await User.findOne({ userType: "admin" });

    if (!adminExists) {
      // create a hashed password for the admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      // create the admin document
      await User.create({
        firstname: "Department",
        middlename: "of",
        lastname: "Agriculture",
        email: "admin@da.gov.ph",
        password: hashedPassword,
        userType: "admin",
      });

      console.log("Admin user seeded successfully! (admin@da.gov.ph / admin123)");
    } else {
      console.log("Admin user already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};
