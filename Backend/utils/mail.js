import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Milk Delivery Service Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - OTP Inside!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #2d89ef; text-align: center;">Milk Delivery Service</h2>
          <p>Dear User,</p>
          <p>We received a request to verify your email. Please use the OTP below to complete your registration:</p>
          <h1 style="color: #ff4500; text-align: center; font-size: 24px;">${otp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; text-align: center;">Need help? Contact us at <a href="mailto:support@milkdelivery.com">OoooYesDaddy@milkdelivery.com</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
