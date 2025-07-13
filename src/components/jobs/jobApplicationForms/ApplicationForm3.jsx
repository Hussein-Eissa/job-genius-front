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
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
// import ReactQuill;
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import useMediaQuery from "@mui/material/useMediaQuery";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

const ApplicationForm2 = () => {
  const { updateForm, formData } = useJobForm();

  const [skills, setSkills] = React.useState(formData.skills || []);
  const [skillInput, setSkillInput] = React.useState("");

  const [categories, setCategories] = React.useState(formData.categories || []);
  const [categoryInput, setCategoryInput] = React.useState("");

  const [responsibilities, setResponsibilities] = React.useState(
    formData.responsibilities || []
  );
  const [responsibilityInput, setResponsibilityInput] = React.useState("");

  const [whoYouAre, setWhoYouAre] = React.useState(formData.whoYouAre || []);
  const [whoYouAreInput, setWhoYouAreInput] = React.useState("");

  const [niceToHaves, setNiceToHaves] = React.useState(
    formData.responsibilities || []
  );
  const [niceToHavesInput, setNiceToHavesInput] = React.useState("");

  const [benefits, setBenefits] = React.useState(formData.jobBenefits || []);
  const [benefitInput, setBenefitInput] = React.useState({
    title: "",
    description: "",
  });

  // Custom Functions (adding Handlers)
  const handleAddBenefit = () => {
    if (!benefitInput.title || !benefitInput.description) return;
    setBenefits((prev) => [...prev, benefitInput]);
    setBenefitInput({ title: "", description: "" });
  };

  const handleAddSkill = () => {
    if (!skillInput) return;
    setSkills((prev) => [...prev, skillInput]);
  };

  const handleAddResponsibility = () => {
    if (!responsibilityInput) return;
    setResponsibilities((prev) => [...prev, responsibilityInput]);
  };

  const handleAddCategory = () => {
    if (!categoryInput) return;
    setCategories((prev) => [...prev, categoryInput]);
  };

  const handleAddWhoYouAre = () => {
    if (!whoYouAreInput) return;
    setWhoYouAre((prev) => [...prev, whoYouAreInput]);
  };

  const handleAddNiceToHave = () => {
    if (!niceToHavesInput) return;
    setNiceToHaves((prev) => [...prev, niceToHavesInput]);
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue, // <-- ضيفي ده
    formState: { errors },
  } = useForm({
    defaultValues: {
      salaryTo: formData.salaryTo,
      salaryFrom: formData.salaryFrom,
      applyBefore: formData.applyBefore,
      capacity: formData.capacity,
      title: formData.title,
      type: formData.type,
      responsibilities: formData.responsibilities || [],
      whoYouAre: formData.whoYouAre || [],
      niceToHaves: formData.niceToHaves || [],
      skills: formData.skills || [],
      jobBenefits: formData.jobBenefits || [],
      categories: formData.categories || [],
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
  }, [responsibilities, whoYouAre, niceToHaves]);

  const onSubmit = (data) => {
    const plainDescription = data.description.replace(/<[^>]+>/g, "").trim();
    const plainResponsibilities = Array.isArray(data.responsibilities)
      ? data.responsibilities.join(". ")
      : data.responsibilities;

    const plainWhoYouAre = Array.isArray(data.whoYouAre)
      ? data.whoYouAre.join(". ")
      : data.whoYouAre;

    const plainNiceToHaves = Array.isArray(data.niceToHaves)
      ? data.niceToHaves.join(". ")
      : data.niceToHaves;

    const cleanedData = {
      ...data,
      whoYouAre: plainWhoYouAre,
      niceToHaves: plainNiceToHaves,
      description: plainDescription,
      responsibilities: plainResponsibilities,
      jobBenefits: benefits.filter(
        (b) => b.title.trim() || b.description.trim()
      ),
      skills: skills.filter((s) => s.trim()),
      categories: categories.filter((c) => c.trim()),
    };

    updateForm(cleanedData);
    localStorage.setItem("formData3", JSON.stringify(cleanedData));
    console.log(cleanedData);
    // onNext();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 "
      style={{ width: "100%" }}
    >
      <Stack spacing={4} direction={{ xs: "column", lg: "row" }} padding={3}>
        {/* Job title */}
        <Stack
          spacing={1}
          direction={"column"}
          sx={{ width: { xs: "100%", lg: "50%" } }}
        >
          <div>
            <label className="block font-medium py-2">{` Job Title (Required)`}</label>
            <Input
              {...register("title", { required: true })}
              placeholder="Enter your Job Title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Job title is required</p>
            )}
          </div>

          {/* Job Type */}
          <label className="block font-medium py-2">{` Job Type (Required)`}</label>
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
              <p className="text-red-500 text-sm">
                Job description is required
              </p>
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
              {errors.responsibilities && (
                <p className="text-red-500 text-sm">
                  Responsibilities is required
                </p>
              )}

              <IconButton
                color="primary"
                onClick={() => {
                  handleAddResponsibility();
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {responsibilities.some((b) => b.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  width: "100%",
                  maxHeight: "150px",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
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
                          marginBottom: "10px",
                          padding: "8px",
                          width: "100%",
                        }}
                      >
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
                  handleAddBenefit();
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
                  overflowY: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
                  background: "#f9f9f9",
                }}
              >
                {benefits.map(
                  (item, index) =>
                    (item.title.trim() || item.description.trim()) && (
                      <Paper
                        key={index}
                        style={{ marginBottom: "10px", padding: "8px" }}
                      >
                        {item.title && (
                          <Typography fontWeight="bold">
                            {item.title}
                          </Typography>
                        )}
                        {item.description && (
                          <Typography variant="body2">
                            {item.description}
                          </Typography>
                        )}
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          <p className="text-xs text-gray-500 mt-3">
            By sending the request you can confirm that you accept our{" "}
            <a href="#" className="text-blue-500 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 underline">
              Privacy Policy
            </a>
            .
          </p>
        </Stack>
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "50%" }, margin: "auto" }}
          direction={{ xs: "column-reverse", lg: "column" }}
        >
          <Paper
            className="p-5 text-center "
            sx={{
              borderRadius: "10px",
              backgroundColor: "#EEF7FE",
              width: "100%",
              mt: { xs: 2, lg: 5 },
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
              {errors.skills && (
                <p className="text-red-500 text-sm">Job Skills is required</p>
              )}

              <IconButton
                color="primary"
                onClick={() => {
                  handleAddSkill();
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {skills.some((b) => b.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  maxHeight: "150px",
                  maxWidth: "95%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
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
                          marginBottom: "10px",
                          padding: "8px",
                          width: "fit-content",
                        }}
                      >
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
              {errors.categories && (
                <p className="text-red-500 text-sm">Category is required</p>
              )}

              <IconButton
                color="primary"
                onClick={() => {
                  handleAddCategory();
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {categories.some((b) => b.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  maxHeight: "150px",
                  maxWidth: "95%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
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
                          marginBottom: "10px",
                          padding: "8px",
                          width: "fit-content",
                        }}
                      >
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

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
                  handleAddNiceToHave();
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {niceToHaves.some((b) => b.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  maxHeight: "150px",
                  maxWidth: "95%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
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
                          marginBottom: "10px",
                          padding: "8px",
                          width: "fit-content",
                        }}
                      >
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Who you are */}
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
                  handleAddWhoYouAre();
                }}
                sx={{ display: "flex", alignSelf: "end" }}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {whoYouAre.some((b) => b.trim()) && (
              <Stack
                spacing={1}
                sx={{
                  maxHeight: "150px",
                  maxWidth: "95%",
                  overflowY: "auto",
                  mx: "auto",
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: 2,
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
                          marginBottom: "10px",
                          padding: "8px",
                          width: "fit-content",
                        }}
                      >
                        <Typography fontWeight="bold">{item.trim()}</Typography>
                      </Paper>
                    )
                )}
              </Stack>
            )}
          </Stack>

          {/* Salary */}
          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Salary (required)
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
                <label className="block font-small py-1">From</label>
                <Input
                  {...register("salaryFrom", { required: true })}
                  type="number"
                  placeholder="Salary From"
                />
              </Stack>
              <Stack
                direction={"column"}
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

          {/* Apply Before  & Capacity*/}

          <Stack sx={{ width: "100%" }}>
            <label color="#0F3552" className="block font-medium py-2">
              Salary (required)
            </label>
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
      <div
        className="flex mt-5"
        style={{
          width: "50%",
          justifyContent: "space-between",
          margin: " 20px auto",
        }}
      >
        <Button
          sx={{
            width: "45%",
            color: "#333",
            border: "1px solid #333",
            borderRadius: "10px",
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          type="submit"
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
      </div>
    </form>
  );
};

export default ApplicationForm2;
