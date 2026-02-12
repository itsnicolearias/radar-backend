import type { User } from "../models";
import type { IUserResponse } from "./user.interface";

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "es";

export type IProfileResponse = ProfileAttributes & {
  User?: Partial<IUserResponse> | User
}

export interface IDeleteProfileResponse {
  message: string;
}

export interface ProfileAttributes {
  profileId: string;
  userId: string;
  language: SupportedLanguage;
  photoUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  birthDate?: Date | null;
  gender?: string | null;
  pronouns?: string | null;
  height?: number | null;
  zodiac?: string | null;
  education?: string | null;
  work?: string | null;
  interests?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
  age?: number | null;
  country?: string | null;
  province?: string | null;
  showAge?: boolean;
  showLocation?: boolean;
  distanceRadius?: number;
}

export interface ProfileCreationAttributes extends Omit<ProfileAttributes, "profileId" | "language">, Record<string, unknown> {
  language?: SupportedLanguage;
}
