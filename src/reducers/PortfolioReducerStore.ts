import { create } from 'zustand';
import axios from 'axios';

export interface Portfolio {
    portfolioID: number;
    image: string; 
    title: string;
    description: string;
    date: string;
    ImageUploadURL?: string;
}

interface PortfolioState {
  portfolios: Portfolio[];
  fetchPortfolios: (userId: number) => Promise<void>;
  addPortfolio: (data: { title: string; description: string; date: string; image: File }) => Promise<void>;
  updatePortfolio: (id: number, data: { title: string; description: string; date: string; deleteImage: boolean }) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  fetchPortfolioImage: (portfolioID: number, imageName: string) => Promise<void>;
  fetchAllPortfolios: () => Promise<void>; 
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolios: [],

  fetchPortfolios: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ portfolios: res.data.$values });
    } catch (err) {
      console.error('Error fetching portfolios:', err);
    }
  },

  addPortfolio: async ({ title, description, date, image }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Description', description);
      formData.append('Date', date);
      formData.append('Image', image);

      await axios.post('https://jobgenius.bsite.net/api/Portfolio', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.error('Error adding portfolio:', err);
    }
  },

  updatePortfolio: async (id, { title, description, date, deleteImage }) => {
    try {
      const token = localStorage.getItem('token');
      const query = `?Title=${encodeURIComponent(title)}&Description=${encodeURIComponent(description)}&Date=${encodeURIComponent(date)}&DeleteImage=${deleteImage}`;
      await axios.put(`https://jobgenius.bsite.net/api/Portfolio/${id}${query}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Error updating portfolio:', err);
    }
  },

  deletePortfolio: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://jobgenius.bsite.net/api/Portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error deleting portfolio:', err);
    }
  },

  // New function to fetch portfolio image based on the provided API request
  fetchPortfolioImage: async (portfolioID: number, imageName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${portfolioID}/images/${imageName}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // To handle image data
      });
      const imageUrl = URL.createObjectURL(response.data);
      
        // Note: You might want to handle the image data (e.g., set it to state or download it)
        //   
        // 
        // 
        // 
        //@Hussein give it a look and if we need it or not   
    } catch (err) {
      console.error('Error fetching portfolio image:', err);
    }
  },

  //fetch all portfolios if token is available
  fetchAllPortfolios: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('https://jobgenius.bsite.net/api/Portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ portfolios: res.data.$values || [] });
      } catch (err) {
        console.error('Error fetching all portfolios:', err);
      }
    }
  },
}));