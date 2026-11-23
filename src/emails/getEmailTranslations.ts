import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../interfaces/profile.interface"
import type { SupportedLanguage } from "../interfaces/profile.interface"
import enTranslations from "./locales/en.json"
import esTranslations from "./locales/es.json"

export interface EmailTranslation {
  subject: string
  title: string
  description: string
  button: string
  footer: string
}

type EmailNamespaceTranslations = Record<string, EmailTranslation>

const translationsByLanguage: Record<SupportedLanguage, EmailNamespaceTranslations> = {
  en: enTranslations,
  es: esTranslations,
}

const isSupportedLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
}

const normalizeLanguage = (language: string): SupportedLanguage => {
  return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE
}

const loadLanguageTranslations = (language: SupportedLanguage): EmailNamespaceTranslations => {
  return translationsByLanguage[language]
}

export const getEmailTranslations = async (
  language: SupportedLanguage | string,
  namespace: string
): Promise<EmailTranslation> => {
  const safeLanguage = normalizeLanguage(language)
  const translations = loadLanguageTranslations(safeLanguage)
  const namespaceTranslations = translations[namespace]

  if (namespaceTranslations) {
    return namespaceTranslations
  }

  if (safeLanguage !== DEFAULT_LANGUAGE) {
    const fallbackTranslations = loadLanguageTranslations(DEFAULT_LANGUAGE)
    const fallbackNamespaceTranslations = fallbackTranslations[namespace]
    if (fallbackNamespaceTranslations) {
      return fallbackNamespaceTranslations
    }
  }

  throw new Error(`Missing email translation namespace: ${namespace}`)
}
