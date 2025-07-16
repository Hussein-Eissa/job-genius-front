
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobList from "@/components/jobs/JobList";
import { Dialog } from "@/components/ui/dialog";
import { AIInfoModal, AILoadingModal } from "@/components/jobs/AIModal";
import SuccessModal from "@/components/jobs/SuccessModal";
import { useLocation } from "react-router-dom";
import {useJobStore} from '@/reducers/JobListingReducerStore';

const JobSearchPage = () => {
  const location = useLocation();
  const triggerAI = location.state?.triggerAI;


  const [isAIInfoOpen, setIsAIInfoOpen] = useState(true);
  const [isAILoadingOpen, setIsAILoadingOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showAIResults, setShowAIResults] = useState(false);

  const handleTryNow = () => {
    setIsAIInfoOpen(true);
  };

  const handleGetSuggestions = () => {
    setIsAIInfoOpen(false);
    setIsAILoadingOpen(true);

    // Simulate loading time
    setTimeout(() => {
      setIsAILoadingOpen(false);
      setShowAIResults(true);
    }, 2000);
  };

  useEffect(() => {
    if (triggerAI) {
      handleTryNow();
    }
  }, [triggerAI]);

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-8">
        {showAIResults ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              JobGenius <span className="text-jobblue">AI:</span> Smart Job Suggestions Just <span className="text-jobblue">for You!</span>
            </h2>
            <JobList type="ai" title="" showFilter={false} />
          </>
        ) : null}
      </div>
      
      <Dialog open={isAIInfoOpen} onOpenChange={setIsAIInfoOpen}>
        <AIInfoModal onSubmit={handleGetSuggestions} />
      </Dialog>

      <Dialog open={isAILoadingOpen} onOpenChange={setIsAILoadingOpen}>
        <AILoadingModal />
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <SuccessModal 
          title="Success! Your job Request sent."
          subtitle="We will be in touch soon!"
          onClose={() => setIsSuccessOpen(false)}
        />
      </Dialog>

    </div>
  );
};

export default JobSearchPage;
