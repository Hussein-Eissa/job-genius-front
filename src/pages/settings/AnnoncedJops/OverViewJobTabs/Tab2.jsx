import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useJobForm } from "../../../../context/jobApplicationFormContext";
import { Input } from "@/components/ui/input";
import { Stack, Box, Typography, Button } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Tab2 = ({ onNext, job }) => {
  const { updateForm, formData } = useJobForm();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: formData.company || job?.company || "",
      city: formData.city || job?.city || "",
      country: formData.country || job?.country || "",
      companyWebsite: formData.companyWebsite || job?.companyWebsite || "",
      description: formData.description || job?.description || "",
    },
  });

  const description = watch("description") || "";
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["emoji"],
    ],
  };

  // Initialize formData with job data or localStorage only once on mount
  useEffect(() => {
    if (!formData.company && !formData.city && !formData.country && !formData.companyWebsite && !formData.description) {
      const savedData = localStorage.getItem("formData2");
      const initialFormData = savedData ? JSON.parse(savedData) : {};

      const jobFormData = {
        company: job?.company || initialFormData.company || formData.company || "",
        city: job?.city || initialFormData.city || formData.city || "",
        country: job?.country || initialFormData.country || formData.country || "",
        companyWebsite: job?.companyWebsite || initialFormData.companyWebsite || formData.companyWebsite || "",
        description: job?.description || initialFormData.description || formData.description || "",
        // Preserve Tab1 and Tab3 fields
        title: job?.title || initialFormData.title || formData.title || "",
        type: job?.type || initialFormData.type || formData.type || "",
        responsibilities: job?.responsibilities || initialFormData.responsibilities || formData.responsibilities || "",
        whoYouAre: job?.whoYouAre || initialFormData.whoYouAre || formData.whoYouAre || "",
        niceToHaves: job?.niceToHaves || initialFormData.niceToHaves || formData.niceToHaves || "",
        capacity: job?.capacity || initialFormData.capacity || formData.capacity || 0,
        applyBefore: job?.applyBefore ? job.applyBefore.split("T")[0] : initialFormData.applyBefore || formData.applyBefore || "",
        salaryFrom: job?.salaryFrom || initialFormData.salaryFrom || formData.salaryFrom || 0,
        salaryTo: job?.salaryTo || initialFormData.salaryTo || formData.salaryTo || 0,
        keywords: job?.keywords || initialFormData.keywords || formData.keywords || "",
        additionalInformation: job?.additionalInformation || initialFormData.additionalInformation || formData.additionalInformation || "",
        companyPapers: job?.companyPapers || initialFormData.companyPapers || formData.companyPapers || "",
        categories: Array.isArray(job?.categories?.$values) ? job.categories.$values : toArray(job?.categories || initialFormData.categories || formData.categories, ",") || [],
        skills: Array.isArray(job?.skills?.$values) ? job.skills.$values : toArray(job?.skills || initialFormData.skills || formData.skills, ",") || [],
        jobBenefits: Array.isArray(job?.jobBenefits?.$values) ? job.jobBenefits.$values : typeof job?.jobBenefits === "string" ? JSON.parse(job.jobBenefits || "[]") : initialFormData.jobBenefits || formData.jobBenefits || [],
        fullname: job?.fullname || initialFormData.fullname || formData.fullname || "",
        email: job?.email || initialFormData.email || formData.email || "",
        phone: job?.phone || initialFormData.phone || formData.phone || "",
      };
      updateForm(jobFormData);
      localStorage.setItem("formData2", JSON.stringify(jobFormData));
      console.log("Initialized formData:", jobFormData);
    }
  }, [job, updateForm]); // Only re-run if job or updateForm changes

  // Helper function to ensure array initialization
  const toArray = (data, separator = ",") => {
    if (Array.isArray(data)) return data.filter(item => typeof item === "string" && item.trim());
    if (typeof data === "string" && data) return data.split(separator).map(item => item.trim()).filter(item => item);
    return [];
  };

  const onSubmit = (data) => {
    const cleanedData = {
      company: data.company || "",
      city: data.city || "",
      country: data.country || "",
      companyWebsite: data.companyWebsite || "",
      // Preserve Tab1 and Tab3 fields
      title: formData.title || job?.title || "",
      type: formData.type || job?.type || "",
      responsibilities: formData.responsibilities || job?.responsibilities || "",
      whoYouAre: formData.whoYouAre || job?.whoYouAre || "",
      niceToHaves: formData.niceToHaves || job?.niceToHaves || "",
      capacity: formData.capacity || job?.capacity || 0,
      applyBefore: formData.applyBefore || (job?.applyBefore ? job.applyBefore.split("T")[0] : "") || "",
      salaryFrom: formData.salaryFrom || job?.salaryFrom || 0,
      salaryTo: formData.salaryTo || job?.salaryTo || 0,
      keywords: formData.keywords || job?.keywords || "",
      additionalInformation: formData.additionalInformation || job?.additionalInformation || "",
      companyPapers: formData.companyPapers || job?.companyPapers || "",
      categories: formData.categories || (Array.isArray(job?.categories?.$values) ? job.categories.$values : toArray(job?.categories, ",")) || [],
      skills: formData.skills || (Array.isArray(job?.skills?.$values) ? job.skills.$values : toArray(job?.skills, ",")) || [],
      jobBenefits: formData.jobBenefits || (Array.isArray(job?.jobBenefits?.$values) ? job.jobBenefits.$values : typeof job?.jobBenefits === "string" ? JSON.parse(job.jobBenefits || "[]") : []) || [],
      fullname: formData.fullname || job?.fullname || "",
      email: formData.email || job?.email || "",
      phone: formData.phone || job?.phone || "",
    };

    console.log("Payload sent to server:", cleanedData);
    updateForm(cleanedData);
    localStorage.setItem("formData2", JSON.stringify(cleanedData));
    console.log("Submitted Data:", cleanedData);
    handleFinalSubmit(cleanedData);
  };

  const handleClearForm = () => {
    reset({
      company: "",
      city: "",
      country: "",
      companyWebsite: "",
    });
    const clearedData = {
      ...formData,
      company: "",
      city: "",
      country: "",
      companyWebsite: "",
    };
    updateForm(clearedData);
    localStorage.setItem("formData2", JSON.stringify(clearedData));
    console.log("Tab2 Form cleared:", clearedData);
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
        description:
          error.response?.data?.message || "Failed to update job application",
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
          Company Info
        </Typography>
      </Box>

      <Stack
        justifyContent="flex-start"
        direction="column"
        sx={{ width: "100%" }}
      >
        <form
          id="form-2"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Stack
            spacing={4}
            direction={{ xs: "column", sm: "row" }}
            padding={3}
            className="w-full d-flex justify-content-between"
          >
            <Stack
              spacing={1}
              direction="column"
              className="gap-3"
              sx={{ width: { xs: "100%", lg: "40%" } }}
            >
              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Company Name
                </label>
                <Input
                  {...register("company", {
                    required: "Company name is required",
                  })}
                  placeholder="Enter your Company Name"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Company Website
                </label>
                <Input
                  {...register("companyWebsite", {
                    required: false,
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                      message: "Invalid URL format",
                    },
                  })}
                  placeholder="Enter your Company Website"
                />
                {errors.companyWebsite && (
                  <p className="text-red-500 text-sm">
                    {errors.companyWebsite.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 text-[#244F6F]">
                  Company Location
                </label>
                <Stack spacing={1} direction="row" padding={1} margin={0}>
                  <Stack sx={{ width: "100%" }}>
                    <label className="block font-medium text-[#244F6F]">
                      Country
                    </label>
                    <Input
                      {...register("country", {
                        required: "Country is required",
                      })}
                      placeholder="Enter your Country"
                      onChange={(e) => setValue("country", e.target.value)}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        {errors.country.message}
                      </p>
                    )}
                  </Stack>
                  <Stack sx={{ width: "100%" }}>
                    <label className="block font-medium text-[#244F6F]">
                      City
                    </label>
                    <Input
                      {...register("city", { required: "City is required" })}
                      placeholder="Enter your City"
                      onChange={(e) => setValue("city", e.target.value)}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </Stack>
                </Stack>
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
                form="form-2"
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

export default Tab2;