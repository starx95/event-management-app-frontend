export interface EventFormData {
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    thumbnail?: FileList;
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
  