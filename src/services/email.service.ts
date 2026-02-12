import { sendEmail } from "../config/email"
import { verifyEmailTemplate } from "../emails/templates/verifyEmail"
import { Profile } from "../models"
import { DEFAULT_LANGUAGE } from "../interfaces/profile.interface"
import type { SupportedLanguage } from "../interfaces/profile.interface"

interface SendVerificationEmailParams {
  userId: string
  to: string
  userName: string
  verificationUrl: string
}

const resolveProfileLanguage = async (userId: string): Promise<SupportedLanguage> => {
  const profile = await Profile.findOne({
    where: { userId },
    attributes: ["language"],
  })

  return profile?.language ?? DEFAULT_LANGUAGE
}

export const sendVerificationEmail = async ({
  userId,
  to,
  userName,
  verificationUrl,
}: SendVerificationEmailParams): Promise<void> => {
  const language = await resolveProfileLanguage(userId)
  const template = await verifyEmailTemplate({
    userName,
    verificationUrl,
    language,
  })

  await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}
