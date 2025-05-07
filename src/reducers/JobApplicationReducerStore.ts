import { create } from 'zustand';
import axios from 'axios';

export interface JobBenefit {
    title: string;
    description: string;
  }
  
  export interface JobListing {
    jobID: number;
    userID: number;
    fullname: string;
    email: string;
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
    applicationSent: number;
    applyBefore: string;
    jobPostedOn: string;
    salaryFrom: number;
    salaryTo: number;
    companyWebsite: string | null;
    keywords: string;
    additionalInformation: string | null;
    companyPapers: string | null;
    categories: { $values: string[] };
    skills: { $values: string[] };
    jobBenefits: { $values: JobBenefit[] };
    jobApplications: null;
  }
  
  export interface JobApplication {
    applicationID: number;
    userID: number;
    fullname: string;
    email: string;
    phone: string;
    currentJob: string;
    linkedInLink: string;
    portfolioLink: string;
    additionalInformation: string;
    resumeFile: string | null;
    appliedDate: string;
    status: string;
    jobListing: JobListing;
  }
  
  export interface JobApplicationResponse {
    success: boolean;
    message: string;
    addedApplication: JobApplication;
  }
  interface JobApplicationState {
    applications: JobApplication[];
    error?: string;
    submitJobApplication: (data: {
      jobID: number;
      fullname: string;
      email: string;
      phone: string;
      currentJob: string;
      linkedInLink: string;
      portfolioLink: string;
      additionalInformation: string;
      resumeFile?: File;
    }) => Promise<void>;
    fetchUserApplications: () => Promise<void>;
  }
export const useJobApplicationStore = create<JobApplicationState>((set) => ({
  applications: [],
  error: undefined,

  submitJobApplication: async ({
    jobID,
    fullname,
    email,
    phone,
    currentJob,
    linkedInLink,
    portfolioLink,
    additionalInformation,
    resumeFile,
  }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('JobID', jobID.toString());
      formData.append('Fullname', fullname);
      formData.append('Email', email);
      formData.append('Phone', phone);
      formData.append('CurrentJob', currentJob);
      formData.append('LinkedInLink', linkedInLink);
      formData.append('PortfolioLink', portfolioLink);
      formData.append('AdditionalInformation', additionalInformation);
      if (resumeFile) {
        formData.append('ResumeFile', resumeFile);
      }

      const response = await axios.post<JobApplicationResponse>(
        'https://jobgenius.bsite.net/api/JobApplication',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            accept: '*/*',
          },
        }
      );

      set((state) => ({
        applications: [...state.applications, response.data.addedApplication],
        error: undefined,
      }));
    } catch (err) {
      console.error('Error submitting job application:', err);
      set({ error: 'Failed to submit job application. Please try again.' });
    }
  },

  fetchUserApplications: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ $values: JobApplication[] }>(
        `https://jobgenius.bsite.net/api/JobApplication`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ applications: response.data.$values, error: undefined });
    } catch (err) {
      console.error('Error fetching job applications:', err);
      set({ error: 'Failed to fetch job applications. Check your connection or login status.' });
    }
  },

}));