import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendFeedbackRequestEmail(to: string, token: string, candidateName?: string) {
    const link = `${process.env.FEEDBACK_URL_BASE}/submit/${token}`;

    const info = await transporter.sendMail({
        from: `"Swisscom Recruitment" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Interview Feedback Request',
        html: `
        <div style="font-family: Arial, sans-serif; color: #0c1052; padding: 30px; line-height: 1.6;">
          <img src="https://i.namu.wiki/i/dJ7GQ-FhYnqfzJvzYdMRE-HPdtlkFtt_bcR0Kz3B6d7HxoTXR_DnoqloZQa7iqt2Daey1xAzKEpDZkF2-KFbow.webp" 
               alt="Swisscom" width="140" style="margin-bottom: 30px;" />
  
          <p style="font-size: 16px;"><strong>Dear ${candidateName ?? 'applicant'},</strong></p>
  
          <p style="font-size: 15px;">
            You have been invited to provide feedback on your recent interview. If you wish, please complete the form using the link below:
          </p>
  
          <div style="margin: 25px 0;">
            <a href="${link}" 
               style="
                 background-color: white;
                 border: 1.5px solid #bbbbbb;
                 color: #0c1052;
                 text-decoration: none;
                 padding: 10px 20px;
                 border-radius: 8px;
                 font-size: 15px;
                 display: inline-block;
                 transition: all 0.3s ease-in-out;
            ">
              <strong>Go to form &nbsp;</strong><span style="color: #0f6adb;"> ➜ </span>
            </a>
          </div>
  
          <p style="font-size: 14px;">This link is personal and confidential.</p>
          <p style="font-size: 14px;">Thank you for your time and have a great day!</p>
          <p style="font-size: 14px;">Best regards,<br/>Swisscom</p>
  
          <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;" />
          <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Swisscom | This is an automated message, please do not reply.</p>
        </div>
      `
    });

    return info;
}

// Test Implementation

// let transporterPromise = nodemailer.createTestAccount().then(testAccount => {
//     return nodemailer.createTransport({
//         host: testAccount.smtp.host,
//         port: testAccount.smtp.port,
//         secure: testAccount.smtp.secure,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         }
//     });
// });

// export async function sendFeedbackRequestEmail(to: string, token: string, candidateName?: string) {
//     const transporter = await transporterPromise;

//     const link = `https://fake-feedback-form.com/fill/${token}`;

//     const info = await transporter.sendMail({
//         from: `"Swisscom Recruitment" <no-reply@fake.com>`,
//         to,
//         subject: 'Interview Feedback Request',
//         html: `
//     <div style="font-family: Arial, sans-serif; color: #0c1052; padding: 30px; line-height: 1.6;">

//     <img src="https://i.namu.wiki/i/dJ7GQ-FhYnqfzJvzYdMRE-HPdtlkFtt_bcR0Kz3B6d7HxoTXR_DnoqloZQa7iqt2Daey1xAzKEpDZkF2-KFbow.webp"
//          alt="Swisscom" width="140" style="margin-bottom: 30px;" />

//     <p style="font-size: 16px;"><strong>Dear ${candidateName ?? 'applicant'},</strong></p>

//     <p style="font-size: 15px;">
//       You have been invited to provide feedback on your recent interview. If you wish, please complete the form using the link below:
//     </p>

//     <div style="margin: 25px 0;">
//       <a href="https://fake-feedback-form.com/fill/${token}"
//          style="
//            background-color: white;
//            border: 1.5px solid #bbbbbb;
//            color: #0c1052;
//            text-decoration: none;
//            padding: 10px 20px;
//            border-radius: 8px;
//            font-size: 15px;
//            display: inline-block;
//            transition: all 0.3s ease-in-out;
//       ">
//         <strong>Go to form &nbsp;</strong><span style="color: #0f6adb;"> ➜ </span>
//       </a>
//     </div>

//     <p style="font-size: 14px;">This link is personal and confidential.</p>

//     <p style="font-size: 14px;">
//       Thank you for your time and have a great day!
//     </p>

//     <p style="font-size: 14px;">Best regards,<br/>Swisscom</p>

//     <hr style="margin-top: 40px; border: none; border-top: 1px solid #ccc;" />

//     <p style="font-size: 12px; color: #666;">
//       © ${new Date().getFullYear()} Swisscom | This is an automated message, please do not reply.
//     </p>
//   </div>
// `
//     });

//     console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
// }

