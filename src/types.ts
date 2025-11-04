export interface HistoricalEvent {
  id: string;
  date: number; // Storing date as timestamp for easier calculations
  title: string;
  description: string;
  imageUrl?: string; // Base64 encoded image
}

export interface History {
  id: string;
  name: string;
  color: string;
  events: HistoricalEvent[];
}
