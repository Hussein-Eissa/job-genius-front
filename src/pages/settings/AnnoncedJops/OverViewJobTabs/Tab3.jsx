import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useJobForm } from "../../../../context/jobApplicationFormContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
import {
  Stack,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Tab3 = ({ job }) => {
  const { updateForm, formData } = useJobForm();
  const isInitialized = useRef(false); // Prevent multiple initializations

  // Helper function to ensure array initialization
  const toArray = (data, separator = ".") => {
    if (Array.isArray(data))
      return data.filter((item) => typeof item === "string" && item.trim());
    if (typeof data === "string" && data)
      return data
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item);
    return [];
  };

  // Initialize state with formData or job data, ensuring arrays
  const [skills, setSkills] = React.useState(
    toArray(formData.skills, ",") ||
      toArray(job?.skills?.$values || job?.skills, ",")
  );
  const [skillInput, setSkillInput] = React.useState("");
  const [categories, setCategories] = React.useState(
    toArray(formData.categories, ",") ||
      toArray(job?.categories?.$values || job?.categories, ",")
  );
  const [categoryInput, setCategoryInput] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState(
    toArray(formData.responsibilities) || toArray(job?.responsibilities)
  );
  const [responsibilityInput, setResponsibilityInput] = React.useState("");
  const [whoYouAre, setWhoYouAre] = React.useState(
    toArray(formData.whoYouAre) || toArray(job?.whoYouAre)
  );
  const [whoYouAreInput, setWhoYouAreInput] = React.useState("");
  const [niceToHaves, setNiceToHaves] = React.useState(
    toArray(formData.niceToHaves) || toArray(job?.niceToHaves)
  );
  const [niceToHavesInput, setNiceToHavesInput] = React.useState("");
  const [benefits, setBenefits] = React.useState(
    Array.isArray(formData.jobBenefits)
      ? formData.jobBenefits
      : typeof formData.jobBenefits === "string" && formData.jobBenefits
      ? JSON.parse(formData.jobBenefits || "[]").filter(
          (item) => typeof item === "object" && item !== null
        )
      : Array.isArray(job?.jobBenefits?.$values)
      ? job.jobBenefits.$values
      : typeof job?.jobBenefits === "string" && job.jobBenefits
      ? JSON.parse(job.jobBenefits || "[]").filter(
          (item) => typeof item === "object" && item !== null
        )
      : []
  );
  const [benefitInput, setBenefitInput] = React.useState({
    title: "",
    description: "",
  });

  // Initialize formData with job data or localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return; // Prevent re-running
    isInitialized.current = true;

    console.log("job prop on render:", job);
    const savedData = localStorage.getItem("formData3");
    const initialFormData = savedData ? JSON.parse(savedData) : {};

    const jobFormData = {
      title: initialFormData.title || job?.title || formData.title || "",
      company:
        initialFormData.company || job?.company || formData.company || "",
      city: initialFormData.city || job?.city || formData.city || "",
      country:
        initialFormData.country || job?.country || formData.country || "",
      type: initialFormData.type || job?.type || formData.type || "",
      description:
        initialFormData.description ||
        job?.description ||
        formData.description ||
        "",
      responsibilities:
        toArray(initialFormData.responsibilities) ||
        toArray(formData.responsibilities) ||
        toArray(job?.responsibilities) ||
        [],
      whoYouAre:
        toArray(initialFormData.whoYouAre) ||
        toArray(formData.whoYouAre) ||
        toArray(job?.whoYouAre) ||
        [],
      niceToHaves:
        toArray(initialFormData.niceToHaves) ||
        toArray(formData.niceToHaves) ||
        toArray(job?.niceToHaves) ||
        [],
      capacity:
        initialFormData.capacity || job?.capacity || formData.capacity || 0,
      applyBefore:
        initialFormData.applyBefore ||
        (job?.applyBefore ? job.applyBefore.split("T")[0] : "") ||
        formData.applyBefore ||
        "",
      salaryFrom:
        initialFormData.salaryFrom ||
        job?.salaryFrom ||
        formData.salaryFrom ||
        0,
      salaryTo:
        initialFormData.salaryTo || job?.salaryTo || formData.salaryTo || 0,
      companyWebsite:
        initialFormData.companyWebsite ||
        job?.companyWebsite ||
        formData.companyWebsite ||
        "",
      keywords:
        initialFormData.keywords || job?.keywords || formData.keywords || "",
      additionalInformation:
        initialFormData.additionalInformation ||
        job?.additionalInformation ||
        formData.additionalInformation ||
        "",
      companyPapers:
        initialFormData.companyPapers ||
        job?.companyPapers ||
        formData.companyPapers ||
        "",
      categories:
        toArray(initialFormData.categories, ",") ||
        toArray(formData.categories, ",") ||
        toArray(job?.categories?.$values || job?.categories, ",") ||
        [],
      skills:
        toArray(initialFormData.skills, ",") ||
        toArray(formData.skills, ",") ||
        toArray(job?.skills?.$values || job?.skills, ",") ||
        [],
      jobBenefits: Array.isArray(initialFormData.jobBenefits)
        ? initialFormData.jobBenefits
        : Array.isArray(formData.jobBenefits)
        ? formData.jobBenefits
        : Array.isArray(job?.jobBenefits?.$values)
        ? job.jobBenefits.$values
        : typeof job?.jobBenefits === "string" && job.jobBenefits
        ? JSON.parse(job.jobBenefits || "[]")
        : [],
      fullname:
        initialFormData.fullname || job?.fullname || formData.fullname || "",
      email: initialFormData.email || job?.email || formData.email || "",
      phone: initialFormData.phone || job?.phone || formData.phone || "",
    };
    updateForm(jobFormData);
    setResponsibilities(toArray(jobFormData.responsibilities));
    setWhoYouAre(toArray(jobFormData.whoYouAre));
    setNiceToHaves(toArray(jobFormData.niceToHaves));
    setSkills(toArray(jobFormData.skills, ","));
    setCategories(toArray(jobFormData.categories, ","));
    setBenefits(
      Array.isArray(jobFormData.jobBenefits) ? jobFormData.jobBenefits : []
    );
    localStorage.setItem("formData3", JSON.stringify(jobFormData));
    console.log("Initialized formData:", jobFormData);
  }, [job, updateForm]); // Removed formData from dependencies

  // Log formData changes for debugging
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

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
      title: formData.title || job?.title || "",
      company: formData.company || job?.company || "",
      city: formData.city || job?.city || "",
      country: formData.country || job?.country || "",
      type: formData.type || job?.type || "",
      description: formData.description || job?.description || "",
      responsibilities: responsibilities,
      whoYouAre: whoYouAre,
      niceToHaves: niceToHaves,
      capacity: formData.capacity || job?.capacity || 0,
      applyBefore:
        formData.applyBefore ||
        (job?.applyBefore ? job.applyBefore.split("T")[0] : ""),
      salaryFrom: formData.salaryFrom || job?.salaryFrom || 0,
      salaryTo: formData.salaryTo || job?.salaryTo || 0,
      companyWebsite: formData.companyWebsite || job?.companyWebsite || "",
      keywords: formData.keywords || job?.keywords || "",
      additionalInformation:
        formData.additionalInformation || job?.additionalInformation || "",
      companyPapers: formData.companyPapers || job?.companyPapers || "",
      categories: categories,
      skills: skills,
      jobBenefits: benefits,
    },
  });

  const salaryFrom = watch("salaryFrom");
  const description = watch("description") || "";
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["emoji"],
    ],
  };

  const JobType = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
  ];

  useEffect(() => {
    setValue("responsibilities", responsibilities);
    setValue("whoYouAre", whoYouAre);
    setValue("niceToHaves", niceToHaves);
    setValue("skills", skills);
    setValue("categories", categories);
    setValue("jobBenefits", benefits);
  }, [
    responsibilities,
    whoYouAre,
    niceToHaves,
    skills,
    categories,
    benefits,
    setValue,
  ]);

  const handleAddtoList = (input, setList, clearInput) => {
    if (!input) return;
    if (typeof input === "object" && input !== null) {
      const hasValue = Object.values(input).some(
        (val) => typeof val === "string" && val.trim()
      );
      if (!hasValue) return;
    }
    if (typeof input === "string" && !input.trim()) return;
    setList((prev) => [...prev, input]);
    if (typeof clearInput === "function") {
      clearInput(
        typeof input === "object" ? { title: "", description: "" } : ""
      );
    }
  };

  const handleRemoveItemFromArray = (index, array, setArray) => {
    const updated = [...array];
    updated.splice(index, 1);
    setArray(updated);
  };

  const onSubmit = (data) => {
    const plainDescription = data.description.replace(/<[^>]+>/g, "").trim();
    const formattedApplyBefore = data.applyBefore
      ? data.applyBefore.split("T")[0]
      : "";

    const cleanedData = {
      title: data.title || "",
      company: formData.company || job?.company || "",
      city: formData.city || job?.city || "",
      country: formData.country || job?.country || "",
      type: data.type || "",
      description: plainDescription,
      responsibilities:
        responsibilities.length > 0 ? responsibilities.join(".") : "",
      whoYouAre: whoYouAre.length > 0 ? whoYouAre.join(".") : "",
      niceToHaves: niceToHaves.length > 0 ? niceToHaves.join(".") : "",
      capacity: Number(data.capacity) || 0,
      applyBefore: formattedApplyBefore,
      salaryFrom: Number(data.salaryFrom) || 0,
      salaryTo: Number(data.salaryTo) || 0,
      companyWebsite: formData.companyWebsite || job?.companyWebsite || "",
      keywords: data.keywords || "",
      additionalInformation: data.additionalInformation || "",
      companyPapers: data.companyPapers || "",
      categories: categories.length > 0 ? categories : [],
      skills: skills.length > 0 ? skills : [],
      jobBenefits: benefits.filter(
        (b) => b.title.trim() || b.description.trim()
      ),
      fullname: formData.fullname || job?.fullname || "",
      email: formData.email || job?.email || "",
      phone: formData.phone || job?.phone || "",
    };

    console.log("Payload sent to server:", cleanedData);
    updateForm(cleanedData);
    localStorage.setItem("formData3", JSON.stringify(cleanedData));
    console.log("Submitted Data:", cleanedData);
    handleFinalSubmit(cleanedData);
  };

  const handleClearForm = () => {
    reset({
      title: "",
      type: "",
      description: "",
      responsibilities: [],
      whoYouAre: [],
      niceToHaves: [],
      capacity: 0,
      applyBefore: "",
      salaryFrom: 0,
      salaryTo: 0,
      keywords: "",
      additionalInformation: "",
      companyPapers: "",
      categories: [],
      skills: [],
      jobBenefits: [],
    });
    setSkills([]);
    setCategories([]);
    setResponsibilities([]);
    setWhoYouAre([]);
    setNiceToHaves([]);
    setBenefits([]);
    setSkillInput("");
    setCategoryInput("");
    setResponsibilityInput("");
    setWhoYouAreInput("");
    setNiceToHavesInput("");
    setBenefitInput({ title: "", description: "" });
    const clearedData = {
      ...formData,
      title: "",
      type: "",
      description: "",
      responsibilities: "",
      whoYouAre: "",
      niceToHaves: "",
      capacity: 0,
      applyBefore: "",
      salaryFrom: 0,
      salaryTo: 0,
      keywords: "",
      additionalInformation: "",
      companyPapers: "",
      categories: [],
      skills: [],
      jobBenefits: [],
    };
    updateForm(clearedData);
    localStorage.setItem("formData3", JSON.stringify(clearedData));
    console.log("Tab3 Form cleared:", clearedData);
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
          description:
            "Job ID is missing. Please ensure a valid job is selected.",
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
          marginLeft: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          borderBottom: "1px solid #7C8493",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#25324B", padding: "10px 0" }}
        >
          Job Info
        </Typography>
      </Box>

      <Box sx={{ width: "100%", padding: "0 12px" }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            padding: "12px",
            width: "100%",
            justifyContent: "space-evenly",
            gap: "16px",
          }}
        >
          {/* Left Side */}
          <Stack direction="column" sx={{ width: { lg: "40%" }, gap: "16px" }}>
            {/* Job Title */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Title (required)
              </label>
              <Input
                {...register("title", { required: true })}
                placeholder="Job title"
                style={{ width: "100%" }}
              />
              {errors.title && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  Job title is required
                </p>
              )}
            </Box>

            {/* Job Type */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Type (required)
              </label>
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger style={{ width: "100%" }}>
                      <SelectValue placeholder={job?.type || "Job Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {JobType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  Job type is required
                </p>
              )}
            </Box>

            {/* Job Description */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Description (required)
              </label>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Job description is required",
                  minLength: {
                    value: 20,
                    message: "Job description must be at least 20 characters",
                  },
                  maxLength: {
                    value: 1050,
                    message: "Job description must not exceed 1050 characters",
                  },
                }}
                render={({ field }) => (
                  <Box>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      placeholder={job?.description || "Job description"}
                      style={{ height: "176px", marginBottom: "40px" }}
                    />
                    <Box
                      style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {description.replace(/<[^>]+>/g, "").length} / 1000
                    </Box>
                  </Box>
                )}
              />
              {errors.description && (
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  {errors.description.message}
                </p>
              )}
            </Box>

            {/* Job Responsibilities */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Responsibilities (required)
              </label>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Input
                  type="text"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  placeholder="Enter Responsibilities"
                  style={{ width: "100%" }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(
                      responsibilityInput,
                      setResponsibilities,
                      setResponsibilityInput
                    )
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(responsibilities) &&
                responsibilities.length > 0 && (
                  <Stack
                    sx={{
                      maxHeight: "150px",
                      width: "95%",
                      overflowY: "auto",
                      marginTop: "8px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      padding: "4px",
                      backgroundColor: "#F9FAFB",
                    }}
                    direction="column"
                  >
                    {responsibilities.map(
                      (item, index) =>
                        item.trim() && (
                          <Paper
                            key={index}
                            sx={{
                              position: "relative",
                              marginBottom: "4px",
                              padding: "12px",
                              width: "100%",
                            }}
                          >
                            <CloseOutlinedIcon
                              sx={{
                                cursor: "pointer",
                                position: "absolute",
                                top: "0",
                                right: "0",
                                fontSize: "16px",
                                color: "#6B7280",
                              }}
                              onClick={() =>
                                handleRemoveItemFromArray(
                                  index,
                                  responsibilities,
                                  setResponsibilities
                                )
                              }
                            />
                            <Typography sx={{ fontWeight: "bold" }}>
                              {item.trim()}
                            </Typography>
                          </Paper>
                        )
                    )}
                  </Stack>
                )}
            </Box>

            {/* Job Benefits */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Benefits
              </label>
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "8px",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    Title
                  </label>
                  <Input
                    type="text"
                    value={benefitInput.title}
                    onChange={(e) =>
                      setBenefitInput({
                        ...benefitInput,
                        title: e.target.value,
                      })
                    }
                    placeholder="Benefit title"
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    Description
                  </label>
                  <Input
                    type="text"
                    value={benefitInput.description}
                    onChange={(e) =>
                      setBenefitInput({
                        ...benefitInput,
                        description: e.target.value,
                      })
                    }
                    placeholder="Benefit description"
                    style={{ width: "100%" }}
                  />
                </Box>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(benefitInput, setBenefits, setBenefitInput)
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(benefits) && benefits.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    // marginTop: "4px",
                    overflowY: "auto",
                    marginTop: "8px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#F9FAFB",
                  }}
                  direction="column"
                >
                  {benefits.map(
                    (item, index) =>
                      (item.title.trim() || item.description.trim()) && (
                        <Paper
                          key={index}
                          sx={{
                            position: "relative",
                            marginBottom: "4px",
                            padding: "12px",
                            width: "100%",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "16px",
                              color: "#6B7280",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                benefits,
                                setBenefits
                              )
                            }
                          />
                          {item.title && (
                            <Typography sx={{ fontWeight: "bold" }}>
                              {item.title}
                            </Typography>
                          )}
                          {item.description && (
                            <Typography sx={{ fontSize: "14px" }}>
                              {item.description}
                            </Typography>
                          )}
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>
          </Stack>

          {/* Right Side */}
          <Stack
            direction={{ xs: "column-reverse", lg: "column" }}
            sx={{
              width: { lg: "45%", xs: "100%" },
              margin: "0 auto",
              gap: "16px",
            }}
          >
            {/* Job Nice to Have */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Nice to Have
              </label>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Input
                  type="text"
                  value={niceToHavesInput}
                  onChange={(e) => setNiceToHavesInput(e.target.value)}
                  placeholder="Nice to have"
                  style={{ width: "100%" }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(
                      niceToHavesInput,
                      setNiceToHaves,
                      setNiceToHavesInput
                    )
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(niceToHaves) && niceToHaves.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    marginTop: "8px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#F9FAFB",
                  }}
                  direction="column"
                >
                  {niceToHaves.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            position: "relative",
                            marginBottom: "4px",
                            padding: "12px",
                            width: "100%",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "16px",
                              color: "#6B7280",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                niceToHaves,
                                setNiceToHaves
                              )
                            }
                          />
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.trim()}
                          </Typography>
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>

            {/* Job Categories */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Categories
              </label>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Category"
                  style={{ width: "100%" }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(
                      categoryInput,
                      setCategories,
                      setCategoryInput
                    )
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(categories) && categories.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    marginTop: "8px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#F9FAFB",
                  }}
                  direction="row"
                >
                  {categories.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            position: "relative",
                            margin: "2px 4px",
                            padding: "12px",
                            width: "fit-content",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "16px",
                              color: "#6B7280",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                categories,
                                setCategories
                              )
                            }
                          />
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.trim()}
                          </Typography>
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>

            {/* Job Skills */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Skills
              </label>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Skill"
                  style={{ width: "100%" }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(skillInput, setSkills, setSkillInput)
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(skills) && skills.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    marginTop: "8px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#F9FAFB",
                  }}
                  direction="row"
                >
                  {skills.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            position: "relative",
                            margin: " 2px 4px",
                            padding: "12px",
                            width: "fit-content",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "16px",
                              color: "#6B7280",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                skills,
                                setSkills
                              )
                            }
                          />
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.trim()}
                          </Typography>
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>

            {/* Job Who You Are */}
            <Box>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Job Who You Are
              </label>
              <Stack direction="row" sx={{ width: "100%" }}>
                <Input
                  type="text"
                  value={whoYouAreInput}
                  onChange={(e) => setWhoYouAreInput(e.target.value)}
                  placeholder="Who you are"
                  style={{ width: "100%" }}
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(
                      whoYouAreInput,
                      setWhoYouAre,
                      setWhoYouAreInput
                    )
                  }
                  sx={{ display: "flex", alignItems: "flex-end" }}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(whoYouAre) && whoYouAre.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    marginTop: "8px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "4px",
                    backgroundColor: "#F9FAFB",
                  }}
                  direction="column"
                >
                  {whoYouAre.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            position: "relative",
                            marginBottom: "4px",
                            padding: "12px",
                            width: "100%",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "0",
                              right: "0",
                              fontSize: "16px",
                              color: "#6B7280",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                whoYouAre,
                                setWhoYouAre
                              )
                            }
                          />
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.trim()}
                          </Typography>
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>

            {/* Salary */}
            <Box sx={{ width: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "500",
                  marginTop: "4px",
                  padding: "8px 0",
                  color: "#244F6F",
                }}
              >
                Salary
              </label>
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "8px",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    From
                  </label>
                  <Input
                    {...register("salaryFrom", {
                      required: true,
                      min: 100,
                    })}
                    type="number"
                    placeholder="Salary From"
                    style={{ width: "100%" }}
                  />
                  {errors.salaryFrom && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      Salary From must be at least 100
                    </p>
                  )}
                </Box>
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    To
                  </label>
                  <Input
                    {...register("salaryTo", {
                      required: true,
                      min: {
                        value: salaryFrom,
                        message: "Salary To must be greater than Salary From",
                      },
                    })}
                    type="number"
                    placeholder="Salary To"
                    style={{ width: "100%" }}
                  />
                  {errors.salaryTo && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.salaryTo.message}
                    </p>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Apply Before & Capacity */}
            <Box>
              <Stack
                direction="row"
                sx={{
                  width: "100%",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "8px",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "500",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    Apply Before
                  </label>
                  <Input
                    type="date"
                    {...register("applyBefore", { required: true })}
                    style={{ width: "100%" }}
                  />
                  {errors.applyBefore && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      Application deadline is required
                    </p>
                  )}
                </Box>
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      display: "block",
                      padding: "4px 0",
                      color: "#244F6F",
                    }}
                  >
                    Capacity
                  </label>
                  <Input
                    {...register("capacity", {
                      required: true,
                      min: 10,
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="Capacity"
                    style={{ width: "100%" }}
                  />
                  {errors.capacity && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      Capacity must be at least 10
                    </p>
                  )}
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Submit and Clear Buttons */}
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
                type="button"
                variant="outlined"
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
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="contained"
               sx={{
                  width: "45%",
                  color: "#fff",
                  backgroundColor: "#244F6F",
                  border: "1px solid #333",
                  borderRadius: "10px",
                }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default Tab3;
