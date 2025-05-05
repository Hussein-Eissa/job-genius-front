
import { useState  , useEffect } from 'react';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';
import { Grid, List, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import {useJobStore} from '@/reducers/JobListingReducerStore';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const companyLogos = {
  nomad: <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white">N</div>,
  dropbox: <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">DB</div>,
  terraform: <div className="w-full h-full bg-cyan-500 flex items-center justify-center text-white">TF</div>,
  recruit: <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white">RC</div>,
  canva: <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white">CA</div>,
  classpass: <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">CP</div>,
  pitch: <div className="w-full h-full bg-black flex items-center justify-center text-white">PI</div>,
  stripe: <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white">S</div>,
  truebill: <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">TB</div>,
  square: <div className="w-full h-full bg-black flex items-center justify-center text-white">SQ</div>,
  coinbase: <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">CB</div>,
  robinhood: <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black">RH</div>,
  kraken: <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white">KR</div>,
};

const jobs = [
  {
    id: '1',
    logo: companyLogos.nomad,
    title: 'Social Media Assistant',
    company: 'Nomad',
    location: 'Paris, France',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '2',
    logo: companyLogos.dropbox,
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '3',
    logo: companyLogos.terraform,
    title: 'Interactive Developer',
    company: 'Terraform',
    location: 'Hamburg, Germany',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 2,
    capacity: 10
  },
  {
    id: '4',
    logo: companyLogos.recruit,
    title: 'Email Marketing',
    company: 'Recruit',
    location: 'Madrid, Spain',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '5',
    logo: companyLogos.canva,
    title: 'Lead Engineer',
    company: 'Canva',
    location: 'Ankara, Turkey',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '6',
    logo: companyLogos.classpass,
    title: 'Product Designer',
    company: 'ClassPass',
    location: 'Berlin, Germany',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '7',
    logo: companyLogos.pitch,
    title: 'Customer Manager',
    company: 'Pitch',
    location: 'Berlin, Germany',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
  {
    id: '8',
    logo: companyLogos.stripe,
    title: 'Social Media Assistant',
    company: 'Stripe',
    location: 'Paris, France',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    applied: 5,
    capacity: 10
  },
];

const financeJobs = [
  {
    id: '9',
    logo: companyLogos.stripe,
    title: 'Finance Manager',
    company: 'Stripe',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    categories: ['Business', 'Payment gateway'],
  },
  {
    id: '10',
    logo: companyLogos.truebill,
    title: 'Financial Analyst',
    company: 'Truebill',
    location: 'New York, USA',
    type: 'Full-Time',
    categories: ['Business'],
  },
  {
    id: '11',
    logo: companyLogos.square,
    title: 'Payments Specialist',
    company: 'Square',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    categories: ['Business', 'Blockchain'],
  },
  {
    id: '12',
    logo: companyLogos.coinbase,
    title: 'Crypto Analyst',
    company: 'Coinbase',
    location: 'Remote',
    type: 'Full-Time',
    categories: ['Business', 'Blockchain'],
  },
  {
    id: '13',
    logo: companyLogos.robinhood,
    title: 'Investment Specialist',
    company: 'Robinhood',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    categories: ['Business'],
  },
  {
    id: '14',
    logo: companyLogos.kraken,
    title: 'Trading Analyst',
    company: 'Kraken',
    location: 'San Francisco, USA',
    type: 'Full-Time',
    categories: ['Business', 'Blockchain'],
  },
];

interface JobListProps {
  type?: 'all' | 'ai' | 'finance';
  title?: string;
  showFilter?: boolean;
}

const JobList = ({ type = 'all', title = 'All Jobs', showFilter = true }: JobListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs: fetchedJobs, fetchJobs } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  const jobsToShow =
    type === 'finance' ? financeJobs :
    type === 'ai' ? jobs.slice(0, 2) :
    fetchedJobs.length ? fetchedJobs : jobs;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {title}
            {type !== 'ai' && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                Showing {jobsToShow.length} results
              </span>
            )}
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

        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-1'}`}>
          {jobsToShow.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {type === 'all' && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled={currentPage === 1}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant={currentPage === 1 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">1</Button>
              <Button variant={currentPage === 2 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">2</Button>
              <Button variant={currentPage === 3 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">3</Button>
              <Button variant={currentPage === 4 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">4</Button>
              <Button variant={currentPage === 5 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">5</Button>
              <span className="px-2">...</span>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">33</Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {type === 'ai' && (
          <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-lg font-medium mb-2">
              Are you a stakeholder or employer? <span className="text-jobblue">Post your job now!</span>
            </p>
            <Button className="mt-2">Add Your Job</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobList;
