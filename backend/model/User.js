import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// ----------------------
// User Schema Definition
// ----------------------
// - name: Full name of the user (required, trimmed of whitespace)
// - email: Unique email (used as username for login), always stored lowercase
// - phoneNumber: Contact number of the user (required)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true },
});

// ----------------------
// Passport-Local-Mongoose Plugin
// ----------------------
// - Automatically adds username, hash, salt fields to schema
// - Handles password hashing and authentication logic
// - Using "email" as the username field instead of default "username"
// - Custom error message if email already exists
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessages: {
    UserExistsError: "A user with the given email is already registered.",
  },
});

// ----------------------
// Model Export
// ----------------------
// Creates the "User" model based on schema
// This will map to "users" collection in MongoDB
const User = mongoose.model('User', userSchema);

export default User;
