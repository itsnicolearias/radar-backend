export interface IAuthResponse {
  token: string
  user: {
    userId: string
    firstName: string
    lastName: string
    email: string
    isVerified: boolean
    displayName: string | null
    birthDate: Date | null
  }
}

export interface IResendVerificationEmailResponse {
  message: string
}

export interface IVerifyEmailResponse {
  message: string
  user: IAuthResponse["user"]
}
