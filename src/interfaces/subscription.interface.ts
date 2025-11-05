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

export interface SubscriptionCreationAttributes extends Omit<SubscriptionAttributes, "id"> {}
