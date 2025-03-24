const nodemailer = require("nodemailer");

const sendMail = async (members, teamName, eventName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER,
        pass: process.env.APP_KEY, // App password
      },
    });

    for (const member of members) {
      const mailOptions = {
        from: process.env.GMAIL_SENDER,
        to: member.email,
        subject: `✅ ${eventName} Registration Confirmation – Team ${teamName}`,
        html: `
          <p>Dear ${member.name},</p>

          <p>We are thrilled to confirm your registration for the event <strong>${eventName}</strong> as part of <strong>Team ${teamName}</strong> from <strong>${member.collegeName}</strong>.</p>

          <p>Thank you for your enthusiasm! We're excited to have you join us and hope this experience proves to be insightful and memorable.</p>

          <p>If you have any questions or need any assistance, feel free to reach out to us anytime.</p>

          <br/>
          <p>Wishing you all the best,</p>
          <p><strong>Team Kranti</strong></p>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${member.email}: ${info.response}`);
      } catch (err) {
        console.error(`❌ Error sending mail to ${member.email}`, err);
      }
    }
  } catch (error) {
    console.error("❌ Failed to send emails:", error);
  }
};

module.exports = sendMail;
