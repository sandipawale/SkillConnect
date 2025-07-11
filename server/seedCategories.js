import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js'; // adjust the path if needed

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error", err));

const seed = async () => {
  try {
    const categories = [
      {
        name: "Web Development",
        description: "Learn to build modern, responsive websites and web applications."
      },
      {
        name: "Data Science",
        description: "Master data analysis, machine learning, and data visualization."
      },
      {
        name: "UI/UX Design",
        description: "Explore user interface and user experience design principles."
      },
      {
        name: "Cybersecurity",
        description: "Understand how to protect systems, networks, and data from cyber threats."
      },
      {
        name: "Mobile App Development",
        description: "Build apps for Android and iOS using modern tools and frameworks."
      }
    ];

    await Category.deleteMany(); // optional: clear existing categories
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding categories:", err);
    process.exit(1);
  }
};

seed();
