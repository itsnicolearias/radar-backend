export interface ISignalResponse {
  signalId: string;
  senderId: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  distance?: number;
}
