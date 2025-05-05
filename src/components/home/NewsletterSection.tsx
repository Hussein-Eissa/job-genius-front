
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-12 bg-jobblue">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get job notifications</h2>
          
          {isSubscribed ? (
            <div className="bg-white/20 rounded-lg p-4 text-white max-w-lg">
              <p>Thank you for subscribing to our job alerts! You'll be among the first to know when new positions match your criteria.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full max-w-lg">
              <div className="rounded-md bg-white p-0 m-0 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="m-2 p-0 bg-white text-jobblue hover:bg-gray-100 font-medium"
                >
                  <img
                    src="/lovable-uploads/Images/Frame 89.png"
                    alt="Subscribe"
                    className="max-w-full"
                  />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
