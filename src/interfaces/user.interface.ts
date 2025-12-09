import { Profile } from "../models"
import { IProfileResponse } from "./profile.interface"

export interface IUserResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  isVerified: boolean
  invisibleMode: boolean
  isVisible: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  createdAt: Date
  updatedAt: Date
  Profile?: IProfileResponse
}

export interface IUpdateLocationResponse {
  userId: string
  latitude: number | null
  longitude: number | null
  lastSeenAt: Date
}

export interface IUpdateUserResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  invisibleMode: boolean
  isVisible: boolean
}

export interface IToggleVisibilityResponse {
  userId: string
  isVisible: boolean
}

export interface UserAttributes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
  birthDate?: Date | null;
  isVerified: boolean;
  emailVerificationToken?: string | null;
  invisibleMode: boolean;
  isVisible: boolean;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastSeenAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  Profile?: Profile;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'userId'>, Record<string, unknown> {}
