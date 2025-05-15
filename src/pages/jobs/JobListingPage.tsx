import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobList from "@/components/jobs/JobList";
import { CheckSquare } from "lucide-react";
import {useJobStore} from '@/reducers/JobListingReducerStore';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const JobListingPage = () => {
  const navigate = useNavigate();
  const [fiterProps , setFilterProps] = useState({
    salaryTo: null,
    salaryFrom: null,
    city: '',
    country: '',
    type: '',
    keyword: ''
  })
  const handleTryNow = () => {
    navigate("/jobs/search", { state: { triggerAI: true } });
  };

  const employmentTypes = [
    { id: 'ft', label: 'Full-Time', count: 3  },
    { id: 'pt', label: 'Part-Time', count: 5  },
    { id: 'remote', label: 'Remote', count: 2  },
    { id: 'intern', label: 'Internship', count: 24  },
    { id: 'contract', label: 'Contract', count: 3  },
  ];

  const categories = [
    { id: 'design', label: 'Design', count: 24 , val: 'Design' },
    { id: 'sales', label: 'Sales', count: 3 , val: 'Sales' },
    { id: 'marketing', label: 'Marketing', count: 3 , val: 'Marketing' },
    { id: 'business', label: 'Business', count: 3 , val: 'Business' },
    { id: 'hr', label: 'Human Resource', count: 6 , val: 'Human Resource' },
    { id: 'finance', label: 'Finance', count: 4 , val: 'Finance' },
    { id: 'engineering', label: 'Engineering', count: 4 , val: 'Engineering' },
    { id: 'technology', label: 'Technology', count: 5 , val: 'Technology' },
  ];

  const salaryRanges = [
    { id: 'range1', label: '$100 - $1000', count: 4 },
    { id: 'range2', label: '$100 - $1500', count: 6 },
    { id: 'range3', label: '$1500 - $2000', count: 10 },
    { id: 'range4', label: '$3000 or above', count: 4 },
  ];

  const {searchJobs , filterJobs , jobs , categoriesWithCount ,fetchCategoriesWithCount} = useJobStore();
  const [searchTerm, setSearchTerm] = useState({keyword: "", location: ""});
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    fetchCategoriesWithCount();
    console.log("Categories With Count :",categoriesWithCount);
  }, [])

  const SearchHandler = async () => {
    setSearchError("");
    setSearchLoading(true);
    const [city, country] = searchTerm.location.split(',').map(str => str.trim());
    try {
      await searchJobs(searchTerm.keyword, country, city);
    } catch (err) {
      setSearchError("Failed to search jobs. Please try again.");
    }
    setSearchLoading(false);
  }

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value });
  }
  const FilterGroup = ({ title, items }: { title: string, items: { id: number | string, label: string, count: number  }}) => (
    <div className="mb-6">
      <h3 className="font-medium text-gray-800 mb-3 flex items-center justify-between">
        {title}
        <CheckSquare size={18} className="text-jobblue" />
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center">
            <input
              onChange={(e) => setFilterProps({ ...fiterProps, type: e.target.value })}
              type="checkbox"
              id={item.id}
              value={item.val}
              className="rounded border-gray-300 text-jobblue focus:ring-jobblue"
            />
            <label htmlFor={item.id} className="ml-2 text-gray-600 text-sm flex-1">
              {item.label}
            </label>
            <span className="text-gray-400 text-xs">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white">
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Your Next Job, Just a <span className="text-jobblue">Click Away</span>
            </h1>
            <p className="text-gray-600 mb-8">Find Your Next Role at Companies You Admire</p>
            
            <div className="bg-white p-3 rounded-lg shadow-sm flex items-center space-x-4">
              <div className="relative flex-1">
                <input
                  name="keyword"
                  type="text"
                  placeholder="Job title or keyword"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border-gray-200 focus:border-jobblue focus:ring-jobblue"
                  onChange={inputChangeHandler}
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
              </div>
              
              <div className="relative flex-1">
                <input
                  name="location"
                  type="text"
                  placeholder="Cairo, Egypt"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border-gray-200 focus:border-jobblue focus:ring-jobblue"
                  onChange={inputChangeHandler}
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span className="absolute right-3 top-3 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              
              <button className="bg-jobblue text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition flex items-center justify-center min-w-[100px]" onClick={SearchHandler} disabled={searchLoading}>
                {searchLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-jobblue rounded-full"></span> : "Search"}
              </button>
            </div>
            {searchError && <div className="text-red-500 mt-2">{searchError}</div>}
            <div className="mt-4 text-sm">
              <span className="text-gray-600">Popular: </span>
              <span className="text-gray-800">UI Designer, UX Researcher, Admin, Graphic Designer</span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">or</p>
              <h2 className="text-2xl font-bold mb-4">Let <span className="text-jobblue">JobGenius</span> AI Find Your Perfect Job Fit</h2>
              <button className="bg-jobblue text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition" onClick={handleTryNow}>
                Try Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <FilterGroup title="Type of Employment" items={employmentTypes} />
                <FilterGroup title="Categories" items={categories} />
                <FilterGroup title="Salary Range" items ={salaryRanges} />
              </div>
              <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-lg font-medium mb-2">
                  Are you a stakeholder or employer? <span className="text-jobblue">Post your job now!</span>
                </p>
                <Button className="mt-2">Add Your Job</Button>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <JobList />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobListingPage;
