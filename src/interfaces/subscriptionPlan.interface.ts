export interface SubscriptionPlanAttributes {
  id: string;
  name: string;
  price: number;
  features: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionPlanCreationAttributes extends Omit<SubscriptionPlanAttributes, "id"> {}
