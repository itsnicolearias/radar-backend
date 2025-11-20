import { TEvent as IEventResponse } from "./event.interface"
import { ISignalResponse } from "./signal.interface"

export interface IRadarUserProfile {
  photoUrl: string | null
  bio: string | null
  age: number | null
  interests: string[] | null
}

export interface IRadarUserResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  isVerified: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  distance: number
  Profile: IRadarUserProfile
}

export interface IRadarNearbyResponse {
  users: IRadarUserResponse[]
  events: IEventResponse[]
  signals: ISignalResponse[]
}
