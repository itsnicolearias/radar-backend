export interface UserAttributes {
  userId: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  isVerified: boolean
  invisibleMode: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserCreationAttributes {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  isVerified?: boolean
  invisibleMode?: boolean
  lastLatitude?: number | null
  lastLongitude?: number | null
  lastSeenAt?: Date | null
}
