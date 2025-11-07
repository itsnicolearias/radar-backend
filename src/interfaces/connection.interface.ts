import { ConnectionStatus } from './../interfaces/connection.interface';

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
