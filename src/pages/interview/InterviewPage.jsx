import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://499a-196-132-65-97.ngrok-free.app/generate-questions";

const jobTitles = [
  "Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "Software Engineer",
  "DevOps Engineer",
  "Back-end Developer",
  "Front-end Developer",
  "Full-Stack Developer",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "Graphic Designer",
];

const Levels = [
  "Junior",
  "Mid-Level",
  "Senior",
];

const focusAreas = [
  "Technical Skills",
  "Soft Skills",
  "Mixed",
];

const icons = [
  "/lovable-uploads/Images/icon-park-outline_necktie.svg",
  "/lovable-uploads/Images/carbon_skill-level.svg",
  "/lovable-uploads/Images/mingcute_target-line.svg",
  "/lovable-uploads/Images/lsicon_number-filled.svg",
  "/lovable-uploads/Images/mingcute_ai-line.svg",
];

const InterviewPage = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [level, setlevel] = useState("");
  const [experience, setExperience] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !level || !experience) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: jobTitle,
          level: level,
          experience: experience,
          num_questions: numQuestions,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate questions");
      const data = await res.json();
      console.log(data);
      const questionsArray = Array.isArray(data) ? data : (Array.isArray(data.questions) ? data.questions : []);
      if (!Array.isArray(questionsArray) || questionsArray.length === 0) throw new Error("Invalid response from API");
      localStorage.setItem("interviewQuestions", JSON.stringify(questionsArray));
      localStorage.setItem("interviewMeta", JSON.stringify({ jobTitle, level, experience, numQuestions }));
      setLoading(false);
      navigate("/interview-questions");
    } catch (err) {
      setError(err.message || "Error generating questions");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa]">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-2 text-jobblue">Simulate Your <span className="text-blue-600">Interview</span></h1>
          <a href="#how" className="text-lg text-blue-500 font-semibold mb-6 block">How it works</a>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <img src={icons[0]} alt="Job Title" className="w-7 h-7 mt-1" />
                <div>
                  <b>Select Your Job Title</b>
                  <p className="text-gray-600">Choose the role you're preparing the interview for (e.g., Software Engineer, Product Manager).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img src={icons[1]} alt="Experience" className="w-7 h-7 mt-1" />
                <div>
                  <b>Select Your Experience Level</b>
                  <p className="text-gray-600">Pick the seniority level to tailor question difficulty (e.g., Entry, Mid, Senior, Lead...).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img src={icons[2]} alt="Experience Area" className="w-7 h-7 mt-1" />
                <div>
                  <b>Describe Your Experience</b>
                  <p className="text-gray-600">Briefly describe your experience relevant to this role (e.g., 'I have 1 year of experience working with Python and machine learning.').</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img src={icons[3]} alt="Number of Questions" className="w-7 h-7 mt-1" />
                <div>
                  <b>Select Number of Questions</b>
                  <p className="text-gray-600">Choose how many questions you'd like the interview to include.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <img src={icons[4]} alt="AI" className="w-7 h-7 mt-1" />
                <div>
                  <b>Let JobGenius Smart AI Prepare You for the Interview</b>
                  <p className="text-gray-600">Get tailored questions based on your role, experience, and skill focus.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/lovable-uploads/Images/image 4.png" alt="Interview Illustration" className="max-w-xs w-full" />
            </div>
          </div>

          <div className="border-t border-gray-200 my-10"></div>

          <h2 className="text-2xl font-bold mb-6 text-jobblue">JobGenius <span className="text-gray-800">AI Interview Simulator</span></h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Job Title (required)</label>
                <select value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="">Please Choose</option>
                  {jobTitles.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Level (required)</label>
                <select value={level} onChange={e => setlevel(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="">Please Choose</option>
                  {Levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Experience Area (required)</label>
                <input
                  type="text"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="E.g. I have 1 year of experience working with Python and machine learning."
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Number of Questions (optional)</label>
                <input type="range" min={1} max={10} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs mt-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className={numQuestions===n?"font-bold text-jobblue":""}>{n}</span>)}
                </div>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button type="submit" className="bg-jobblue text-white px-6 py-2 rounded-md hover:bg-jobblue-dark transition-colors w-full max-w-xs mx-auto block">Begin Interview</button>
          </form>
        </div>
      </main>
      <Footer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md w-full">
            <img src="/lovable-uploads/Images/Logo.svg" alt="JobGenius Logo" className="h-10 mb-4" />
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span role="img" aria-label="sparkles">
                <img src="/lovable-uploads/Images/mingcute_ai-line.svg" className="h-6" />
              </span> Generating your Interview Questions
            </h2>
            <div className="my-6"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jobblue"></div></div>
            <button
              className="mt-4 px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
              onClick={() => setLoading(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
