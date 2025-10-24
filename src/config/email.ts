import nodemailer, { type Transporter } from "nodemailer"
import { config } from "./config"

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
  host: config.emailHost,
  port: config.emailPort,
  secure: false,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
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
      from: config.emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    })
  } catch (error) {
    throw error
  }
}

export default transporter
