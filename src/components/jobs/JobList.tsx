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
  const { fetchJobs, jobs } = useJobStore();
  const [slicedJobs, setSlicedJobs] = useState<any>([]);
  const [allAIJobs, setAllAIJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const ITEMS_PER_PAGE = 10;
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const fetchAIJobs = async () => {
    try {
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
      const jobs = data?.$values;

      if (Array.isArray(jobs)) {
        setAllAIJobs(jobs);
      } else {
        console.warn("Unexpected AI jobs response:", data);
        setAllAIJobs([]);
      }
    } catch (error) {
      console.error("Error fetching AI jobs:", error);
      setAllAIJobs([]);
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      if (type === 'ai') {
        await fetchAIJobs();
      } else {
        await fetchJobs();
      }
      setIsLoading(false);
    };
    loadJobs();
  }, [type]);

  useEffect(() => {
    let totalItems = 0;
    let sourceJobs: any[] = [];

    if (type === 'ai') {
      sourceJobs = allAIJobs;
    } else if (Array.isArray(jobs)) {
      sourceJobs = jobs;
    } else if (jobs?.$values && Array.isArray(jobs.$values)) {
      sourceJobs = jobs.$values;
    }

    totalItems = sourceJobs.length;
    const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    setTotalPages(pages > 0 ? pages : 1);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    setSlicedJobs(sourceJobs.slice(startIndex, endIndex));
  }, [jobs, allAIJobs, currentPage, type]);

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

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {title}
            <span className="text-sm font-normal text-gray-500 ml-2">
              Showing {slicedJobs.length} results
            </span>
          </h2>
          
          {showFilter && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select defaultValue="mostRelevant">
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mostRelevant">Most relevant</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="typewriter">
              <div className="slide"><i></i></div>
              <div className="paper"></div>
              <div className="keyboard"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading Jobs...</p>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-1'}`}>
            {slicedJobs.map((job) => (
              <JobCard key={job.jobID || job.id} {...job} id={job.jobID || job.id} categories={job.categories?.$values || job.categories || []} />
            ))}
          </div>
        )}

        {totalPages > 1 && !isLoading && (
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
                disabled={currentPage === totalPages}
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
