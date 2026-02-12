import { getEmailTranslations } from "../getEmailTranslations"
import type { SupportedLanguage } from "../../interfaces/profile.interface"

interface VerifyEmailTemplateParams {
  userName: string
  verificationUrl: string
  language: SupportedLanguage
}

interface VerifyEmailTemplateResult {
  subject: string
  html: string
}

const interpolate = (value: string, variables: Record<string, string>): string => {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? "")
}

export const verifyEmailTemplate = async ({
  userName,
  verificationUrl,
  language,
}: VerifyEmailTemplateParams): Promise<VerifyEmailTemplateResult> => {
  const t = await getEmailTranslations(language, "verifyEmail")

  return {
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8" />
        <title>${t.subject}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#0B0F14; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F14; padding:40px 0;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#121821; border-radius:8px; padding:32px;">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <h1 style="margin:0; font-size:24px; color:#00FFB3;">Radar</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color:#E6E8EB; font-size:15px; line-height:1.6;">
                    <p style="margin:0 0 16px 0;"><strong>${interpolate(t.title, { userName })}</strong></p>
                    <p style="margin:0 0 24px 0;">${interpolate(t.description, { userName })}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a
                      href="${verificationUrl}"
                      target="_blank"
                      style="
                        display:inline-block;
                        padding:14px 24px;
                        background-color:#00FFB3;
                        color:#0B0F14;
                        text-decoration:none;
                        font-weight:bold;
                        border-radius:6px;
                        font-size:14px;
                      "
                    >
                      ${t.button}
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; margin-top:16px;">
                <tr>
                  <td align="center" style="color:#6B7280; font-size:11px;">
                    ${t.footer}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  }
}
