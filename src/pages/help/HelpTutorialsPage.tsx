
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HelpTutorialsPage = () => {
  const tutorials = {
    beginner: [
      {
        title: "Creating Your Account",
        description: "Learn how to sign up and set up your JobGenius account in just a few minutes.",
        duration: "2:15",
        thumbnail: "/lovable-uploads/765c0a81-b40b-48c7-a075-956aad70d353.png"
      },
      {
        title: "Building Your Profile",
        description: "Complete your professional profile to get noticed by employers.",
        duration: "4:30",
        thumbnail: "/lovable-uploads/5e2664dc-d649-41e6-a3ee-46ea7fcf31e2.png"
      },
      {
        title: "Uploading Your Resume",
        description: "Upload your resume and get AI-powered recommendations to improve it.",
        duration: "3:45",
        thumbnail: "/lovable-uploads/d8908e87-c3d8-4f2e-a2dc-194b66e63698.png"
      },
      {
        title: "Job Search Basics",
        description: "Learn how to effectively search for jobs that match your skills and preferences.",
        duration: "5:20",
        thumbnail: "/lovable-uploads/a479d8e5-e6f0-427b-8290-941c6a5c547e.png"
      }
    ],
    intermediate: [
      {
        title: "Advanced Resume Analysis",
        description: "Get deeper insights into how to optimize your resume for specific job positions.",
        duration: "8:10",
        thumbnail: "/lovable-uploads/d8908e87-c3d8-4f2e-a2dc-194b66e63698.png"
      },
      {
        title: "Interview Preparation Tools",
        description: "Practice with our AI interview coach and get feedback on your responses.",
        duration: "7:45",
        thumbnail: "/lovable-uploads/c4738e71-085a-49a6-aabc-c96796f5844b.png"
      },
      {
        title: "Setting Up Job Alerts",
        description: "Configure custom job alerts to stay updated on new opportunities.",
        duration: "4:20",
        thumbnail: "/lovable-uploads/a479d8e5-e6f0-427b-8290-941c6a5c547e.png"
      },
      {
        title: "Tracking Job Applications",
        description: "Monitor the status of your job applications and follow up effectively.",
        duration: "6:15",
        thumbnail: "/lovable-uploads/20d8aaa5-2fa3-4481-a3bb-826b51c24771.png"
      }
    ],
    advanced: [
      {
        title: "Customizing Cover Letters with AI",
        description: "Use our AI tools to generate tailored cover letters for each job application.",
        duration: "9:30",
        thumbnail: "/lovable-uploads/d8908e87-c3d8-4f2e-a2dc-194b66e63698.png"
      },
      {
        title: "Analytics and Insights",
        description: "Understand your application performance and optimize your job search strategy.",
        duration: "8:15",
        thumbnail: "/lovable-uploads/a479d8e5-e6f0-427b-8290-941c6a5c547e.png"
      },
      {
        title: "Networking Strategies",
        description: "Leverage JobGenius to expand your professional network and find opportunities.",
        duration: "10:20",
        thumbnail: "/lovable-uploads/5e2664dc-d649-41e6-a3ee-46ea7fcf31e2.png"
      },
      {
        title: "Premium Features",
        description: "Get the most out of your JobGenius premium subscription with these tips.",
        duration: "7:45",
        thumbnail: "/lovable-uploads/20d8aaa5-2fa3-4481-a3bb-826b51c24771.png"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">
            Video <span className="text-jobblue">Tutorials</span>
          </h1>
          <p className="text-gray-600 mb-8">Learn how to use JobGenius with these step-by-step tutorials</p>

          <Tabs defaultValue="beginner" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="beginner">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tutorials.beginner.map((tutorial, index) => (
                  <TutorialCard key={index} {...tutorial} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="intermediate">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tutorials.intermediate.map((tutorial, index) => (
                  <TutorialCard key={index} {...tutorial} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tutorials.advanced.map((tutorial, index) => (
                  <TutorialCard key={index} {...tutorial} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/4">
                <img 
                  src="/lovable-uploads/b81f026d-a98f-4925-ace1-f4c871f4cfdb.png" 
                  alt="Need More Help" 
                  className="w-full h-auto"
                />
              </div>
              <div className="md:w-3/4">
                <h2 className="text-xl font-semibold mb-4">Need personalized assistance?</h2>
                <p className="text-gray-600 mb-4">
                  Our support team is ready to help you with any questions or issues you may have. 
                  From account setup to advanced features, we're here to ensure you get the most out of JobGenius.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/help/faqs">
                    <Button variant="outline" className="border-jobblue text-jobblue hover:bg-blue-50">
                      Browse FAQs
                    </Button>
                  </a>
                  <a href="/help/contact">
                    <Button className="bg-jobblue hover:bg-jobblue-dark text-white">
                      Contact Support
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface TutorialCardProps {
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

const TutorialCard = ({ title, description, duration, thumbnail }: TutorialCardProps) => {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={thumbnail} alt={title} className="w-full h-40 object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Watch Tutorial</Button>
      </CardFooter>
    </Card>
  );
};

export default HelpTutorialsPage;
