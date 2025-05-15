import { Button } from "@/components/ui/button";

const ResumeRecommendations = ({ recommendations = [] }) => {
  return (
    <div className="mt-16">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">
          JobGenius <span className="text-jobblue">AI Recommendations:</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div key={index} className="flex gap-2">
                <span className="font-bold">{index + 1}.</span>
                <p>{rec}</p>
              </div>
            ))
          ) : (
            <p>No recommendations available yet.</p>
          )}
        </div>

        <div className="flex justify-center">
          <img
            src="/lovable-uploads/Images/vector 1.png"
            alt="Resume Analysis Visualization"
            className="max-h-64"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeRecommendations;
