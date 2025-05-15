
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ResumeHowItWorksPage = () => {

  return (
    <div className=" flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="container mx-auto px-10 py-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-10">How it works</h2>
          
          <div className="grid md:grid-cols-2 gap-10 mb-0">
            <div className="space-y-12">
              <div className="flex gap-4">
                <div className="text-jobblue flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <div>
                  <h3 className="font-semibold text-lg text-jobblue">Upload Your Resume</h3>
                  <p className="text-gray-600">Upload your resume in PDF or DOCX format for AI analysis.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-jobblue flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-jobblue">AI Analysis</h3>
                  <p className="text-gray-600">The tool evaluates keywords, formatting, and content for ATS compatibility.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-jobblue flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-jobblue">Personalized Insights</h3>
                  <p className="text-gray-600">Get an ATS score, keyword suggestions, and formatting tips to enhance readability and impact.</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <img
                src="/lovable-uploads/Images/image 3.png"
                alt="Resume Analysis Tool"
                className="max-w-full h-auto"
              />
            </div>
          </div>
          <div className="m-0 w-full flex align-center justify-center">
            <Link to="/resume">
              <Button className="bg-jobblue hover:bg-jobblue-dark text-white w-full h-12 text-lg">
                Try it Now!
              </Button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeHowItWorksPage;
