import React from "react";
import { useForm, Controller } from "react-hook-form";

// Custom Components
import { Input } from "@/components/ui/input";
import { useJobForm } from "../../../context/jobApplicationFormContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";

// MUI Components
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ApplicationForm3 = () => {
  const navigate = useNavigate();

  const { updateForm, formData } = useJobForm();

  const [skills, setSkills] = React.useState(
    Array.isArray(formData.skills)
      ? formData.skills
      : typeof formData.skills === "string"
      ? formData.skills.split(",").filter((item) => typeof item === "string" && item.trim())
      : []
  );
  const [skillInput, setSkillInput] = React.useState("");

  const [categories, setCategories] = React.useState(
    Array.isArray(formData.categories)
      ? formData.categories
      : typeof formData.categories === "string"
      ? formData.categories.split(",").filter((item) => typeof item === "string" && item.trim())
      : []
  );
  const [categoryInput, setCategoryInput] = React.useState("");

  const [responsibilities, setResponsibilities] = React.useState(
    Array.isArray(formData.responsibilities)
      ? formData.responsibilities
      : typeof formData.responsibilities === "string"
      ? formData.responsibilities.split(",").filter((item) => typeof item === "string" && item.trim())
      : []
  );
  const [responsibilityInput, setResponsibilityInput] = React.useState("");

  const [whoYouAre, setWhoYouAre] = React.useState(
    Array.isArray(formData.whoYouAre)
      ? formData.whoYouAre
      : typeof formData.whoYouAre === "string"
      ? formData.whoYouAre.split(",").filter((item) => typeof item === "string" && item.trim())
      : []
  );
  const [whoYouAreInput, setWhoYouAreInput] = React.useState("");

  const [niceToHaves, setNiceToHaves] = React.useState(
    Array.isArray(formData.niceToHaves)
      ? formData.niceToHaves
      : typeof formData.niceToHaves === "string"
      ? formData.niceToHaves.split(",").filter((item) => typeof item === "string" && item.trim())
      : []
  );
  const [niceToHavesInput, setNiceToHavesInput] = React.useState("");

  const [benefits, setBenefits] = React.useState(
    Array.isArray(formData.jobBenefits)
      ? formData.jobBenefits
      : typeof formData.jobBenefits === "string"
      ? JSON.parse(formData.jobBenefits || "[]").filter((item) => typeof item === "object" && item !== null)
      : []
  );
  const [benefitInput, setBenefitInput] = React.useState({
    title: "",
    description: "",
  });

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
      clearInput(typeof input === "object" ? { title: "", description: "" } : "");
    }
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: formData.title || "",
      company: formData.company || "",
      city: formData.city || "",
      country: formData.country || "",
      type: formData.type || "",
      description: formData.description || "",
      responsibilities: formData.responsibilities || [],
      whoYouAre: formData.whoYouAre || [],
      niceToHaves: formData.niceToHaves || [],
      capacity: formData.capacity || 0,
      applyBefore: formData.applyBefore || "",
      salaryFrom: formData.salaryFrom || 0,
      salaryTo: formData.salaryTo || 0,
      companyWebsite: formData.companyWebsite || "",
      keywords: formData.keywords || "",
      additionalInformation: formData.additionalInformation || "",
      companyPapers: formData.companyPapers || "",
      categories: formData.categories || [],
      skills: formData.skills || [],
      jobBenefits: formData.jobBenefits || [],
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

  const JobType = [
    { label: "Full Time", value: "Full Time" },
    { label: "Part Time", value: "Part Time" },
    { label: "Contract", value: "Contract" },
    { label: "Internship", value: "Internship" },
  ];

  React.useEffect(() => {
    setValue("responsibilities", responsibilities);
    setValue("whoYouAre", whoYouAre);
    setValue("niceToHaves", niceToHaves);
    setValue("skills", skills);
    setValue("categories", categories);
    setValue("jobBenefits", benefits);
  }, [responsibilities, whoYouAre, niceToHaves, skills, categories, benefits]);

  const onSubmit = (data) => {
    const plainDescription = data.description.replace(/<[^>]+>/g, "").trim();

    const formattedApplyBefore = new Date(data.applyBefore).toISOString();

    const cleanedData = {
      title: data.title || "",
      company: data.company || "",
      city: data.city || "",
      country: data.country || "",
      type: data.type || "",
      description: plainDescription,
      responsibilities: responsibilities.length > 0 ? responsibilities.join(",") : "",
      whoYouAre: whoYouAre.length > 0 ? whoYouAre.join(",") : "",
      niceToHaves: niceToHaves.length > 0 ? niceToHaves.join(",") : "",
      capacity: Number(data.capacity) || 0,
      applyBefore: formattedApplyBefore,
      salaryFrom: Number(data.salaryFrom) || 0,
      salaryTo: Number(data.salaryTo) || 0,
      companyWebsite: data.companyWebsite || "",
      keywords: data.keywords || "",
      additionalInformation: data.additionalInformation || "",
      companyPapers: data.companyPapers || "",
      categories: categories,
      skills: skills,
      jobBenefits: benefits.filter((b) => b.title.trim() || b.description.trim()),
    };

    updateForm(cleanedData);
    localStorage.setItem("formData3", JSON.stringify(cleanedData));
    console.log("Submitted Data:", cleanedData);
    navigate("/jobs");
  };

  const handleRemoveItemFromArray = (index, array, setArray) => {
    const updated = [...array];
    updated.splice(index, 1);
    setArray(updated);
  };

  return (
    <form
      id="form-3"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      style={{ width: "100%", backgroundColor: "#f5f5f5" }}
    >
      <Stack
        spacing={4}
        direction={{ xs: "column", lg: "row" }}
        padding={3}
        className="w-full d-flex justify-evenly"
      >
        {/* Job title */}
        <Stack
          spacing={1}
          direction={"column"}
          sx={{ width: { xs: "100%", lg: "40%" } }}
        >
          <div>
            <label className="block font-medium py-2">{`Job Title (Required)`}</label>
            <Input
              {...register("title", { required: true })}
              placeholder="Enter your Job Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Job title is required</p>
            )}
          </div>

          {/* Job Type */}
          <label className="block font-medium py-2">{`Job Type (Required)`}</label>
          <Stack spacing={1} direction={"row"}>
            <Stack sx={{ width: "100%" }}>
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Job Type" />
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
            </Stack>
          </Stack>

          {/* Job Description */}
          <Stack>
            <label color="#0F3552" className="block font-medium py-2">
              Job Description (required)
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: true, maxLength: 500 }}
              render={({ field }) => (
                <>
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={modules}
                    placeholder="Describe your Job"
                    style={{ height: "180px", marginBottom: "40px" }}
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {description.replace(/<[^>]+>/g, "").length} / 500
                  </div>
                </>
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">Job description is required</p>
            )}
          </Stack>

          {/* Job Responsibilities */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Job Responsibilities (required)
            </label>
            <Stack direction={"row"} sx={{ width: "100%" }}>
              <Input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                placeholder="Enter Responsibilities"
              />
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(
                    responsibilityInput,
                    setResponsibilities,
                    setResponsibilityInput
                  );
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {responsibilities.length > 0 && (
              <Stack
                spacing={1}
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
                direction={"column"}
              >
                {responsibilities.map(
                  (item, index) =>
                    item.trim() && (
                      <Paper
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                          width: "100%",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(
                              index,
                              responsibilities,
                              setResponsibilities
                            );
                          }}
                        />
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Job Benefits */}
          <Stack>
            <label color="#0F3552" className="block font-medium py-2">
              Job Benefits (Optional)
            </label>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ width: "100%", alignItems: "center", mb: "20px" }}
            >
              <Stack
                direction={"column"}
                sx={{ width: { sm: "100%", lg: "50%" } }}
              >
                <label className="block font-small py-1">title</label>
                <Input
                  type="text"
                  value={benefitInput.title}
                  onChange={(e) =>
                    setBenefitInput({ ...benefitInput, title: e.target.value })
                  }
                  placeholder="Benefit title"
                />
              </Stack>
              <Stack
                direction={"column"}
                sx={{ width: { sm: "100%", lg: "50%" } }}
              >
                <label className="block font-thin py-1">description</label>
                <Input
                  value={benefitInput.description}
                  onChange={(e) =>
                    setBenefitInput({
                      ...benefitInput,
                      description: e.target.value,
                    })
                  }
                  placeholder="Benefit description"
                />
              </Stack>
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(benefitInput, setBenefits, setBenefitInput);
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {benefits.some((b) => b.title.trim() || b.description.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  maxHeight: "150px",
                  width: "90%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 1,
                  background: "#f9f9f9",
                }}
                direction={"column"}
              >
                {benefits.map(
                  (item, index) =>
                    (item.title.trim() || item.description.trim()) && (
                      <Paper
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                          width: "100%",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(index, benefits, setBenefits);
                          }}
                        />
                        {item.title && (
                          <Typography fontWeight="bold">{item.title}</Typography>
                        )}
                        {item.description && (
                          <Typography variant="body2">{item.description}</Typography>
                        )}
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* right side */}
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "45%" }, margin: "auto" }}
          direction={{ xs: "column-reverse", lg: "column" }}
        >
          <Paper
            className="p-5 text-center"
            sx={{
              borderRadius: "10px",
              backgroundColor: "#EEF7FE",
              width: "75%",
              mt: { xs: 2, lg: 5 },
              mb: 5,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              <TipsAndUpdatesOutlinedIcon /> Job Announce Tips
            </Typography>
            <p className="text-sm text-gray-600">
              Looking to improve & boost your Post? <br />
              Check out our{" "}
              <Link to={"/help/faqs"} className="text-blue-600 underline">
                FAQs
              </Link>{" "}
              for Tips and Tricks!
            </p>
          </Paper>
          {/* Job Nice to have */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Job Nice to have (required)
            </label>
            <Stack direction={"row"} sx={{ width: "100%" }}>
              <Input
                type="text"
                value={niceToHavesInput}
                onChange={(e) => setNiceToHavesInput(e.target.value)}
                placeholder="Nice to have"
              />
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(niceToHavesInput, setNiceToHaves, setNiceToHavesInput);
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {niceToHaves.length > 0 && (
              <Stack
                spacing={1}
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
                direction={"column"}
              >
                {niceToHaves.map(
                  (item, index) =>
                    item.trim() && (
                      <Paper
                        key={index}
                        style={{
                          width: "100%",
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(index, niceToHaves, setNiceToHaves);
                          }}
                        />
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>
          {/* Job Categories */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Job Categories (required)
            </label>
            <Stack direction={"row"} sx={{ width: "100%" }}>
              <Input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Category"
              />
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(categoryInput, setCategories, setCategoryInput);
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {categories.length > 0 && (
              <Stack
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  maxHeight: "150px",
                  maxWidth: "100%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 1,
                  background: "#f9f9f9",
                }}
                direction={"row"}
              >
                {categories.map(
                  (item, index) =>
                    item.trim() && (
                      <Paper
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                          width: "fit-content",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(index, categories, setCategories);
                          }}
                        />
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Job Skills */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Job Skills (required)
            </label>
            <Stack direction={"row"} sx={{ width: "100%" }}>
              <Input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Skill"
              />
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(skillInput, setSkills, setSkillInput);
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {skills.length > 0 && (
              <Stack
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  maxHeight: "150px",
                  maxWidth: "100%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 1,
                  background: "#f9f9f9",
                }}
                direction={"row"}
              >
                {skills.map(
                  (item, index) =>
                    item.trim() && (
                      <Paper
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                          width: "fit-content",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(index, skills, setSkills);
                          }}
                        />
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Job Who you are */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Job Who you are (required)
            </label>
            <Stack direction={"row"} sx={{ width: "100%" }}>
              <Input
                type="text"
                value={whoYouAreInput}
                onChange={(e) => setWhoYouAreInput(e.target.value)}
                placeholder="Who you are"
              />
              <IconButton
                color="primary"
                onClick={() => {
                  handleAddtoList(whoYouAreInput, setWhoYouAre, setWhoYouAreInput);
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
            {whoYouAre.length > 0 && (
              <Stack
                spacing={1}
                sx={{
                  maxHeight: "150px",
                  width: "95%",
                  overflowY: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "5px",
                  background: "#f9f9f9",
                }}
                direction={"column"}
              >
                {whoYouAre.map(
                  (item, index) =>
                    item.trim() && (
                      <Paper
                        key={index}
                        style={{
                          position: "relative",
                          marginBottom: "5px",
                          padding: "11px",
                          width: "100%",
                        }}
                      >
                        <CloseOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            fontSize: "14px",
                            color: "gray",
                          }}
                          onClick={() => {
                            handleRemoveItemFromArray(index, whoYouAre, setWhoYouAre);
                          }}
                        />
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Salary */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium mt-1 py-2">
              Salary (required)
            </label>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ width: "100%", alignItems: "center", mb: "20px" }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ width: { sm: "100%", lg: "50%" } }}
              >
                <label className="block font-small py-1">From</label>
                <Input
                  {...register("salaryFrom", { required: true })}
                  type="number"
                  placeholder="Salary From"
                />
              </Stack>
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ width: { sm: "100%", lg: "50%" } }}
              >
                <label className="block font-thin py-1">To</label>
                <Input
                  {...register("salaryTo", { required: true })}
                  type="number"
                  placeholder="Salary To"
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Apply Before & Capacity */}
          <Stack sx={{ width: "100%" }}>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ width: "100%", alignItems: "center", mb: "20px" }}
            >
              <Stack sx={{ width: "100%" }}>
                <label className="block font-medium py-2">
                  Apply Before (required)
                </label>
                <Input
                  type="date"
                  {...register("applyBefore", { required: true })}
                  defaultValue={formData.applyBefore || ""}
                />
                {errors.applyBefore && (
                  <p className="text-red-500 text-sm">
                    Application deadline is required
                  </p>
                )}
              </Stack>
              <Stack
                direction={"column"}
                sx={{ width: { sm: "100%", lg: "50%" } }}
              >
                <label className="block font-thin py-1">Capacity</label>
                <Input
                  {...register("capacity", { required: true })}
                  type="number"
                  placeholder="Capacity"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-sm">Capacity is required</p>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};

export default ApplicationForm3;