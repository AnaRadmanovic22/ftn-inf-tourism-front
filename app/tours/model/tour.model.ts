export interface Tour{
    id?: number
    name: string
    description: string
    dateTime: string
    maxGuests: number
    status?: string
    guideId?: number
    keyPoints?: KeyPoint[]
}

export interface TourResults {
  data: Tour[];
  totalCount: number;
}

export type KeyPoint = {
  id?: number;
  order: number;
  name: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  tourId: number;
};

export interface Reservation{
  id?: number;
  tourId: number;
  userId: number;
  numberOfPeople: number;
}