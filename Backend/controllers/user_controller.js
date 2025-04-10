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
    console.log("🔹 Incoming Request Data:", req.body);

    const { name, email, password, phoneNumber, address, otp } = req.body;

    if (!email || !otp || !password || !name) {
      console.error("❌ Missing required fields in request");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const otpRecord = await OTP.findOne({ email });
    console.log("📌 Fetched OTP Record:", otpRecord);

    if (!otpRecord) {
      console.error(`❌ No OTP found for email: ${email}`);
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.otp.toString() !== otp.toString()) {
      console.error(`❌ OTP mismatch: Expected ${otpRecord.otp}, Got ${otp}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      console.error(`❌ OTP expired for email: ${email}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    await OTP.deleteOne({ email });
    console.log("🗑️ OTP deleted");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`❌ User already exists: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // 👈 Store role as 'user'
      profile: { phoneNumber, address: address || null },
      wallet: { balance: 0 },
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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
      stack: error.stack,
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


/**
 * Endpoint for a user to voluntarily pause their subscription.
 */
export const pauseSubscriptionByUser = async (req, res) => {
  try {
    const { subscriptionId } = req.body; // Subscription ID from the user's request

    // Update the subscription status to paused with the user-initiated reason
    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      {
        status: "paused",
        pauseReason: "user_paused",
      },
      { new: true } // Return the updated subscription document
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription paused successfully", subscription });
  } catch (error) {
    res.status(500).json({ message: "Error pausing subscription", error });
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

