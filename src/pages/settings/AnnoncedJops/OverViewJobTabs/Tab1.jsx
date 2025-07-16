import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useJobForm } from "../../../../context/jobApplicationFormContext";
import { Input } from "@/components/ui/input";
import { Stack, Box, Typography, Button } from "@mui/material";

const Tab1 = ({ onNext, job }) => {
  const { updateForm, formData } = useJobForm();

  // Helper function to ensure array initialization
  const toArray = (data, separator = ",") => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string" && data) return data.split(separator).filter(item => item.trim());
    return [];
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: formData.fullname || job?.fullname || "",
      email: formData.email || job?.email || "",
      phone: formData.phone || job?.phone || "",
    },
  });

  // Initialize formData with job data or localStorage on mount
  useEffect(() => {
    console.log("job prop on render:", job);
    const savedData = localStorage.getItem("formData1");
    const initialFormData = savedData ? JSON.parse(savedData) : {};

    if (job && !formData.fullname && !formData.email && !formData.phone) {
      const jobFormData = {
        fullname: job.fullname || "",
        email: job.email || "",
        phone: job.phone || "",
        company: formData.company || job?.company || "",
        city: formData.city || job?.city || "",
        country: formData.country || job?.country || "",
        companyWebsite: formData.companyWebsite || job?.companyWebsite || "",
        description: formData.description || job?.description || "",
        title: formData.title || job?.title || "",
        type: formData.type || job?.type || "",
        responsibilities: formData.responsibilities || job?.responsibilities || "",
        whoYouAre: formData.whoYouAre || job?.whoYouAre || "",
        niceToHaves: formData.niceToHaves || job?.niceToHaves || "",
        capacity: formData.capacity || job?.capacity || 0,
        applyBefore: formData.applyBefore || (job?.applyBefore ? job.applyBefore.split("T")[0] : ""),
        salaryFrom: formData.salaryFrom || job?.salaryFrom || 0,
        salaryTo: formData.salaryTo || job?.salaryTo || 0,
        keywords: formData.keywords || job?.keywords || "",
        additionalInformation: formData.additionalInformation || job?.additionalInformation || "",
        companyPapers: formData.companyPapers || job?.companyPapers || "",
        categories: formData.categories || toArray(job?.categories?.$values || job?.categories, ","),
        skills: formData.skills || toArray(job?.skills?.$values || job?.skills, ","),
        jobBenefits: formData.jobBenefits || (Array.isArray(job?.jobBenefits?.$values) ? job.jobBenefits.$values : (typeof job?.jobBenefits === "string" ? JSON.parse(job.jobBenefits || "[]") : [])),
      };
      updateForm(jobFormData);
      console.log("Initialized formData with job data:", jobFormData);
    } else if (savedData && !formData.fullname && !formData.email && !formData.phone) {
      updateForm({
        fullname: initialFormData.fullname || "",
        email: initialFormData.email || "",
        phone: initialFormData.phone || "",
        company: formData.company || initialFormData.company || "",
        city: formData.city || initialFormData.city || "",
        country: formData.country || initialFormData.country || "",
        companyWebsite: formData.companyWebsite || initialFormData.companyWebsite || "",
        description: formData.description || initialFormData.description || "",
        title: formData.title || initialFormData.title || "",
        type: formData.type || initialFormData.type || "",
        responsibilities: formData.responsibilities || initialFormData.responsibilities || "",
        whoYouAre: formData.whoYouAre || initialFormData.whoYouAre || "",
        niceToHaves: formData.niceToHaves || initialFormData.niceToHaves || "",
        capacity: formData.capacity || initialFormData.capacity || 0,
        applyBefore: formData.applyBefore || initialFormData.applyBefore || "",
        salaryFrom: formData.salaryFrom || initialFormData.salaryFrom || 0,
        salaryTo: formData.salaryTo || initialFormData.salaryTo || 0,
        keywords: formData.keywords || initialFormData.keywords || "",
        additionalInformation: formData.additionalInformation || initialFormData.additionalInformation || "",
        companyPapers: formData.companyPapers || initialFormData.companyPapers || "",
        categories: toArray(formData.categories || initialFormData.categories, ","),
        skills: toArray(formData.skills || initialFormData.skills, ","),
        jobBenefits: formData.jobBenefits || (Array.isArray(initialFormData.jobBenefits) ? initialFormData.jobBenefits : []),
      });
      console.log("Initialized formData with localStorage:", initialFormData);
    }
  }, [job, updateForm, formData.fullname, formData.email, formData.phone, formData.company, formData.city, formData.country, formData.title]);

  // Log formData changes for debugging
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  const onSubmit = (data) => {
    const cleanedData = {
      fullname: data.fullname || "",
      email: data.email || "",
      phone: data.phone || "",
      company: formData.company || job?.company || "",
      city: formData.city || job?.city || "",
      country: formData.country || job?.country || "",
      companyWebsite: formData.companyWebsite || job?.companyWebsite || "",
      description: formData.description || job?.description || "",
      title: formData.title || job?.title || "",
      type: formData.type || job?.type || "",
      responsibilities: formData.responsibilities || job?.responsibilities || "",
      whoYouAre: formData.whoYouAre || job?.whoYouAre || "",
      niceToHaves: formData.niceToHaves || job?.niceToHaves || "",
      capacity: formData.capacity || job?.capacity || 0,
      applyBefore: formData.applyBefore || (job?.applyBefore ? job.applyBefore.split("T")[0] : ""),
      salaryFrom: formData.salaryFrom || job?.salaryFrom || 0,
      salaryTo: formData.salaryTo || job?.salaryTo || 0,
      keywords: formData.keywords || job?.keywords || "",
      additionalInformation: formData.additionalInformation || job?.additionalInformation || "",
      companyPapers: formData.companyPapers || job?.companyPapers || "",
      categories: toArray(formData.categories || job?.categories?.$values || job?.categories, ","),
      skills: toArray(formData.skills || job?.skills?.$values || job?.skills, ","),
      jobBenefits: formData.jobBenefits || (Array.isArray(job?.jobBenefits?.$values) ? job.jobBenefits.$values : (typeof job?.jobBenefits === "string" ? JSON.parse(job.jobBenefits || "[]") : [])),
    };

    console.log("Payload sent to server:", cleanedData);
    updateForm(cleanedData);
    localStorage.setItem("formData1", JSON.stringify(cleanedData));
    console.log("Submitted Data:", cleanedData);
    handleFinalSubmit(cleanedData);
  };

  const handleClearForm = () => {
    reset({
      fullname: "",
      email: "",
      phone: "",
    });
    const clearedData = {
      ...formData,
      fullname: "",
      email: "",
      phone: "",
    };
    updateForm(clearedData);
    localStorage.setItem("formData1", JSON.stringify(clearedData));
    console.log("Form cleared:", clearedData);
  };

  const handleFinalSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        toast({
          title: "Authentication Error",
          description: "No token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      if (!job?.jobID) {
        console.error("No jobID provided");
        toast({
          title: "Invalid Job ID",
          description: "Job ID is missing. Please ensure a valid job is selected.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.put(
        `https://jobgenius.bsite.net/api/JobListing/${job.jobID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Server response:", response.data);
      if (response.status === 200) {
        console.log("Job Application Updated Successfully");
        toast({ title: "Job Application Updated Successfully" });
        onNext();
      }
    } catch (error) {
      console.error("Error Updating job application:", error);
      console.error("Server error response:", error.response?.data);
      toast({
        title: "Error Updating Job Application",
        description: error.response?.data?.message || "Failed to update job application",
        variant: "destructive",
      });
    }
  };

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "98%",
          ml: "auto",
          my: "20px",
          borderBottom: "1px solid #7C8493",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#25324B", py: "10px" }}
        >
          Personal Info
        </Typography>
      </Box>

      <Stack
        justifyContent="flex-start"
        direction="column"
        sx={{ width: "100%" }}
      >
        <form
          id="form-1"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Stack
            spacing={4}
            direction={{ xs: "column", sm: "row" }}
            padding={3}
            className="w-full d-flex align-items-center justify-content-between"
          >
            <Stack
              spacing={1}
              direction="column"
              className="gap-3"
              sx={{ width: { xs: "100%", lg: "40%" } }}
            >
              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Full Name
                </label>
                <Input
                  {...register("fullname", { required: "Full name is required" })}
                  placeholder="Enter your Full Name"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm">{errors.fullname.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Email Address
                </label>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="Enter your Email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Phone Number
                </label>
                <Input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^01[2|0|1|5][0-9]{8}$/,
                      message: "Phone number must be 11 digits and start with 01",
                    },
                  })}
                  placeholder="Enter your Phone Number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </Stack>
          </Stack>

                 <Box
                   sx={{
                     width: "100%",
                     display: "flex",
                     my: "20px",
                     justifyContent: "flex-end",
                   }}
                 >
                   <Box
                     sx={{
                       display: "flex",
                       justifyContent: "space-between",
                       width: { xs: "100%", lg: "30%" },
                       mx: "5%",
                     }}
                   >
                     <Button
                       sx={{
                         width: "45%",
                         color: "#333",
                         border: "1px solid #333",
                         borderRadius: "10px",
                       }}
                       onClick={handleClearForm}
                     >
                       Clear
                     </Button>
                     <Button
                       type="submit"
                       form="form-1"
                       sx={{
                         width: "45%",
                         color: "#fff",
                         backgroundColor: "#244F6F",
                         border: "1px solid #333",
                         borderRadius: "10px",
                       }}
                     >
                       Save
                     </Button>
                   </Box>
                 </Box>    
        </form>
      </Stack>
    </Stack>
  );
};

export default Tab1;