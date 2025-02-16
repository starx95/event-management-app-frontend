export interface EventFormData {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "Ongoing" | "Completed"
  thumbnail?: FileList | null;
}
export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "Ongoing" | "Completed";
  thumbnailUrl: string;
}
export interface EventDetailsType { 
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    status: "Ongoing" | "Completed";
    thumbnailUrl: string;
  }

export interface LoginData {
    email: string;
    password: string;
  }
  
export interface LoginResponse {
    accessToken: string;
  }
  