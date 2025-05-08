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
  isLoading: boolean; // إضافة حالة التحميل
  fetchPortfolios: (userId: number) => Promise<void>;
  addPortfolio: (data: { title: string; description: string; date: string; image: File }) => Promise<void>;
  updatePortfolio: (id: number, data: { title: string; description: string; date: string; deleteImage: boolean }) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  fetchPortfolioImage: (portfolioID: number, imageName: string) => Promise<string | undefined>;
  fetchAllPortfolios: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolios: [],
  error: undefined,
  isLoading: false,

  fetchPortfolios: async (userId) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No authentication token found. Please log in.', isLoading: false });
        return;
      }
      const res = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ portfolios: res.data.$values || [], error: undefined, isLoading: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch portfolios. Check your connection or login status.';
      console.error('Error fetching portfolios:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  addPortfolio: async ({ title, description, date, image }) => {
    try {
      set({ isLoading: true });

      // التحقق من المدخلات
      if (!title || !description || !date) {
        set({ error: 'Title, description, and date are required.', isLoading: false });
        throw new Error('Missing required fields.');
      }
      if (image && !['image/jpeg', 'image/png', 'image/gif'].includes(image.type)) {
        set({ error: 'Invalid image format. Only JPEG, PNG, and GIF are allowed.', isLoading: false });
        throw new Error('Invalid image format.');
      }
      if (image && image.size > 5 * 1024 * 1024) {
        set({ error: 'Image size exceeds 5MB.', isLoading: false });
        throw new Error('Image size too large.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No authentication token found. Please log in.', isLoading: false });
        throw new Error('No authentication token found.');
      }

      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Description', description);
      formData.append('Date', date); // تأكدي أن التنسيق متوافق مع الخادم
      if (image) {
        formData.append('Image', image);
      }

      const response = await axios.post('https://jobgenius.bsite.net/api/Portfolio', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // تحديث الحالة بالمحفظة الجديدة
      const newPortfolio = response.data;
      set((state) => ({
        portfolios: [...state.portfolios, newPortfolio],
        error: undefined,
        isLoading: false,
      }));

      // جلب عنوان URL للصورة إذا كانت موجودة
      if (newPortfolio.image) {
        const imageUrl = await get().fetchPortfolioImage(newPortfolio.portfolioID, newPortfolio.image);
        if (imageUrl) {
          set((state) => ({
            portfolios: state.portfolios.map((p) =>
              p.portfolioID === newPortfolio.portfolioID ? { ...p, ImageUploadURL: imageUrl } : p
            ),
          }));
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add portfolio. Please try again.';
      console.error('Error adding portfolio:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  updatePortfolio: async (id, { title, description, date, deleteImage }) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No authentication token found. Please log in.', isLoading: false });
        throw new Error('No authentication token found.');
      }
      const query = `?Title=${encodeURIComponent(title)}&Description=${encodeURIComponent(description)}&Date=${encodeURIComponent(date)}&DeleteImage=${deleteImage}`;
      const response = await axios.put(`https://jobgenius.bsite.net/api/Portfolio/${id}${query}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        portfolios: state.portfolios.map((portfolio) =>
          portfolio.portfolioID === id ? { ...portfolio, ...response.data } : portfolio
        ),
        error: undefined,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update portfolio. Please try again.';
      console.error('Error updating portfolio:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  deletePortfolio: async (id) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No authentication token found. Please log in.', isLoading: false });
        throw new Error('No authentication token found.');
      }
      await axios.delete(`https://jobgenius.bsite.net/api/Portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        portfolios: state.portfolios.filter((portfolio) => portfolio.portfolioID !== id),
        error: undefined,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete portfolio. Please try again.';
      console.error('Error deleting portfolio:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPortfolioImage: async (portfolioID: number, imageName: string) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No authentication token found. Please log in.', isLoading: false });
        throw new Error('No authentication token found.');
      }

      const response = await axios.get(`https://jobgenius.bsite.net/api/Portfolio/${portfolioID}/images/${imageName}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // افتراض أن الخادم يُرجع الصورة كـ Blob
      });

      const imageUrl = URL.createObjectURL(response.data);

      set((state) => {
        const updatedPortfolios = state.portfolios.map((portfolio) =>
          portfolio.portfolioID === portfolioID ? { ...portfolio, ImageUploadURL: imageUrl } : portfolio
        );
        return { portfolios: updatedPortfolios, error: undefined, isLoading: false };
      });

      return imageUrl;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch image. Check the image name or your connection.';
      console.error('Error fetching portfolio image:', err);
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },

  fetchAllPortfolios: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: 'No token found. Please log in first.', isLoading: false });
        return;
      }
      const res = await axios.get('https://jobgenius.bsite.net/api/Portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const portfolios = res.data.$values || [];
      set({ portfolios, error: undefined, isLoading: false });

      // جلب الصور لكل محفظة
      for (const portfolio of portfolios) {
        if (portfolio.image && !portfolio.ImageUploadURL) {
          await get().fetchPortfolioImage(portfolio.portfolioID, portfolio.image);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch all portfolios. Ensure you are logged in.';
      console.error('Error fetching all portfolios:', err);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));