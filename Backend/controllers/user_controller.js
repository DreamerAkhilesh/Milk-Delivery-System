import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user_model.js";
import OTP from "../models/otp_model.js"; // OTP Model
import otpGenerator from "otp-generator";
import { sendOTPEmail } from "../utils/mail.js"; // Import mail function


export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Set OTP expiration time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60000);

    // Save OTP in the database (overwrite if exists)
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt },
      { upsert: true }
    );

    // Send OTP via email using `mail.js`
    await sendOTPEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber, address, otp } = req.body ;

//     // Check if OTP is correct
//     const otpRecord = await OTP.findOne({ email });
//     if(otpRecord) { 
//       console.log("OTP Record Found:", otpRecord.otp); // Debugging
//     }
//     if (!otpRecord) {
//       return res.status(400).json({ message: "OTP not found or expired" });
//     }
//     // Validate required fields
//     if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
//       return res.status(400).json({ message: `Invalid or expired OTP`});
//     }

//     // Delete OTP after successful verification
//     await OTP.deleteOne({ email });

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profile: { phoneNumber, address: address || null },
//       wallet: { balance: 0 },
//     });

//     await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: { id: newUser._id, name: newUser.name, email: newUser.email },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error });
//   }
// };

export const registerUser = async (req, res) => {
  try {
    console.log("🔹 Incoming Request Data:", req.body); // Log full request body

    const { name, email, password, phoneNumber, address, otp } = req.body;

    if (!email || !otp || !password || !name) {
      console.error("❌ Missing required fields in request");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 1: Fetch OTP from DB
    const otpRecord = await OTP.findOne({ email });

    console.log("📌 Fetched OTP Record:", otpRecord);

    if (!otpRecord) {
      console.error(`❌ No OTP found for email: ${email}`);
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    console.log(`📌 Stored OTP: ${otpRecord.otp}, User Input OTP: ${otp}`);

    // Step 2: Validate OTP
    if (otpRecord.otp.toString() !== otp.toString()) {
      console.error(`❌ OTP mismatch: Expected ${otpRecord.otp}, Got ${otp}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    console.log(`⏳ OTP Expiry Time: ${otpRecord.expiresAt}, Current Time: ${new Date()}`);

    if (otpRecord.expiresAt < new Date()) {
      console.error(`❌ OTP expired for email: ${email}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    console.log("✅ OTP verified successfully!");

    // Step 3: Delete OTP after successful verification
    const deleteResult = await OTP.deleteOne({ email });
    console.log("🗑️ OTP deleted:", deleteResult);

    // Step 4: Check if the user already exists
    const existingUser = await User.findOne({ email });
    console.log("🔎 Checking existing user:", existingUser);

    if (existingUser) {
      console.error(`❌ User already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("✅ User does not exist. Proceeding with registration...");

    // Step 5: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Password hashed successfully");

    // Step 6: Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profile: { phoneNumber, address: address || null },
      wallet: { balance: 0 },
    });

    await newUser.save();
    console.log("✅ New user registered:", newUser);

    // Step 7: Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(`🎉 Registration successful for ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message || error.toString(),
      stack: error.stack, // Include stack trace for debugging
    });
  }
};




// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};







// REGISTER A NEW USER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phoneNumber, address } = req.body;

//     // Validate required fields
//     if (!name || !email || !password || !phoneNumber) {
//       return res.status(400).json({ message: "All fields except address are required" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       profile: { phoneNumber, address: address || null }, // Address is optional
//       wallet: { balance: 0 }, // Initialize wallet with ₹0
//     });

//     await newUser.save();

//     // Generate JWT token
//     const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; // Prevent crash if missing
//     const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: { id: newUser._id, name: newUser.name, email: newUser.email },
//       token,
//     });
//   } catch (error) {
//     console.error(error); // Debugging
//     res.status(500).json({ message: "Error registering user", error: error.message });
//   }
// };

