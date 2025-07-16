import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';
import { Grid, List, ArrowLeft, ArrowRight } from 'lucide-react';
import { useJobStore } from '@/reducers/JobListingReducerStore';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import './typewriter.css';

interface JobListProps {
  type?: 'all' | 'ai' | 'finance';
  title?: string;
  showFilter?: boolean;
}

const JobList = ({ type = 'all', title = 'All Jobs', showFilter = true }: JobListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const { fetchJobs, jobs, totalJobs, calculateTotalJobsCount, isLoading } = useJobStore();
  const [allAIJobs, setAllAIJobs] = useState<any[]>([]);
  const [aiJobsLoading, setAiJobsLoading] = useState(false);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE);

  const token = localStorage.getItem("token");

  const fetchAIJobs = async () => {
    try {
      setAiJobsLoading(true);
      const response = await fetch("https://jobgenius.bsite.net/api/JobListing/Recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error("Failed to fetch AI jobs");

      const data = await response.json();
      const jobs = data?.$values || data || [];

      if (Array.isArray(jobs)) {
        setAllAIJobs(jobs);
      } else {
        console.warn("Unexpected AI jobs response:", data);
        setAllAIJobs([]);
      }
    } catch (error) {
      console.error("Error fetching AI jobs:", error);
      setAllAIJobs([]);
    } finally {
      setAiJobsLoading(false);
    }
  };

  // Load jobs and total count on component mount or type change
  useEffect(() => {
    const loadJobs = async () => {
      if (type === 'ai') {
        await fetchAIJobs();
      } else {
        // Calculate total count first, then fetch first page
        await calculateTotalJobsCount();
        await fetchJobs(0); // Start with skip=0 (first page)
      }
    };
    loadJobs();
  }, [type]);

  // Fetch jobs when page changes (only for regular jobs, not AI)
  useEffect(() => {
    if (type !== 'ai') {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      fetchJobs(skip);
    }
  }, [currentPage, type]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 6) {
          pages.push(-1);
          pages.push(totalPages);
        } else if (totalPages === 6) {
          pages.push(6);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Get current jobs to display
  const getCurrentJobs = () => {
    if (type === 'ai') {
      // For AI jobs, use client-side pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return allAIJobs.slice(startIndex, endIndex);
    } else {
      // For regular jobs, use server-side pagination
      return Array.isArray(jobs) ? jobs : (jobs?.$values || []);
    }
  };

  // Get total count for display
  const getTotalCount = () => {
    if (type === 'ai') {
      return allAIJobs.length;
    } else {
      return totalJobs;
    }
  };

  // Get current total pages
  const getCurrentTotalPages = () => {
    if (type === 'ai') {
      return Math.ceil(allAIJobs.length / ITEMS_PER_PAGE);
    } else {
      return totalPages;
    }
  };

  const currentJobs = getCurrentJobs();
  const isCurrentlyLoading = type === 'ai' ? aiJobsLoading : isLoading;
  const currentTotalPages = getCurrentTotalPages();

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {title}
            <span className="text-sm font-normal text-gray-500 ml-2">
              Showing {currentJobs.length} of {getTotalCount()} results
            </span>
          </h2>
          
          {showFilter && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="mostRelevant">Most relevant</SelectItem>
                  <SelectItem value="highestPaid">Highest paid</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="hidden sm:flex items-center border rounded-md">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`rounded-none ${viewMode === 'grid' ? '' : 'text-gray-500'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`rounded-none ${viewMode === 'list' ? '' : 'text-gray-500'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isCurrentlyLoading && currentTotalPages >= 1 ? (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-1'}`}>
            {currentJobs.map((job) => (
              <JobCard 
                key={job.jobID || job.id} 
                {...job} 
                id={job.jobID || job.id} 
                categories={job.categories?.$values || job.categories || []} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="typewriter">
              <div className="slide"><i></i></div>
              <div className="paper"></div>
              <div className="keyboard"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading Jobs...</p>
          </div>
        )}

        {currentTotalPages > 1  && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((pageNum, index) => 
                pageNum === -1 ? (
                  <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                  <Button 
                    key={`page-${pageNum}`}
                    variant={currentPage === pageNum ? "default" : "outline"} 
                    size="sm" 
                    className="w-8 h-8 p-0"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              )}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextPage} 
                disabled={currentPage === currentTotalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobList;