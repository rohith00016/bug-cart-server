const nodemailer = require("nodemailer");

const htmlTemplate = (link) => {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://mern-ecommerce-lake-one.vercel.app/assets/logo-BDGV9g83.png" alt="Your Logo" style="height: 50px;" />
      </div>

      <h2 style="color: #333; text-align: center;">Reset Your Password</h2>

      <p style="font-size: 16px; color: #555; line-height: 1.5;">
        We received a request to reset your account password. If this was you, click the button below to proceed. 
        The link will expire in <strong>15 minutes</strong> for security purposes.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #1976d2; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #777; line-height: 1.5;">
        If you didn't request a password reset, please ignore this email. Your account is still secure.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        Need help? Contact us at <a href="mailto:support@yourdomain.com" style="color: #1976d2;">support@yourdomain.com</a><br/>
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
    </div>
  `;
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,      
    pass: process.env.MAIL_PASSWORD   
  }
});

const sendResetEmail = async (email, link) => {
  
  let html=htmlTemplate(link)
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: html
  };

  transporter.sendMail(mailOptions),(error,info)=>{
            if(error){
                console.log("error",error)
            }else{
                console.log("Email send",info.response)
            }
 }
}


module.exports = sendResetEmail;
