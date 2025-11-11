export interface IProfileResponse {
  profileId: string;
  userId: string;
  photoUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  birthDate: Date | null;
  gender: string | null;
  pronouns: string | null;
  height: number | null;
  zodiac: string | null;
  education: string | null;
  work: string | null;
  interests: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  User?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IDeleteProfileResponse {
  message: string;
}

export interface ProfileAttributes {
  profileId: string;
  userId: string;
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

export interface ProfileCreationAttributes extends Omit<ProfileAttributes, 'profileId'>, Record<string, unknown> {}
