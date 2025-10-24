export enum ConnectionStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface ConnectionAttributes {
  connectionId: string
  senderId: string
  receiverId: string
  status: ConnectionStatus
  createdAt: Date
  updatedAt: Date
}

export interface ConnectionCreationAttributes {
  senderId: string
  receiverId: string
  status?: ConnectionStatus
}
