import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobApplicationStore } from "@/reducers/JobApplicationReducerStore";

/**
 * Job application form component
 * @param {Object} props
 * @param {string} props.jobTitle - Title of the job
 * @param {string} props.companyName - Name of the company
 * @param {string} props.location - Job location
 * @param {string} props.type - Job type
 * @param {number} props.jobId - Job ID
 * @param {Function} props.onSubmit - Submit handler function
 */
const JobApplicationForm = ({
  jobTitle,
  companyName,
  location,
  type,
  onSubmit,
  jobId,
}) => {
  const { toast } = useToast();
  const { submitJobApplication } = useJobApplicationStore();
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    JobID: parseInt(jobId),
    Fullname: "",
    Email: "",
    Phone: "",
    CurrentJob: "",
    LinkedInLink: "",
    PortfolioLink: "",
    AdditionalInformation: "",
    ResumeFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setFormData((prev) => ({
        ...prev,
        ResumeFile: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      await submitJobApplication({
        jobID: formData.JobID,
        fullname: formData.Fullname,
        email: formData.Email,
        phone: formData.Phone,
        currentJob: formData.CurrentJob,
        linkedInLink: formData.LinkedInLink,
        portfolioLink: formData.PortfolioLink,
        additionalInformation: formData.AdditionalInformation,
        resumeFile: formData.ResumeFile,
      });
      toast({
        title: "Success",
        description: "Application submitted successfully!",
        variant: "default",
      });
      onSubmit();
      console.log("Application submitted successfully! ");
      console.log("formData:", formData);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit job application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader className="flex flex-col gap-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            N
          </div>
          <DialogTitle>Apply for {jobTitle} </DialogTitle>
        </div>
        <div className="flex items-center gap-2 p-2 pt-0 text-sm mb-6">
          <span className="font-medium">{companyName}</span>
          <span className="text-gray-500">·</span>
          <span>{location}</span>
          <span className="text-gray-500">·</span>
          <span>{type}</span>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="fullname" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="name"
            name="Fullname"
            placeholder="Enter your full name"
            value={formData.Fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="email"
            name="Email"
            type="email"
            placeholder="Enter your email address"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="phone"
            name="Phone"
            placeholder="Enter your phone number"
            value={formData.Phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="currentJob" className="block text-sm font-medium mb-1">
              Current Job
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="currentJob"
            name="CurrentJob"
            placeholder="Enter your current job"
            value={formData.CurrentJob}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="linkedinLink" className="block text-sm font-medium mb-1">
              LinkedIn Link
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="linkedinLink"
            name="LinkedInLink"
            placeholder="Enter your LinkedIn Link"
            value={formData.LinkedInLink}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="portfolioLink" className="block text-sm font-medium mb-1">
              Portfolio Link
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <Input
            id="portfolioLink"
            name="PortfolioLink"
            placeholder="Enter your Portfolio Link"
            value={formData.PortfolioLink}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="additionalInformation" className="block text-sm font-medium mb-1">
              Additional Information
            </label>
            <span className="text-xs text-gray-500">Optional</span>
          </div>
          <Textarea
            id="additionalInformation"
            name="AdditionalInformation"
            placeholder="Tell us why you're a good fit for this position"
            value={formData.AdditionalInformation}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="resume" className="block text-sm font-medium mb-1">
              Upload Your CV
            </label>
            <span className="text-xs text-gray-500">required</span>
          </div>
          <div className="flex items-center gap-4">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              required
            />
            {resumeFile && (
              <div className="bg-green-50 p-1 rounded-full">
                <Check size={16} className="text-green-600" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, DOC, DOCX
          </p>
        </div>

        <Button
          type="submit"
          className="bg-jobblue hover:bg-jobblue-dark w-full"
          disabled={isUploading}
        >
          {isUploading ? "Submitting Application..." : "Submit Application"}
        </Button>
      </form>
    </DialogContent>
  );
};

export default JobApplicationForm;