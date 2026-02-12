import { verifyEmailTemplate } from "../emails/templates/verifyEmail"
import { DEFAULT_LANGUAGE } from "../interfaces/profile.interface"
import type { SupportedLanguage } from "../interfaces/profile.interface"

export const verifyAccountTemplate = async (
  userName: string,
  verificationUrl: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE
): Promise<string> => {
  const template = await verifyEmailTemplate({
    userName,
    verificationUrl,
    language,
  })

  return template.html
}
