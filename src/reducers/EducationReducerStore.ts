import { create } from "zustand";
import axios from "axios";

interface Education {
    university: string;
    degree: string;
    dateFrom: string;
    dateTo: string;
    description: string;
}

interface EducationState {
    educations: Education[];
    fetchEducations: () => Promise<void>;
}

export const useEducationStore = create<EducationState>((set) => ({
    educations: [],
    fetchEducations: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://jobgenius.bsite.net/api/Education", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            set({ educations: response.data });
            
        } catch (error) {
            console.error("Error fetching educations:", error);
        }
    },


}))