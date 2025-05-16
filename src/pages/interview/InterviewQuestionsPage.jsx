import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const getQuestionsFromStorage = () => {
  const raw = localStorage.getItem("interviewQuestions") || "[]";
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
    return [];
  } catch {
    return [];
  }
};

const FEEDBACK_API = "https://499a-196-132-65-97.ngrok-free.app/evaluate-answers";

function parseFeedback(feedback) {
  if (!feedback || typeof feedback !== "string") return null;
  // Remove all '**' from the feedback string
  const clean = feedback.replace(/\*\*/g, "");
  // Split by section headers
  const sections = clean.split(/\d+\. /g).filter(Boolean);
  const result = {};
  sections.forEach((section) => {
    if (section.startsWith("Score/10:")) {
      result.score = section.replace("Score/10:", "").trim();
    } else if (section.startsWith("Top 2 Strengths:")) {
      result.strengths = section.replace("Top 2 Strengths:", "").trim();
    } else if (section.startsWith("Top 2 Improvement Areas:")) {
      result.improvements = section.replace("Top 2 Improvement Areas:", "").trim();
    } else if (section.startsWith("One Actionable Advice:")) {
      result.advice = section.replace("One Actionable Advice:", "").trim();
    }
  });
  return result;
}

const InterviewQuestionsPage = () => {
  const questions = getQuestionsFromStorage();
  const meta = JSON.parse(localStorage.getItem("interviewMeta") || "{}") || {};
  const numQuestions = questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(numQuestions).fill(""));
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6f8fa]">
        <Header isAuthenticated={true} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-lg text-gray-600">No interview session found. Please start a new interview.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAnswer = (val) => {
    const newAnswers = [...answers];
    newAnswers[current] = val;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < numQuestions - 1) {
      setCurrent(current + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const handleSkip = () => {
    handleAnswer("");
    handleNext();
  };

  // Demo feedbacks (replace with real feedback if available)
  const feedbacks = questions.map((q, i) => ({
    question: q.question || q.text || q || `Question ${i + 1}`,
    feedback: `Your answer for this question was received. Here's some feedback and suggestions for improvement.`,
  }));

  const handleSendFeedbacks = async () => {
    setFeedbackLoading(true);
    setFeedbackError("");
    setFeedbackResult(null);
    try {
      const qa = questions.map((q, i) => ({
        question: q.question || q.text || q || `Question ${i + 1}`,
        answer: answers[i] || "(skipped)"
      }));
      const res = await fetch(FEEDBACK_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qa }),
      });
      if (!res.ok) throw new Error("Failed to get feedback from API");
      const data = await res.json();
      setFeedbackResult(data.evaluation);
      
    } catch (err) {
      setFeedbackError(err.message || "Failed to get feedback from API");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const parsedFeedback = feedbackResult ? parseFeedback(feedbackResult) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa]">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-2 text-jobblue">Simulate Your <span className="text-blue-600">Interview</span></h1>
          {!showFeedback && (
            <>
              <div className="flex items-center gap-2 mb-6">
                {[...Array(numQuestions)].map((_, i) => (
                  <span key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-bold border-2 ${i === current ? "bg-jobblue text-white border-jobblue" : "bg-white text-jobblue border-jobblue/30"}`}>{i + 1}</span>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow p-8 mb-6">
                <div className="text-lg font-semibold mb-4">{questions[current].question || questions[current].text || questions[current] || `Question ${current + 1}`}</div>
                <textarea
                  className="w-full border rounded p-3 min-h-[120px] mb-2"
                  placeholder="write your answer here...."
                  maxLength={500}
                  value={answers[current]}
                  onChange={e => handleAnswer(e.target.value)}
                />
                <div className="text-xs text-gray-500 mb-2">Maximum 500 characters</div>
                <div className="flex gap-4 justify-end">
                  <button
                    className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    onClick={handleSkip}
                    type="button"
                  >
                    Skip Question
                  </button>
                  <button
                    className="bg-jobblue text-white px-6 py-2 rounded-md hover:bg-jobblue-dark transition-colors"
                    onClick={handleNext}
                    type="button"
                  >
                    {current === numQuestions - 1 ? "Finish" : "Next Question"}
                  </button>
                </div>
              </div>
            </>
          )}
          {showFeedback && (
            <div>
              <div className="text-2xl font-bold text-jobblue mb-4">Great Work!, Let's Discuss some Feedbacks!</div>
              <div className="space-y-6">
                {feedbacks.map((fb, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4">
                    <div className="font-bold text-jobblue mb-1">{i + 1}. {fb.question}</div>
                    <div className="text-gray-700 mb-2">{fb.feedback}</div>
                    <div className="text-sm text-gray-500">Your answer: <span className="italic">{answers[i] || <span className="text-gray-400">(skipped)</span>}</span></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center mt-8">
                <button
                  className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  onClick={handleSendFeedbacks}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? "Loading..." : "Show Feedbacks"}
                </button>
                <Link to={"/interview"}>
                  <button className="bg-jobblue text-white px-6 py-2 rounded-md hover:bg-jobblue-dark transition-colors" >Enter Interview Again</button>
                </Link>
              </div>
              {feedbackError && <div className="text-red-500 text-center mt-4">{feedbackError}</div>}
              {feedbackResult && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-jobblue">AI Feedback</h3>
                  {parsedFeedback ? (
                    <div className="space-y-4">
                      {parsedFeedback.score && (
                        <div>
                          <div className="font-bold text-jobblue">Score:</div>
                          <div className="text-lg">{parsedFeedback.score}</div>
                        </div>
                      )}
                      {parsedFeedback.strengths && (
                        <div>
                          <div className="font-bold text-jobblue">Top 2 Strengths:</div>
                          <ul className="list-disc ml-6 text-gray-800">
                            {parsedFeedback.strengths.split(/\n|\r/).map((s, i) => s.trim() && <li key={i}>{s.trim().replace(/^\*+\s*/, "")}</li>)}
                          </ul>
                        </div>
                      )}
                      {parsedFeedback.improvements && (
                        <div>
                          <div className="font-bold text-jobblue">Top 2 Improvement Areas:</div>
                          <ul className="list-disc ml-6 text-gray-800">
                            {parsedFeedback.improvements.split(/\n|\r/).map((s, i) => s.trim() && <li key={i}>{s.trim().replace(/^\*+\s*/, "")}</li>)}
                          </ul>
                        </div>
                      )}
                      {parsedFeedback.advice && (
                        <div>
                          <div className="font-bold text-jobblue">One Actionable Advice:</div>
                          <div className="text-gray-800 whitespace-pre-line">{parsedFeedback.advice}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="bg-white rounded p-4 text-sm overflow-x-auto border border-gray-200">{typeof feedbackResult === 'string' ? feedbackResult : JSON.stringify(feedbackResult, null, 2)}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InterviewQuestionsPage;
