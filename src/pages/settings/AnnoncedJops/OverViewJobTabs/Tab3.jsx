import React, { useEffect } from "react";
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

  // Helper function to ensure array initialization
  const toArray = (data, separator = ".") => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string" && data)
      return data.split(separator).filter((item) => item.trim());
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
    console.log("job prop on render:", job);
    const savedData = localStorage.getItem("formData3");
    const initialFormData = savedData ? JSON.parse(savedData) : {};

    if (job && !formData.title && !formData.company) {
      const jobFormData = {
        title: job.title || "",
        company: job.company || "",
        city: job.city || "",
        country: job.country || "",
        type: job.type || "",
        description: job.description || "",
        responsibilities:
          typeof job.responsibilities === "string" ? job.responsibilities : "",
        whoYouAre: typeof job.whoYouAre === "string" ? job.whoYouAre : "",
        niceToHaves: typeof job.niceToHaves === "string" ? job.niceToHaves : "",
        capacity: job.capacity || 0,
        applyBefore: job.applyBefore ? job.applyBefore.split("T")[0] : "",
        salaryFrom: job.salaryFrom || 0,
        salaryTo: job.salaryTo || 0,
        companyWebsite: job.companyWebsite || "",
        keywords: job.keywords || "",
        additionalInformation: job.additionalInformation || "",
        companyPapers: job.companyPapers || "",
        categories: Array.isArray(job.categories?.$values)
          ? job.categories.$values
          : toArray(job?.categories, ","),
        skills: Array.isArray(job.skills?.$values)
          ? job.skills.$values
          : toArray(job?.skills, ","),
        jobBenefits: Array.isArray(job.jobBenefits?.$values)
          ? job.jobBenefits.$values
          : typeof job.jobBenefits === "string"
          ? JSON.parse(job.jobBenefits || "[]")
          : [],
        fullname: formData.fullname || "",
        email: formData.email || "",
        phone: formData.phone || "",
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
      console.log("Initialized formData with job data:", jobFormData);
    } else if (savedData && !formData.title && !formData.company) {
      updateForm({
        ...initialFormData,
        fullname: formData.fullname || "",
        email: formData.email || "",
        phone: formData.phone || "",
      });
      setResponsibilities(toArray(initialFormData.responsibilities));
      setWhoYouAre(toArray(initialFormData.whoYouAre));
      setNiceToHaves(toArray(initialFormData.niceToHaves));
      setSkills(toArray(initialFormData.skills, ","));
      setCategories(toArray(initialFormData.categories, ","));
      setBenefits(
        Array.isArray(initialFormData.jobBenefits)
          ? initialFormData.jobBenefits
          : []
      );
      console.log("Initialized formData with localStorage:", initialFormData);
    }
  }, [
    job,
    updateForm,
    formData.title,
    formData.company,
    formData.fullname,
    formData.email,
    formData.phone,
  ]);

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
      company: data.company || "",
      city: data.city || "",
      country: data.country || "",
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
      companyWebsite: data.companyWebsite || "",
      keywords: data.keywords || "",
      additionalInformation: data.additionalInformation || "",
      companyPapers: data.companyPapers || "",
      categories: categories.length > 0 ? categories : [],
      skills: skills.length > 0 ? skills : [],
      jobBenefits: benefits.filter(
        (b) => b.title.trim() || b.description.trim()
      ),
      fullname: formData.fullname || "",
      email: formData.email || "",
      phone: formData.phone || "",
    };

    console.log("Payload sent to server:", cleanedData);
    updateForm({
      ...cleanedData,
      categories: cleanedData.categories.join(","),
      skills: cleanedData.skills.join(","),
    });
    localStorage.setItem(
      "formData3",
      JSON.stringify({
        ...cleanedData,
        categories: cleanedData.categories.join(","),
        skills: cleanedData.skills.join(","),
      })
    );
    console.log("Submitted Data:", cleanedData);
    handleFinalSubmit(cleanedData);
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
    <Stack direction="column" className="w-full">
      <Box className="w-[98%] ml-auto my-5 border-b border-gray-300">
        <Typography variant="h5" className="font-bold text-[#25324B] py-2.5">
          Job Info
        </Typography>
      </Box>

      <Box className="space-y-4 w-full">
        <Stack
          direction={{ xs: "column", lg: "row" }}
          className="p-3 w-full flex justify-evenly gap-4"
        >
          {/* Left Side */}
          <Stack direction="column" className="lg:w-[40%] space-y-4">
            {/* Job Title */}
            <Box>
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Title (required)
              </label>
              <Input
                {...register("title", { required: true })}
                placeholder="Job title"
                className="w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Job title is required</p>
              )}
            </Box>

            {/* Job Type */}
            <Box>
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Type (required)
              </label>
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
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
                <p className="text-red-500 text-sm">Job type is required</p>
              )}
            </Box>

            {/* Job Description */}
            <Box>
              <label className="block font-medium py-2 text-[#244F6F]">
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
                    value: 550,
                    message: "Job description must not exceed 550 characters",
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
                      className="h-44 mb-10"
                    />
                    <Box className="text-sm text-gray-500 text-right">
                      {description.replace(/<[^>]+>/g, "").length} / 550
                    </Box>
                  </Box>
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </Box>

            {/* Job Responsibilities */}
            <Box>
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Responsibilities (required)
              </label>
              <Stack direction="row" className="w-full">
                <Input
                  type="text"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  placeholder="Enter Responsibilities"
                  className="w-full"
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
                  className="flex items-end"
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
                      mt: 2,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: 1,
                      background: "#f9f9f9",
                    }}
                    direction="column"
                  >
                    {responsibilities.map(
                      (item, index) =>
                        item.trim() && (
                          <Paper
                            key={index}
                            sx={{
                              p: 1,
                              m: 1,
                              borderRadius: "5px",
                              position: "relative",
                            }}
                          >
                            <CloseOutlinedIcon
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleRemoveItemFromArray(
                                  index,
                                  responsibilities,
                                  setResponsibilities
                                )
                              }
                            />
                            <Typography className="font-bold">
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
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Benefits
              </label>
              <Stack direction="row" className="w-full items-center mb-5 gap-2">
                <Box sx={{ width: "50%" }}>
                  <label className="block text-sm py-1 text-[#244F6F]">
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
                    className="w-full"
                  />
                </Box>
                <Box sx={{ width: "50%" }}>
                  <label className="block text-sm py-1 text-[#244F6F]">
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
                    className="w-full"
                  />
                </Box>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(benefitInput, setBenefits, setBenefitInput)
                  }
                  className="flex items-end"
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(benefits) && benefits.length > 0 && (
                <Stack
                  sx={{
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    mt: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    background: "#f9f9f9",
                  }}
                  direction="column"
                >
                  {benefits.map(
                    (item, index) =>
                      (item.title.trim() || item.description.trim()) && (
                        <Paper
                          key={index}
                          sx={{
                            p: 1,
                            m: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: "12px",
                              cursor: "pointer",
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
                            <Typography className="font-bold">
                              {item.title}
                            </Typography>
                          )}
                          {item.description && (
                            <Typography className="text-sm">
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
            sx={{ width: { xs: "100%", lg: "50%" } }}
          >
            {/* Job Nice to Have */}
            <Box>
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Nice to Have
              </label>
              <Stack direction="row" className="w-full">
                <Input
                  type="text"
                  value={niceToHavesInput}
                  onChange={(e) => setNiceToHavesInput(e.target.value)}
                  placeholder="Nice to have"
                  className="w-full"
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
                  className="flex items-end"
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
                    mt: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    background: "#f9f9f9",
                  }}
                  direction="column"
                >
                  {niceToHaves.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            p: 1,
                            m: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                niceToHaves,
                                setNiceToHaves
                              )
                            }
                          />

                          <Typography className="font-bold">
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
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Categories
              </label>
              <Stack direction="row" className="w-full">
                <Input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Category"
                  className="w-full"
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
                  className="flex items-end"
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(categories) && categories.length > 0 && (
                <Stack
                  sx={{
                    flexWrap: "wrap",
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    mt: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    background: "#f9f9f9",
                  }}
                  direction="row"
                >
                  {categories.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            p: 1,
                            m: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                categories,
                                setCategories
                              )
                            }
                          />
                          <Typography className="font-bold">
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
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Skills
              </label>
              <Stack direction="row" className="w-full">
                <Input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Skill"
                  className="w-full"
                />
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleAddtoList(skillInput, setSkills, setSkillInput)
                  }
                  className="flex items-end"
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {Array.isArray(skills) && skills.length > 0 && (
                <Stack
                  sx={{
                    flexWrap: "wrap",
                    maxHeight: "150px",
                    width: "95%",
                    overflowY: "auto",
                    mt: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    background: "#f9f9f9",
                  }}
                  direction="row"
                >
                  {skills.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            p: 1,
                            m: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                skills,
                                setSkills
                              )
                            }
                          />
                          <Typography className="font-bold">
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
              <label className="block font-medium py-2 text-[#244F6F]">
                Job Who You Are
              </label>
              <Stack direction="row" className="w-full">
                <Input
                  type="text"
                  value={whoYouAreInput}
                  onChange={(e) => setWhoYouAreInput(e.target.value)}
                  placeholder="Who you are"
                  className="w-full"
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
                  className="flex items-end"
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
                    mt: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    background: "#f9f9f9",
                  }}
                  direction="column"
                >
                  {whoYouAre.map(
                    (item, index) =>
                      item.trim() && (
                        <Paper
                          key={index}
                          sx={{
                            p: 1,
                            m: 1,
                            borderRadius: "5px",
                            position: "relative",
                          }}
                        >
                          <CloseOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleRemoveItemFromArray(
                                index,
                                whoYouAre,
                                setWhoYouAre
                              )
                            }
                          />
                          <Typography className="font-bold">
                            {item.trim()}
                          </Typography>
                        </Paper>
                      )
                  )}
                </Stack>
              )}
            </Box>

            {/* Salary */}
            <Box>
              <label className="block font-medium mt-1 py-2 text-[#244F6F]">
                Salary
              </label>
              <Stack direction="row" className="w-full items-center mb-5 gap-2">
                <Box sx={{ width: "50%" }}>
                  <label className="block text-sm py-1 text-[#244F6F]">
                    From
                  </label>
                  <Input
                    {...register("salaryFrom", {
                      required: true,
                      min: 100,
                    })}
                    type="number"
                    placeholder="Salary From"
                    className="w-full"
                  />
                  {errors.salaryFrom && (
                    <p className="text-red-500 text-sm">
                      Salary From must be at least 100
                    </p>
                  )}
                </Box>
                <Box sx={{ width: "50%" }}>
                  <label className="block text-sm py-1 text-[#244F6F]">
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
                    className="w-full"
                  />
                  {errors.salaryTo && (
                    <p className="text-red-500 text-sm">
                      {errors.salaryTo.message}
                    </p>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Apply Before & Capacity */}
            <Box sx={{ width: "100%" }}>
              <Stack direction="row"  className="w-full items-center mb-5 gap-2">
                <Box sx={{ width: "48%"  }}>
                  <label className="block font-medium py-2 text-[#244F6F]">
                    Apply Before
                  </label>
                  <Input
                    type="date"
                    {...register("applyBefore", { required: true })}
                    
                  />
                  {errors.applyBefore && (
                    <p className="text-red-500 text-sm">
                      Application deadline is required
                    </p>
                  )}
                </Box>
                <Box sx={{ width: "48%" }}>
                  <label className="block font-medium py-2 text-[#244F6F]">
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
                    className="w-full"
                  />
                  {errors.capacity && (
                    <p className="text-red-500 text-sm">
                      Capacity must be at least 10
                    </p>
                  )}
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Submit Button */}
        <Box className="mt-4">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{ backgroundColor: "#244F6F", color: "white" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default Tab3;
