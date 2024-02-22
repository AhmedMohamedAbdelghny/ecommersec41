import nodemailer from "nodemailer";

export const emailFunc = async ({ email, subject, html, attachments = [] } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_Password,
        },
    });

    const info = await transporter.sendMail({
        from: 'ahmderoute5@gmail.com',
        to: email,
        subject: subject ? subject : "Hello ✔",
        html: html ? html : "<b>Hello world?</b>",
        attachments
    });
    
    if (info.accepted.length > 0) {
        return true
    }
    return false
}