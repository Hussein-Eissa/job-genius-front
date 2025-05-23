import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResumeUploader from "@/components/resume/ResumeUploader";
import ResumeRecommendations from "@/components/resume/ResumeRecommendations";

const ResumePage = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [score, setScore] = useState(0);

  const handleUpload = async (fileName, file) => {
    if (jobDescription.trim().length >= 20) {
      try {
        const formData = new FormData();
        formData.append("resume_file", file);
        formData.append("job_description", jobDescription);
  
        const response = await fetch("https://b4c8-102-45-207-229.ngrok-free.app/score", {
          method: "POST",
          body: formData,
          redirect: "follow"
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        const data = await response.json();
        console.log(data);
        setResumeFileName(fileName);
        setRecommendations(Object.entries(data.feedback || {}));
        setScore(data.score || 0);
        setUploadSuccess(true);
        setOpen(true);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
              Resume <span className="text-jobblue">Analyzer</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Upload your resume to get personalized feedback and recommendations to improve your chances of landing your dream job.
            </p>

            {!uploadSuccess ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
                <ResumeUploader
                  onUpload={(fileName, file) => handleUpload(fileName, file)}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Resume Successfully Uploaded</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {resumeFileName} has been uploaded and analyzed.
                </p>
                <Button
                  className="bg-jobblue hover:bg-jobblue-dark"
                  onClick={() => {
                    setUploadSuccess(false);
                    setResumeFileName("");
                    setJobDescription("");
                    setRecommendations([]);
                    setScore(0);
                  }}
                >
                  Upload Another Resume
                </Button>
              </div>
            )}

            {uploadSuccess && <ResumeRecommendations recommendations={recommendations} score={score} />}
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resume Uploaded Successfully</DialogTitle>
            <DialogDescription>
              Your resume has been uploaded and analyzed with a match score of <span className="font-bold">{score}%</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {recommendations.slice(0, 3).map(([category, content], idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className={`p-1 rounded-full mt-1 ${content.includes("Missing") ? "bg-red-100" : "bg-green-100"}`}>
                  {content.includes("Missing") ? (
                    <Check className="h-4 w-4 text-red-600" />
                  ) : (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-xs text-gray-600">{content}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              View Detailed Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumePage;