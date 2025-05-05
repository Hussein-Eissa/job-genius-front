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
  categoriesWithCount: CategoryJobCount[];
  savedJobs: SavedJob[];
  // API JobListing all
  fetchJobs: () => Promise<void>;
  // API JobListing by ID
  getJobById: (jobId: number) => Promise<any>;
  // API JobListing POST
  createJob: (jobData: JobListing) => Promise<void>;
  // API JobListing PUT
  updateJob: (jobId: string, jobData: JobListing) => Promise<void>;
  // API JobListing DELETE
  deleteJob: (jobId: string) => Promise<void>;
  // API JobListing search
  searchJobs: (keyword: string, country: string, city: string) => Promise<void>;
  // API JobListing categories
  fetchCategoriesWithCount: () => Promise<void>;
  // API JobListing GET saved jobs
  fetchSavedJobs: () => Promise<void>;
  // API JobListing   get saved job
  saveJobByID: (jobId: number) => Promise<void>;
  // API JobListing   delete saved job
  deleteSavedJob: (jobId: number) => Promise<void>;

}

export const useJobStore = create<JobListingState>((set) => ({
  jobs: [],
  categoriesWithCount: [],
  savedJobs: [],

  fetchJobs: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://jobgenius.bsite.net/api/JobListing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      set({ jobs: res.data });
  
      console.log("Fetched jobs:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching jobs:", error.response?.data || error.message);
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
      console.log("Created job:", res.data);
    } catch (error: any) {
      console.error("Error creating job:", error.response?.data || error.message);
    }
  },
  
  updateJob: async (jobId, jobData) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Fetched Token:", token); 
  
      const res = await axios.put(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Updated job:", res.data);
    } catch (error: any) {
      console.error("Error updating job:", error.response?.data || error.message);
    }
  },
  
  deleteJob: async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("Fetched Token:", token); 
  
      const res = await axios.delete(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Deleted job:", res.data);
    } catch (error: any) {
      console.error("Error deleting job:", error.response?.data || error.message);
    }
  },
  searchJobs: async (keyword, country, city) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }
  
      const response = await axios.get(`https://jobgenius.bsite.net/api/JobListing/search?keyword=${keyword}&country=${country}&city=${city}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          country,
          city,
        },
      });
  
      set({ jobs: response.data });
      console.log("Search results:", response.data);
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
  },
  
  fetchCategoriesWithCount: async () => {
    try {
      const res = await axios.get("https://jobgenius.bsite.net/api/JobListing/categories-job-count");
      set({ categoriesWithCount: res.data.$values }); 
    } catch (error) {
      console.error("Error fetching category job counts:", error);
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
  
      set({ savedJobs: response.data }); 
      console.log("Fetched saved jobs:", response.data);
  
    } catch (error: any) {
      console.error("Error fetching saved jobs:", error.response?.data || error.message);
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
  
      console.log("Saved job successfully:", res.data);
    } catch (error: any) {
      console.error("Error saving job:", error.response?.data || error.message);
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

      console.log("Deleted saved job:", res.data);
    } catch (error: any) {
      console.error("Error deleting saved job:", error.response?.data || error.message);
    }
    },
    getJobById: async (jobId : number) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found!");
    
        const res = await axios.get(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("Fetched job by ID:", res.data);
        return res.data;
      } catch (error: any) {
        console.error("Error fetching job by ID:", error.response?.data || error.message);
        throw error;
      }
    },
}));

