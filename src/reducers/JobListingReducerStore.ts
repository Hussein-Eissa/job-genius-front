import { create } from "zustand";
import axios from "axios";

interface JobBenefit {
  title: string;
  description: string;
}

interface CategoryJobCount {
  categoryName: string;
  jobCount: number;
}

interface JobListing {
  jobID: number;
  title: string;
  company: string;
  city: string;
  country: string;
  type: string;
  description: string;
  responsibilities: string;
  whoYouAre: string;
  niceToHaves: string;
  capacity: number;
  applyBefore: string;
  salaryFrom: number;
  salaryTo: number;
  companyWebsite: string;
  keywords: string;
  additionalInformation: string;
  companyPapers: string;
  categories: string[];
  skills: string[];
  jobBenefits: JobBenefit[];
}

interface SavedJob extends JobListing {}

interface JobListingState {
  jobs: JobListing[];
  userJobs: JobListing[];
  categoriesWithCount: CategoryJobCount[];
  savedJobs: SavedJob[];
  success: boolean | null;
  error?: string;
  // fetch jobs
  fetchJobs: () => Promise<void>;
  // fetch job by id
  getJobById: (jobId: number) => Promise<any>;
  // create job
  createJob: (jobData: JobListing) => Promise<void>;
  // update job
  updateJob: (jobId: number, jobData: JobListing) => Promise<void>;
  // delete job
  deleteJob: (jobId: number) => Promise<void>;
  // search jobs
  searchJobs: (keyword: string, country: string, city: string) => Promise<void>;
  // fetch categories
  fetchCategoriesWithCount: () => Promise<void>;
  // fetch saved jobs
  fetchSavedJobs: () => Promise<void>;
  // save job
  saveJobByID: (jobId: number) => Promise<void>;
  // delete saved job
  deleteSavedJob: (jobId: number) => Promise<void>;
  // fetch user jobs
  fetchUserJobs: () => Promise<void>;
  // filter jobs
  filterJobs: (filters: {
    keyword?: string;
    country?: string;
    city?: string;
    type?: string;
    salaryFrom?: number;
    salaryTo?: number;
  }) => Promise<void>;
}

export const useJobStore = create<JobListingState>((set , get) => ({
  jobs: [],
  userJobs: [],
  categoriesWithCount: [],
  savedJobs: [],
  success: null,
  error: undefined,

  fetchJobs: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://jobgenius.bsite.net/api/JobListing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ jobs: res.data, success: true, error: undefined });
      console.log("Fetched jobs:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching jobs:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to fetch jobs." });
    }
  },

  createJob: async (jobData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://jobgenius.bsite.net/api/JobListing", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        jobs: [...state.jobs, res.data],
        success: true,
        error: undefined,
      }));
      console.log("Created job:", res.data);
    } catch (error: any) {
      console.error("Error creating job:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to create job." });
    }
  },

  updateJob: async (jobId : number , jobData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        jobs: state.jobs.map((job) => (job.jobID === jobId ? res.data : job)),
        success: true,
        error: undefined,
      }));
      console.log("Updated job:", res.data);
    } catch (error: any) {
      console.error("Error updating job:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to update job." });
    }
  },

  deleteJob: async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set((state) => ({
        jobs: state.jobs.filter((job) => job.jobID !== jobId),
        success: true,
        error: undefined,
      }));
      console.log("Deleted job:", res.data);
    } catch (error: any) {
      console.error("Error deleting job:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to delete job." });
    }
  },

  searchJobs: async (keyword, country, city) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
      const response = await axios.get(
        `https://jobgenius.bsite.net/api/JobListing/search?keyword=${keyword}&country=${country}&city=${city}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            keyword,
            city,
            country,
          },
        }
      );

      set({ jobs: response.data, success: true, error: undefined });
      console.log("Search results:", response.data);
    } catch (error: any) {
      console.error("Error searching jobs:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to search jobs." });
    }
  },

  fetchCategoriesWithCount: async () => {
    try {
      const res = await axios.get("https://jobgenius.bsite.net/api/JobListing/categories-job-count");
      set({ categoriesWithCount: res.data.$values, success: true, error: undefined });
    } catch (error: any) {
      console.error("Error fetching category job counts:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to fetch categories." });
    }
  },

  fetchSavedJobs: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("https://jobgenius.bsite.net/api/JobListing/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ savedJobs: response.data, success: true, error: undefined });
      console.log("Fetched saved jobs:", response.data);
    } catch (error: any) {
      console.error("Error fetching saved jobs:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to fetch saved jobs." });
    }
  },

  saveJobByID: async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.post(
        `https://jobgenius.bsite.net/api/JobListing/saved?jobId=${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const job = await get().getJobById(jobId);
        set((state) => ({
          savedJobs: [...state.savedJobs, job],
          success: true,
          error: undefined,
        }));
        console.log("Saved job successfully:", res.data);
      } else {
        throw new Error(res.data.message || "Failed to save job.");
      }
    } catch (error: any) {
      console.error("Error saving job:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to save job." });
    }
  },

  deleteSavedJob: async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const res = await axios.delete(
        `https://jobgenius.bsite.net/api/JobListing/saved?jobId=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        savedJobs: state.savedJobs.filter((job) => job.jobID !== jobId),
        success: true,
        error: undefined,
      }));
      console.log("Deleted saved job:", res.data);
    } catch (error: any) {
      console.error("Error deleting saved job:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to delete saved job." });
    }
  },

  getJobById: async (jobId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");

      const res = await axios.get(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ success: true, error: undefined });
      console.log("Fetched job by ID:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching job by ID:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to fetch job by ID." });
      throw error;
    }
  },

  fetchUserJobs: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("https://jobgenius.bsite.net/api/JobListing/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ userJobs: response.data, success: true, error: undefined });
      console.log("Fetched user jobs:", response.data);
    } catch (error: any) {
      console.error("Error fetching user jobs:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to fetch user jobs." });
    }
  },

  filterJobs: async (filters) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append("keyword", filters.keyword);
      if (filters.country) queryParams.append("country", filters.country);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.salaryFrom) queryParams.append("salaryFrom", filters.salaryFrom.toString());
      if (filters.salaryTo) queryParams.append("salaryTo", filters.salaryTo.toString());

      const response = await axios.get(
        `https://jobgenius.bsite.net/api/JobListing/Filter?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ jobs: response.data, success: true, error: undefined });
      console.log("Filtered jobs:", response.data);
    } catch (error: any) {
      console.error("Error filtering jobs:", error.response?.data || error.message);
      set({ success: false, error: error.response?.data?.message || "Failed to filter jobs." });
    }
  },
}));