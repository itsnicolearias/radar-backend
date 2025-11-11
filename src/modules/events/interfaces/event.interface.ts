export type TEvent = {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  startDate: Date;
  endDate?: Date;
  isPublic?: boolean;
  maxAttendees?: number;
  price?: number;
};
