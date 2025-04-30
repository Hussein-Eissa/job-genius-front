
import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JobDetailHeader from "@/components/jobs/JobDetailHeader";
import JobDescription from "@/components/jobs/JobDescription";
import JobBenefits from "@/components/jobs/JobBenefits";
import SimilarJobs from "@/components/jobs/SimilarJobs";
import JobApplicationForm from "@/components/jobs/JobApplicationForm";
import SuccessModal from "@/components/jobs/SuccessModal";
import { Dialog } from "@/components/ui/dialog";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // In a real app, you would fetch job details based on the id
  const job = {
    id: id || "1",
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    type: "Full-Time",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mauris tortor, egestas hendrerit tempus sit, fringilla at metus dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris rutilus a urna vitae mollis. See the article(https://www.example.com/#some-article-link).",
    responsibilities: [
      "Community engagement to ensure that is supported and actively represented online",
      "Focus on social media content development and publication",
      "Marketing and strategy support",
      "Stay on top of trends on social media platforms, and suggest content ideas to the team",
      "Engage with online communities"
    ],
    requirements: [
      "You get energy from people and building the ideal work environment",
      "You have a sense for beautiful scenes and office experiences",
      "You are a confident office manager, ready for added responsibilities",
      "You're detail-oriented and creative",
      "You're a growth marketer and know how to run campaigns"
    ],
    niceTohaves: [
      "Fluent in English",
      "Project management skills",
      "Copy writing skills"
    ],
    datePosted: "July 1, 2021",
    salary: "€714 - $858 USD",
    skills: ["Marketing", "Design"]
  };

  const handleApplyClick = () => {
    setIsApplicationOpen(true);
  };

  const handleApplicationSubmit = () => {
    setIsApplicationOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <JobDetailHeader 
          title={job.title}
          company={job.company}
          location={job.location}
          type={job.type}
        />
        
        <JobDescription 
          description={job.description}
          responsibilities={job.responsibilities}
          requirements={job.requirements}
          niceTohaves={job.niceTohaves}
          datePosted={job.datePosted}
          salary={job.salary}
          jobType={job.type}
          skills={job.skills}
          appliedCount={5}
          capacity={10}
        />
        
        <JobBenefits />
        
        <SimilarJobs />

        <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
          <JobApplicationForm 
            jobTitle={job.title}
            companyName={job.company}
            location={job.location}
            type={job.type}
            onSubmit={handleApplicationSubmit}
          />
        </Dialog>

        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <SuccessModal 
            title="Success! Your job application sent"
            subtitle="Good luck!"
            onClose={() => setIsSuccessOpen(false)}
          />
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
