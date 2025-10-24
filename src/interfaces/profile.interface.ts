export interface ProfileAttributes {
  profileId: string
  userId: string
  bio: string | null
  age: number | null
  country: string | null
  province: string | null
  photoUrl: string | null
  interests: string[] | null
  showAge: boolean
  showLocation: boolean
  distanceRadius: number
  createdAt: Date
  updatedAt: Date
}

export interface ProfileCreationAttributes {
  userId: string
  bio?: string | null
  age?: number | null
  country?: string | null
  province?: string | null
  photoUrl?: string | null
  interests?: string[] | null
  showAge?: boolean
  showLocation?: boolean
  distanceRadius?: number
}
