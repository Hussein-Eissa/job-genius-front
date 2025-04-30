
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ResumeUploader from "@/components/resume/ResumeUploader";
import ResumeRecommendations from "@/components/resume/ResumeRecommendations";
import LogoIcon from "@/components/common/LogoIcon";

const ResumePage = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = (name: string) => {
    setFileName(name);
    setIsUploaded(true);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">
            Upload Your <span className="text-jobblue">Resume:</span>
          </h1>

          {!isUploaded ? (
            <ResumeUploader onUpload={handleUpload} />
          ) : (
            <>
              <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center mb-8">
                <div className="text-jobblue mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="text-xl text-jobblue font-semibold">{fileName}</p>
              </div>
              <div className="flex justify-center">
                <Button
                  className="bg-jobblue hover:bg-jobblue-dark text-white px-10"
                  onClick={handleAnalyze}
                >
                  Try it Now
                </Button>
              </div>
            </>
          )}

          {isUploaded && <ResumeRecommendations />}
        </div>

        <Dialog open={isAnalyzing} onOpenChange={setIsAnalyzing}>
          <DialogContent className="max-w-md p-6 text-center" hideCloseButton>
            <div className="mb-6 mt-4">
              <div className="flex justify-center mb-6">
                <div className="h-12 w-12 bg-[#193549] rounded-md flex items-center justify-center text-white font-bold">
                  <LogoIcon className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-4">
                Analyzing your Resume <span className="text-jobblue">✨</span>
              </h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobblue"></div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default ResumePage;
