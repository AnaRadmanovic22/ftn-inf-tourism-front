export interface Tour{
    id?: number
    name: string
    description: string
    dateTime: string
    maxGuests: number
    status?: string
    guideId?: number
}

export interface TourResults {
  data: Tour[];
  totalCount: number;
}