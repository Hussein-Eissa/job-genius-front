
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import LogoIcon from "@/components/common/LogoIcon";

const ProfilePage = () => {
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: "UI / UX Designer",
      company: "GoDaddy",
      companyLogo: "/lovable-uploads/ac986247-63a1-496f-b05d-c07c5e6539fa.png", 
      type: "Full-Time",
      period: "Jun 2023 - May 2024",
      location: "Alexandria, Egypt",
      description: "Designed user-centric UI/UX strategies, wireframes, prototypes, and interactive experiences to support client initiatives across websites, apps, and digital platforms."
    },
    {
      id: 2,
      title: "Product Designer",
      company: "X",
      companyLogo: "/lovable-uploads/6a89dc67-f4fd-47c3-ab6b-0c714270c63a.png",
      type: "Part-Time",
      period: "Jun 2022 - Jan 2023",
      location: "Cairo, Egypt",
      description: "Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads."
    }
  ]);
  
  const [education, setEducation] = useState([
    {
      id: 1,
      institution: "Helwan University",
      institutionLogo: "/lovable-uploads/958f4e58-d9cd-45a8-9bdc-e96ea1d82dfa.png",
      degree: "Medical Bachelor, Bachelor of Surgery (MBBS)",
      period: "2018 - 2023",
      description: "Professional undergraduate degree in medical science. The program typically spans 6 years, including academic coursework and clinical training: studying anatomy, physiology, biochemistry, pathology, pharmacology, microbiology, forensic medicine, and community medicine, with specialized areas such as pediatrics, surgery, gynecology, psychiatry, and internal medicine."
    }
  ]);
  
  const [skills, setSkills] = useState([
    "User Interface", "Analytics", "Designs", "Wire Frames", "User Experience"
  ]);
  
  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      title: "Clinically - clinic & health care website",
      image: "/lovable-uploads/987379b5-72ac-48ba-afa1-22296550038b.png"
    },
    {
      id: 2,
      title: "Growthly - SaaS Analytics & Sales Website",
      image: "/lovable-uploads/ddcd7974-ec8e-4eb8-a5c0-441ccc1e9163.png"
    },
    {
      id: 3,
      title: "Planna - Project Management App",
      image: "/lovable-uploads/789de2eb-02d1-47bf-86b7-19eba0ee1426.png"
    },
    {
      id: 4,
      title: "Fun for Everyone",
      image: "/lovable-uploads/a976ced2-cde5-464b-88fb-facc67af500c.png"
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} />
      <div className="flex-grow flex">
        <SettingsSidebar />
        <main className="flex-grow px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <Button variant="outline" className="bg-white" asChild>
              <a href="/">Back to homepage</a>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border mb-8">
            <div className="p-6 relative">
              <div className="flex items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
                  <img 
                    src="https://randomuser.me/api/portraits/men/44.jpg" 
                    alt="Ahmed Safwat" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold mr-2">Ahmed Safwat</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => {}}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <p className="text-gray-700 mb-2">UI/UX Designer @ DEPI</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="ml-1">Cairo, Egypt</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="absolute top-6 right-6" 
                  onClick={() => {}}
                >
                  <Pencil size={16} className="mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">About Me</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => {}}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <p className="text-gray-600">
                    I'm a UI/UX designer with over 10 years of experience in interface, experience, and interaction design. I've worked across product agencies, big tech companies, and fast-moving start-ups, shaping digital products from early research and strategy through to final design. I care deeply about crafting intuitive, human-centered experiences and love the challenge of turning complex problems into simple, elegant solutions.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Experiences</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => {}}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {experiences.map(experience => (
                    <div key={experience.id} className="mb-6 pb-6 border-b last:mb-0 last:pb-0 last:border-b-0">
                      <div className="flex justify-between">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-md bg-gray-100 mr-4 flex items-center justify-center overflow-hidden">
                            <img src={experience.companyLogo} alt={experience.company} className="w-8 h-8 object-contain" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{experience.title}</h4>
                            <p className="text-gray-600">
                              {experience.company} • {experience.type} • {experience.period}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {experience.location}
                            </p>
                            <p className="mt-2 text-gray-700">
                              {experience.description}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto"
                          onClick={() => {}}
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Educations</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => {}}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {education.map(edu => (
                    <div key={edu.id} className="mb-6 pb-6 border-b last:mb-0 last:pb-0 last:border-b-0">
                      <div className="flex justify-between">
                        <div className="flex">
                          <div className="w-12 h-12 rounded-md bg-gray-100 mr-4 flex items-center justify-center overflow-hidden">
                            <img src={edu.institutionLogo} alt={edu.institution} className="w-8 h-8 object-contain" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{edu.institution}</h4>
                            <p className="text-gray-600">
                              {edu.degree}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {edu.period}
                            </p>
                            <p className="mt-2 text-gray-700">
                              {edu.description}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto"
                          onClick={() => {}}
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Skills</h3>
                    <div className="flex">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto mr-2"
                        onClick={() => {}}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => {}}
                      >
                        <Plus size={16} className="mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Portfolios</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => {}}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {portfolios.map(portfolio => (
                      <div key={portfolio.id} className="relative group">
                        <img 
                          src={portfolio.image}
                          alt={portfolio.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 p-1 h-auto bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {}}
                        >
                          <Pencil size={16} />
                        </Button>
                        <p className="mt-1 text-sm font-medium">{portfolio.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Additional Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => {}}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Email</span>
                      </div>
                      <p>a.safwat@email.com</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Phone</span>
                      </div>
                      <p>+02012345678</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Languages</span>
                      </div>
                      <p>Arabic, English</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Social Links</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => {}}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.8217 3.41772C15.2366 1.83264 13.1645 0.85083 10.9308 0.637664C8.69702 0.424498 6.45705 0.992297 4.59775 2.24023C2.73845 3.48817 1.36258 5.32441 0.685291 7.43827C0.00799614 9.55214 0.069587 11.8234 0.860141 13.8983C1.65069 15.9733 3.12233 17.7294 5.03793 18.8967C6.95354 20.064 9.20502 20.5774 11.4418 20.3522C13.6786 20.1271 15.7677 19.177 17.3305 17.6473C18.8932 16.1175 19.8874 14.0480 20.158 11.8149" stroke="#0077B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 12.5874L12 16.5874L22 6.58737" stroke="#0077B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Instagram</span>
                      </div>
                      <p>instagram.com/a.safwat</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">X</span>
                      </div>
                      <p>twitter.com/a.safwat</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg width="16" height="16" className="mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 4H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 20H21V4H3V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 12L14 14L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18 12L16 14L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 12H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 16H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-gray-500 text-sm">Website</span>
                      </div>
                      <p>www.ah-safwat.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      
      <Dialog open={showProfileSetupModal} onOpenChange={setShowProfileSetupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2">
              <LogoIcon className="h-10 w-10" />
              <span className="ml-2 text-xl font-semibold">JobGenius</span>
            </div>
            <DialogTitle className="text-2xl">You must Continue your profile setup</DialogTitle>
            <DialogDescription className="text-base">
              Strong profile qualifies you for better positions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button 
              className="bg-jobblue hover:bg-jobblue-dark w-full sm:w-auto"
              onClick={() => setShowProfileSetupModal(false)}
            >
              OK, Let's Go
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
