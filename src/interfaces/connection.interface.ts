import { ConnectionStatus } from './enums';

export interface IUserConnectionInfo {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface IConnectionResponse {
  connectionId: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
  Sender?: IUserConnectionInfo;
  Receiver?: IUserConnectionInfo;
}

export interface IDeleteConnectionResponse {
  message: string;
}

export interface ConnectionAttributes {
  connectionId: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConnectionCreationAttributes extends Omit<ConnectionAttributes, 'connectionId'>, Record<string, unknown> {}
