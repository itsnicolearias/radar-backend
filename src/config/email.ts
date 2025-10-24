import nodemailer, { type Transporter } from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
}

const transporter: Transporter = nodemailer.createTransport(emailConfig)

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@radar.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export default transporter
