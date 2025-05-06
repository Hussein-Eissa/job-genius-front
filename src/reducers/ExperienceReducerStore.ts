import { create } from 'zustand';
import axios from 'axios';

export interface Experience {
    experienceID?: number;
    title: string;
    company: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    city: string;
    country: string;
    description: string;
  }

interface ExperiencePayload {
    title: string;
    company: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    city: string;
    country: string;
    description: string;
  }
interface ExperienceState {
  experiences: Experience[];
  fetchExperiences: (userId: number) => Promise<void>;
  addExperience: (data: ExperiencePayload) => Promise<void>;
  updateExperience: (id: number, data: ExperiencePayload) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  experiences: [],

  fetchExperiences: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://jobgenius.bsite.net/api/Experience/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ experiences: res.data.$values });
    } catch (err) {
      console.error('Error fetching experiences:', err);
    }
  },

  addExperience: async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://jobgenius.bsite.net/api/Experience', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error adding experience:', err);
    }
  },

  updateExperience: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://jobgenius.bsite.net/api/Experience/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error updating experience:', err);
    }
  },

  deleteExperience: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://jobgenius.bsite.net/api/Experience/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  },
}));
