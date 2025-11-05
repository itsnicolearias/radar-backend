export type SubscriptionStatus = "active" | "cancelled" | "pending";

export interface SubscriptionAttributes {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  mercadoPagoSubscriptionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SubscriptionCreationAttributes extends Omit<SubscriptionAttributes, "id"> {}
