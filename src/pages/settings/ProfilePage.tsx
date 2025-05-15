import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useParams } from "react-router-dom";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import LogoIcon from "@/components/common/LogoIcon";
import { useJobStore } from "@/reducers/JobListingReducerStore";
import { useProfileStore } from "@/reducers/ProfileReducerStore";
import { useExperienceStore, Experience, ExperiencePayload } from "@/reducers/ExperienceReducerStore";
import { useEducationStore, Education, EducationPayload } from "@/reducers/EducationReducerStore";
import { usePortfolioStore } from "@/reducers/PortfolioReducerStore";
import { format, set } from "date-fns";

const ProfilePage = () => {
  const { id } = useParams();
  const { experiences, fetchExperiences } = useExperienceStore();
  const { portfolios, fetchAllPortfolios, fetchPortfolioImage, addPortfolio } = usePortfolioStore();
  // const { savedJobs, fetchSavedJobs } = useJobStore();
  const { educations, fetchEducations } = useEducationStore();
  const { 
    profile, 
    fetchProfileById, 
    fetchMeProfile, 
    updateProfile,
    addLanguage,
    deleteLanguage,
    addSkill,
    deleteSkill,
    addSocialLink,
    deleteSocialLink,
    updateSocialLink 
  } = useProfileStore();
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [showEditBasicInfoModal, setShowEditBasicInfoModal] = useState(false);
  const [showEditAboutModal, setShowEditAboutModal] = useState(false);
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [showEditLanguagesModal, setShowEditLanguagesModal] = useState(false);
  const [showEditSocialLinksModal, setShowEditSocialLinksModal] = useState(false);
  const [showEditEducationModal, setShowEditEducationModal] = useState(false);
  const [showEditExperienceModal, setShowEditExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    jobTitle: "",
    phone: "",
    gender: "",
    type: "",
    image: null as File | null,
    coverImage: null as File | null,
  });
  const [aboutMe, setAboutMe] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newSocialLink, setNewSocialLink] = useState({
    platform: "",
    link: "",
  });
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    date: "",
    image: null as File | null,
  });
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [newEducation, setNewEducation] = useState<EducationPayload>({
    university: "",
    degree: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  });
  const [newExperience, setNewExperience] = useState<ExperiencePayload>({
    title: "",
    company: "",
    type: "",
    dateFrom: "",
    dateTo: "",
    city: "",
    country: "",
    description: "",
  });

  const [skills, setSkills] = useState([
    "User Interface",
    "Analytics",
    "Designs",
    "Wire Frames",
    "User Experience",
  ]);
  useEffect(() => {
    fetchMeProfile();
    if (id && !isNaN(Number(id))) {
      fetchProfileById(Number(id));
    }
    fetchExperiences();
    fetchEducations();
    fetchAllPortfolios();
  }, [id]);

  useEffect(() => {
    if (profile?.userSkills?.$values) {
      setSkills(profile.userSkills.$values);
    }
  }, [profile]);

  useEffect(() => {
    portfolios.forEach((portfolio) => {
      if (portfolio.image && !portfolio.ImageUploadURL) {
        fetchPortfolioImage(portfolio.portfolioID, portfolio.image);
      }
    });
  }, [portfolios, fetchPortfolioImage]);

  useEffect(() => {
    if (profile) {
      setBasicInfo({
        jobTitle: profile.jobTitle || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        type: profile.type || "",
        image: null,
        coverImage: null,
      });
      setAboutMe(profile.aboutMe || "");
    }
  }, [profile]);

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    await usePortfolioStore.getState().addPortfolio({
      title: newPortfolio.title,
      description: newPortfolio.description,
      date: newPortfolio.date || new Date().toISOString(),
      image: newPortfolio.image,
    });
  };

  const handleBasicInfoUpdate = async () => {
    try {
      const payload: any = {
        ...profile,
        jobTitle: basicInfo.jobTitle,
        phone: basicInfo.phone,
        gender: basicInfo.gender,
        type: basicInfo.type,
      };
      if (basicInfo.image instanceof File) payload.image = basicInfo.image;
      if (basicInfo.coverImage instanceof File) payload.coverImage = basicInfo.coverImage;
      await updateProfile(payload);
      setShowEditBasicInfoModal(false);
    } catch (error) {
      console.error("Error updating basic info:", error);
    }
  };

  const handleAboutMeUpdate = async () => {
    try {
      const payload: any = {
        ...profile,
        aboutMe: aboutMe,
      };
      if (basicInfo.image instanceof File) payload.image = basicInfo.image;
      if (basicInfo.coverImage instanceof File) payload.coverImage = basicInfo.coverImage;
      await updateProfile(payload);
      setShowEditAboutModal(false);
    } catch (error) {
      console.error("Error updating about me:", error);
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      try {
        await addSkill(newSkill.trim());
        setNewSkill("");
      } catch (error) {
        console.error("Error adding skill:", error);
      }
    }
  };

  const handleAddLanguage = async () => {
    if (newLanguage.trim()) {
      try {
        await addLanguage(newLanguage.trim());
        setNewLanguage("");
      } catch (error) {
        console.error("Error adding language:", error);
      }
    }
  };

  const handleAddSocialLink = async () => {
    if (newSocialLink.platform.trim() && newSocialLink.link.trim()) {
      try {
        await addSocialLink(newSocialLink.platform.trim(), newSocialLink.link.trim());
        setNewSocialLink({ platform: "", link: "" });
      } catch (error) {
        console.error("Error adding social link:", error);
      }
    }
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setShowEditEducationModal(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setShowEditExperienceModal(true);
  };

  const handleAddEducation = async () => {
    try {
      await useEducationStore.getState().addEducation(newEducation);
      setShowAddEducationModal(false);
      setNewEducation({ university: "", degree: "", dateFrom: "", dateTo: "", description: "" });
      fetchEducations();
    } catch (error) {
      console.error("Error adding education:", error);
    }
  };

  const handleAddExperience = async () => {
    try {
      await useExperienceStore.getState().addExperience(newExperience);
      setShowAddExperienceModal(false);
      setNewExperience({ title: "", company: "", type: "", dateFrom: "", dateTo: "", city: "", country: "", description: "" });
      fetchExperiences();
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex">
        <SettingsSidebar />
        <main className="flex-grow px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <Button variant="outline" className="bg-white" asChild>
              <a href="/">Back to homepage</a>
            </Button>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg border mb-8">
            <div className="p-6 relative">
              <div className="flex items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
                  <img
                    src={profile?.image || "https://randomuser.me/api/portraits/men/44.jpg"}
                    alt={profile?.fullname || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold mr-2">
                      {profile?.fullname || "Loading..."}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => setShowEditBasicInfoModal(true)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <p className="text-gray-700 mb-2">{profile?.jobTitle || "N/A"}</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="ml-1">Cairo, Egypt</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-6 right-6"
                  onClick={() => setShowProfileSetupModal(true)}
                >
                  <Pencil size={16} className="mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* About Me */}
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">About Me</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => setShowEditAboutModal(true)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <p className="text-gray-600">{profile?.aboutMe || "N/A"}</p>
                </div>
              </div>

              {/* Experiences */}
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Experiences</h3>
                    <Button variant="ghost" size="sm" className="flex items-center" onClick={() => setShowAddExperienceModal(true)}>
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  {experiences.length === 0 && <p>No experiences found.</p>}
                  {experiences.map((experience) => (
                    <div
                      key={experience.experienceID}
                      className="mb-6 pb-6 border-b last:mb-0 last:pb-0 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <div className="flex">
                          {/* <div className="w-12 h-12 rounded-md bg-gray-100 mr-4 flex items-center justify-center overflow-hidden">
                            <img src={experience.companyLogo} alt={experience.company} className="w-8 h-8 object-contain" />
                          </div> */}
                          <div>
                            <h4 className="font-medium text-lg">{experience.title}</h4>
                            <p className="text-gray-600">
                              {experience.company} • {experience.type} •{" "}
                              {format(new Date(experience.dateFrom), "MMMM d, yyyy")} -{" "}
                              {format(new Date(experience.dateTo), "MMMM d, yyyy")}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {experience.city}, {experience.country}
                            </p>
                            <p className="mt-2 text-gray-700">{experience.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleEditExperience(experience)}>
                          <Pencil size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educations */}
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Educations</h3>
                    <Button variant="ghost" size="sm" className="flex items-center" onClick={() => setShowAddEducationModal(true)}>
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  {educations.length === 0 && <p>No educations found.</p>}
                  {educations.map((edu) => (
                    <div
                      key={edu.educationID}
                      className="mb-6 pb-6 border-b last:mb-0 last:pb-0 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <div className="flex">
                          {/* <div className="w-12 h-12 rounded-md bg-gray-100 mr-4 flex items-center justify-center overflow-hidden">
                            <img src={edu.university} alt={edu.institution} className="w-8 h-8 object-contain" />
                          </div> */}
                          <div>
                            <h4 className="font-medium text-lg">{edu.university}</h4>
                            <p className="text-gray-600">{edu.degree}</p>
                            <p className="text-gray-600 text-sm">
                              {format(new Date(edu.dateFrom), "MMMM d, yyyy")} -{" "}
                              {format(new Date(edu.dateTo), "MMMM d, yyyy")}
                            </p>
                            <p className="mt-2 text-gray-700">{edu.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => handleEditEducation(edu)}>
                          <Pencil size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Skills</h3>
                    <div className="flex">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto mr-2"
                        onClick={() => setShowEditSkillsModal(true)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => setShowEditSkillsModal(true)}
                      >
                        <Plus size={16} className="mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile?.userSkills.$values.length ? (
                      profile.userSkills.$values.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No skills found.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolios */}
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">Portfolios</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() => setShowAddPortfolioModal(true)}
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  {portfolios.length === 0 && <p>No portfolios found.</p>}
                  <div className="grid grid-cols-2 gap-4">
                    {portfolios.map((portfolio) => (
                      <div key={portfolio.portfolioID} className="relative group">
                        {portfolio.ImageUploadURL ? (
                          <img
                            src={portfolio.ImageUploadURL}
                            alt={portfolio.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                            Loading image...
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 p-1 h-auto bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil size={16} />
                        </Button>
                        <p className="mt-1 text-sm font-medium">{portfolio.title}</p>
                        <p className="text-gray-600 text-sm">
                          {format(new Date(portfolio.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details and Social Links */}
            <div>
              <div className="bg-white rounded-lg border mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Additional Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => setShowEditBasicInfoModal(true)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex mb-1">
                        <svg
                          width="16"
                          height="16"
                          className="mr-2 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-gray-500 text-sm">Email</span>
                      </div>
                      <p>{profile?.email || "N/A"}</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg
                          width="16"
                          height="16"
                          className="mr-2 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-gray-500 text-sm">Phone</span>
                      </div>
                      <p>{profile?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <div className="flex mb-1">
                        <svg
                          width="16"
                          height="16"
                          className="mr-2 text-gray-500"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 22V12H15V22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-gray-500 text-sm">Languages</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto"
                          onClick={() => setShowEditLanguagesModal(true)}
                        >
                          <Pencil size={16} />
                        </Button>
                      </div>
                      <p>
                        {profile?.userLanguages.$values.length
                          ? profile.userLanguages.$values.join(", ")
                          : "No languages added"}
                      </p>
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
                      onClick={() => setShowEditSocialLinksModal(true)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {profile?.socialLinks.$values.length ? (
                      profile.socialLinks.$values.map((link) => (
                        <div key={link.linkID}>
                          <div className="flex mb-1">
                            <span className="text-gray-500 text-sm">{link.platform}</span>
                          </div>
                          <p>{link.link}</p>
                        </div>
                      ))
                    ) : (
                      <p>No social links added</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Setup Modal */}
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

      {/* Add Portfolio Modal */}
      <Dialog open={showAddPortfolioModal} onOpenChange={setShowAddPortfolioModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">Add New Portfolio</DialogTitle>
            <DialogDescription className="text-base">
              Fill in the details to add a new portfolio item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPortfolio} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="datetime-local"
                value={newPortfolio.date}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPortfolio({ ...newPortfolio, image: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <DialogFooter className="sm:justify-center mt-4">
              <Button
              onClick={handleAddPortfolio}
                type="submit"
                className="bg-jobblue hover:bg-jobblue-dark w-full sm:w-auto"
                disabled={usePortfolioStore((state) => state.isLoading)}
              >
                {usePortfolioStore((state) => state.isLoading) ? "Uploading..." : "Add Portfolio"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Basic Info Modal */}
      <Dialog open={showEditBasicInfoModal} onOpenChange={setShowEditBasicInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Basic Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input
                value={basicInfo.jobTitle}
                onChange={(e) => setBasicInfo({ ...basicInfo, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                value={basicInfo.gender}
                onChange={(e) => setBasicInfo({ ...basicInfo, gender: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={basicInfo.type}
                onChange={(e) => setBasicInfo({ ...basicInfo, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Profile Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setBasicInfo({ ...basicInfo, image: e.target.files?.[0] || null })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setBasicInfo({ ...basicInfo, coverImage: e.target.files?.[0] || null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleBasicInfoUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit About Modal */}
      <Dialog open={showEditAboutModal} onOpenChange={setShowEditAboutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About Me</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">About Me</label>
              <Textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAboutMeUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skills Modal */}
      <Dialog open={showEditSkillsModal} onOpenChange={setShowEditSkillsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Add New Skill</label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter skill"
                />
                <Button onClick={handleAddSkill}>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              {profile?.userSkills.$values.map((skill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{skill}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSkill(skill)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Languages Modal */}
      <Dialog open={showEditLanguagesModal} onOpenChange={setShowEditLanguagesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Languages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Add New Language</label>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Enter language"
                />
                <Button onClick={handleAddLanguage}>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              {profile?.userLanguages.$values.map((language, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{language}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLanguage(language)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Social Links Modal */}
      <Dialog open={showEditSocialLinksModal} onOpenChange={setShowEditSocialLinksModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Add New Social Link</label>
              <div className="space-y-2">
                <Input
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                  placeholder="Platform (e.g., LinkedIn, Twitter)"
                />
                <Input
                  value={newSocialLink.link}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, link: e.target.value })}
                  placeholder="Link URL"
                />
                <Button onClick={handleAddSocialLink}>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              {profile?.socialLinks.$values.map((link) => (
                <div key={link.linkID} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{link.platform}: </span>
                    <span>{link.link}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSocialLink(link.linkID)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Education Modal */}
      <Dialog open={showEditEducationModal} onOpenChange={setShowEditEducationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">University</label>
              <Input
                value={editingEducation?.university || ""}
                onChange={(e) => setEditingEducation({ ...editingEducation, university: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Degree</label>
              <Input
                value={editingEducation?.degree || ""}
                onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={editingEducation?.dateFrom || ""}
                onChange={(e) => setEditingEducation({ ...editingEducation, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={editingEducation?.dateTo || ""}
                onChange={(e) => setEditingEducation({ ...editingEducation, dateTo: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingEducation?.description || ""}
                onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              if (editingEducation?.educationID) {
                useEducationStore.getState().updateEducation(editingEducation.educationID, editingEducation);
              }
              setShowEditEducationModal(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Experience Modal */}
      <Dialog open={showEditExperienceModal} onOpenChange={setShowEditExperienceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingExperience?.title || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input
                value={editingExperience?.company || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input
                value={editingExperience?.type || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={editingExperience?.dateFrom || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={editingExperience?.dateTo || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, dateTo: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input
                value={editingExperience?.city || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, city: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input
                value={editingExperience?.country || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, country: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingExperience?.description || ""}
                onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={async () => {
              if (editingExperience?.experienceID) {
                await useExperienceStore.getState().updateExperience(editingExperience.experienceID, editingExperience);
                await fetchExperiences();
              }
              setShowEditExperienceModal(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Education Modal */}
      <Dialog open={showAddEducationModal} onOpenChange={setShowAddEducationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">University</label>
              <Input value={newEducation.university} onChange={e => setNewEducation({ ...newEducation, university: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Degree</label>
              <Input value={newEducation.degree} onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Input type="date" value={newEducation.dateFrom} onChange={e => setNewEducation({ ...newEducation, dateFrom: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Date To</label>
              <Input type="date" value={newEducation.dateTo || ""} onChange={e => setNewEducation({ ...newEducation, dateTo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={newEducation.description || ""} onChange={e => setNewEducation({ ...newEducation, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEducation}>Add Education</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Experience Modal */}
      <Dialog open={showAddExperienceModal} onOpenChange={setShowAddExperienceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={newExperience.title} onChange={e => setNewExperience({ ...newExperience, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input value={newExperience.company} onChange={e => setNewExperience({ ...newExperience, company: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input value={newExperience.type} onChange={e => setNewExperience({ ...newExperience, type: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Input type="date" value={newExperience.dateFrom} onChange={e => setNewExperience({ ...newExperience, dateFrom: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Date To</label>
              <Input type="date" value={newExperience.dateTo} onChange={e => setNewExperience({ ...newExperience, dateTo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input value={newExperience.city} onChange={e => setNewExperience({ ...newExperience, city: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input value={newExperience.country} onChange={e => setNewExperience({ ...newExperience, country: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={newExperience.description} onChange={e => setNewExperience({ ...newExperience, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddExperience}>Add Experience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;