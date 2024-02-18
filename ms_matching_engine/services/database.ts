import mongoose from 'mongoose';

type Env = {
  MONGO_URI?: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
const connectDB = async (customURI?: string): Promise<void> => {
  const mongoUri = customURI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("No mongo uri");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(mongoUri, { authSource: "admin" });
    console.log("Database connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;