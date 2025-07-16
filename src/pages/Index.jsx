
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ResumeSection from "@/components/home/ResumeSection";
import InterviewSection from "@/components/home/InterviewSection";

import { useJobStore } from "@/reducers/JobListingReducerStore";
import { useEffect } from "react";



const Index = () => {
  const { calculateTotalJobsCount } = useJobStore();
  
  useEffect(() => { 
    const calcjobs = async () => {
      await calculateTotalJobsCount() 
      console.log("Total jobs count calculated in Index page");
    }
    calcjobs();
    console.log("Index page loaded");
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <ResumeSection />
        <InterviewSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
