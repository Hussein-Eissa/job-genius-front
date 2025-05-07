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
  error?: string;
  fetchPortfolios: (userId: number) => Promise<void>;
  addPortfolio: (data: { title: string; description: string; date: string; image: File }) => Promise<void>;
  updatePortfolio: (id: number, data: { title: string; description: string; date: string; deleteImage: boolean }) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  fetchPortfolioImage: (portfolioID: number, imageName: string) => Promise<string | undefined>;
  fetchAllPortfolios: () => Promise<void>; 
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolios: [],
  error: undefined,

  fetchPortfolios: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ portfolios: res.data.$values, error: undefined });
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      set({ error: 'Failed to fetch portfolios. Check your connection or login status.' });
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
      set({ error: undefined });
    } catch (err) {
      console.error('Error adding portfolio:', err);
      set({ error: 'Failed to add portfolio. Please try again.' });
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
      set({ error: undefined });
    } catch (err) {
      console.error('Error updating portfolio:', err);
      set({ error: 'Failed to update portfolio. Please try again.' });
    }
  },

  deletePortfolio: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://jobgenius.bsite.net/api/Portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ error: undefined });
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      set({ error: 'Failed to delete portfolio. Please try again.' });
    }
  },

  fetchPortfolioImage: async (portfolioID: number, imageName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${portfolioID}/images/${imageName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let imageUrl: string;

      if (response.data instanceof Blob) {
        imageUrl = URL.createObjectURL(response.data);
      } else if (typeof response.data === 'string') {
        imageUrl = response.data;
      } else {
        throw new Error('Unexpected response type. Expected URL or Blob.');
      }

      set((state) => {
        const updatedPortfolios = state.portfolios.map(portfolio =>
          portfolio.portfolioID === portfolioID
            ? { ...portfolio, ImageUploadURL: imageUrl }
            : portfolio
        );
        return { portfolios: updatedPortfolios, error: undefined };
      });

      return imageUrl;
    } catch (err) {
      console.error('Error fetching portfolio image:', err);
      set({ error: 'Failed to fetch image. Check the image name or your connection.' });
    }
  },

  fetchAllPortfolios: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('https://jobgenius.bsite.net/api/Portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ portfolios: res.data.$values || [], error: undefined });
      } catch (err) {
        console.error('Error fetching all portfolios:', err);
        set({ error: 'Failed to fetch all portfolios. Ensure you are logged in.' });
      }
    } else {
      set({ error: 'No token found. Please log in first.' });
    }
  },
}));