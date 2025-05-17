// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ResumeRecommendations = ({ recommendations = [], score = 0 }) => {
  // Function to determine the color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to determine the status icon based on feedback content
  const getFeedbackIcon = (content) => {
    if (content.includes("All") || content.includes("meet")) {
      return <Check className="h-5 w-5 text-green-600" />;
    } else if (content.includes("Missing") || content.includes("lacks")) {
      return <X className="h-5 w-5 text-red-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">
          JobGenius <span className="text-jobblue">AI Analysis</span>
        </h2>
      </div>
      
      {/* Score Display */}
      <div className="mb-8 flex items-center">
        <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center relative">
          <div className={`text-4xl p-4 font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="absolute bottom-0 text-sm font-medium text-gray-500">Match Score</div>
        </div>
        <div className="ml-8">
          <h3 className="text-xl font-semibold mb-2">Resume Match Score</h3>
          <p className="text-gray-600">
            Your resume has a {score}% match with the job description. 
            {score >= 80 ? (
              <span className="text-green-600"> Great job! You're a strong candidate.</span>
            ) : score >= 60 ? (
              <span className="text-yellow-600"> You have a good chance, but could improve in some areas.</span>
            ) : (
              <span className="text-red-600"> Consider addressing the gaps to improve your chances.</span>
            )}
          </p>
        </div>
      </div>

      {/* Feedback Display */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Detailed Feedback</h3>
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map(([category, content], index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-jobblue">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-gray-100">
                    {getFeedbackIcon(content)}
                  </div>
                  <h4 className="font-bold text-lg">{category}</h4>
                </div>
                <p className="mt-2 text-gray-600 ml-9">{content}</p>
              </div>
            ))
          ) : (
            <p>No recommendations available yet.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link to="/interview">
          <Button className="bg-jobblue hover:bg-jobblue-dark">
            Try Interview Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResumeRecommendations;