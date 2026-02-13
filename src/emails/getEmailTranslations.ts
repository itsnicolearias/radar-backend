import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../interfaces/profile.interface"
import type { SupportedLanguage } from "../interfaces/profile.interface"

export interface EmailTranslation {
  subject: string
  title: string
  description: string
  button: string
  footer: string
}

type EmailNamespaceTranslations = Record<string, EmailTranslation>

const isSupportedLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
}

const normalizeLanguage = (language: string): SupportedLanguage => {
  return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE
}

const loadLanguageTranslations = async (language: SupportedLanguage): Promise<EmailNamespaceTranslations> => {
  const translationsModule = await import(`./locales/${language}.json`)
  return translationsModule.default as EmailNamespaceTranslations
}

export const getEmailTranslations = async (
  language: SupportedLanguage | string,
  namespace: string
): Promise<EmailTranslation> => {
  const safeLanguage = normalizeLanguage(language)
  const translations = await loadLanguageTranslations(safeLanguage)
  const namespaceTranslations = translations[namespace]

  if (namespaceTranslations) {
    return namespaceTranslations
  }

  if (safeLanguage !== DEFAULT_LANGUAGE) {
    const fallbackTranslations = await loadLanguageTranslations(DEFAULT_LANGUAGE)
    const fallbackNamespaceTranslations = fallbackTranslations[namespace]
    if (fallbackNamespaceTranslations) {
      return fallbackNamespaceTranslations
    }
  }

  throw new Error(`Missing email translation namespace: ${namespace}`)
}
