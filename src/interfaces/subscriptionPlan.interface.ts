export interface SubscriptionPlanAttributes {
  subscriptionPlanId: string;
  name: string;
  price: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SubscriptionPlanCreationAttributes extends Omit<SubscriptionPlanAttributes, "subscriptionPlanId"> {}
