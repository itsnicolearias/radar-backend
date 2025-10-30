export interface UserAttributes {
  userId: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  birthDate: Date | null
  displayName: string | null
  emailVerificationToken: string | null
  isVerified: boolean
  isVisible: boolean
  invisibleMode: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  createdAt: Date
  updatedAt: Date
  roles: string[];
}

export interface UserCreationAttributes {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  birthDate?: Date | null
  displayName?: string | null
  emailVerificationToken?: string | null
  isVerified?: boolean
  isVisible?: boolean
  invisibleMode?: boolean
  lastLatitude?: number | null
  lastLongitude?: number | null
  lastSeenAt?: Date | null
}
