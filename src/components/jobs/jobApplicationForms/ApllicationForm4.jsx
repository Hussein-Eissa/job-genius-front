import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";
import { useJobForm } from "../../../context/jobApplicationFormContext";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const ApplicationForm4 = () => {
  const { updateForm, formData } = useJobForm();
  const { jobId } = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questions:
        formData.questions?.length > 0
          ? formData.questions.map((q) => ({
              ...q,
              answers:
                q.type === "select_one" && typeof q.answers === "string"
                  ? JSON.parse(q.answers)
                  : q.type === "true_false"
                  ? ["True", "False"]
                  : q.type === "short_text" || q.type === "long_text"
                  ? null
                  : [],
              correct: q.correct || null,
            }))
          : [{ title: "", type: "", answers: null, correct: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const QuestionTypes = [
    { value: "short_text", label: "Short Answer" },
    { value: "long_text", label: "Long Answer" },
    { value: "select_one", label: "Multiple Choice" },
    { value: "true_false", label: "True / False" },
  ];

  const onSubmit = async (data) => {
    if (!jobId) {
      console.error("Error: jobId is undefined or invalid");
      toast({
        title: "Error Submitting Job Questions",
        description: "Invalid job ID",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No authorization token found");
      toast({
        title: "Error Submitting Job Questions",
        description: "Authorization token missing",
        variant: "destructive",
      });
      return;
    }

    const processedData = data.questions.map((question) => ({
      title: question.title,
      type: question.type,
      answers:
        question.type === "select_one" || question.type === "true_false"
          ? JSON.stringify(
              question.type === "true_false" ? ["True", "False"] : question.answers
            )
          : null,
      correct: question.correct || null,
    }));

    console.log("Submitted Form Data:", JSON.stringify(processedData, null, 2));
    updateForm({ questions: processedData });
    localStorage.setItem("formData4", JSON.stringify(processedData));

    try {
      console.log("Sending request with token:", token.substring(0, 10) + "...");
      const response = await axios.post(
        `https://jobgenius.bsite.net/api/JobListing/${jobId}/questions/bulk`,
        processedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Job Questions Submitted Successfully");
        toast({ title: "Job Questions Submitted" });
      } else {
        console.error("Submission failed:", response.status);
        toast({
          title: "Failed to Submit Job Questions",
          description: `Unexpected status code: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(
        "Error submitting job Questions:",
        error.response?.data || error
      );
      console.log(
        "Detailed server errors:",
        JSON.stringify(error.response?.data?.errors, null, 2)
      );
      toast({
        title: "Error Submitting Job Questions",
        description:
          error.response?.data?.errors
            ? JSON.stringify(error.response.data.errors, null, 2)
            : error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const renderQuestionInput = (index, field) => {
    switch (field.type) {
      case "short_text":
      case "long_text":
        return (
          <>
            <Input
              {...register(`questions.${index}.title`, {
                required: "Question is required",
                minLength: {
                  value: 1,
                  message: "Question title must be at least 1 character",
                },
                maxLength: {
                  value: field.type === "short_text" ? 200 : 1000,
                  message: `Question title cannot exceed ${
                    field.type === "short_text" ? 200 : 1000
                  } characters`,
                },
              })}
              placeholder="Enter question"
              className="w-full"
            />
            {errors?.questions?.[index]?.title && (
              <p className="text-red-500">
                {errors?.questions?.[index]?.title?.message}
              </p>
            )}
          </>
        );
      case "select_one":
        return (
          <Stack spacing={2}>
            <Input
              {...register(`questions.${index}.title`, {
                required: "Question is required",
                minLength: {
                  value: 1,
                  message: "Question title must be at least 1 character",
                },
                maxLength: {
                  value: 200,
                  message: "Question title cannot exceed 200 characters",
                },
              })}
              placeholder="Enter question"
              className="w-full"
            />
            <Controller
              name={`questions.${index}.answers`}
              control={control}
              rules={{
                validate: (value) =>
                  (Array.isArray(value) &&
                    value.length >= 2 &&
                    value.every((opt) => opt.trim())) ||
                  "At least two non-empty options are required",
              }}
              render={({ field: { onChange, value } }) => (
                <Stack spacing={1} sx={{ maxHeight: 150, overflow: "auto" }}>
                  {(Array.isArray(value) ? value : []).map((option, optIndex) => (
                    <Stack key={optIndex} direction="row" spacing={1}>
                      <Input
                        placeholder={`Option ${optIndex + 1}`}
                        onChange={(e) => {
                          const newAnswers = [...value];
                          newAnswers[optIndex] = e.target.value;
                          onChange(newAnswers);
                        }}
                        value={option || ""}
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => {
                          const newAnswers = [...value];
                          newAnswers.splice(optIndex, 1);
                          onChange(newAnswers);
                        }}
                        disabled={value.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Stack>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onChange([...(value || []), ""])}
                  >
                    Add Option
                  </Button>
                </Stack>
              )}
            />
            {errors?.questions?.[index]?.title && (
              <p className="text-red-500">
                {errors?.questions?.[index]?.title?.message}
              </p>
            )}
            {errors?.questions?.[index]?.answers && (
              <p className="text-red-500">
                {errors?.questions?.[index]?.answers?.message}
              </p>
            )}
          </Stack>
        );
      case "true_false":
        return (
          <>
            <Input
              {...register(`questions.${index}.title`, {
                required: "Question is required",
                minLength: {
                  value: 1,
                  message: "Question title must be at least 1 character",
                },
                maxLength: {
                  value: 200,
                  message: "Question title cannot exceed 200 characters",
                },
              })}
              placeholder="Enter question"
              className="w-full"
            />
            {errors?.questions?.[index]?.title && (
              <p className="text-red-500">
                {errors?.questions?.[index]?.title?.message}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form
      id="form-4"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      style={{ width: "100%", backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Stack
        spacing={4}
        direction={{ xs: "column", sm: "row" }}
        padding={3}
        className="w-full d-flex justify-evenly"
      >
        <Stack
          spacing={1}
          direction={"column"}
          className="gap-3"
          sx={{ width: { xs: "100%", lg: "70%" } }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Job Questions
          </Typography>
          <Typography variant="body1">
            Add questions to your job application form
          </Typography>
          {fields.map((field, index) => (
            <Stack
              key={field.id}
              spacing={2}
              className="mb-4"
              sx={{ width: "100%" }}
            >
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Controller
                  name={`questions.${index}.type`}
                  control={control}
                  rules={{ required: "Question type is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue(
                          `questions.${index}.answers`,
                          value === "select_one"
                            ? ["", ""]
                            : value === "true_false"
                            ? ["True", "False"]
                            : value === "short_text" || value === "long_text"
                            ? null
                            : []
                        );
                        setValue(`questions.${index}.correct`, null);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        {QuestionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Stack>
              {errors.questions?.[index]?.type && (
                <p className="text-red-500 text-sm">
                  {errors.questions[index].type.message}
                </p>
              )}
              {errors.questions?.[index]?.title && (
                <p className="text-red-500 text-sm">
                  {errors.questions[index].title.message}
                </p>
              )}
              {renderQuestionInput(index, field)}
            </Stack>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({ title: "", type: "", answers: null, correct: null })
            }
          >
            Add Question
          </Button>
        </Stack>
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "30%" }, margin: "auto" }}
        >
          <Paper
            className="p-5 text-center"
            sx={{
              borderRadius: "10px",
              backgroundColor: "#EEF7FE",
              width: "75%",
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
        </Stack>
      </Stack>
      <div className="flex justify-center gap-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="destructive">
          Reset
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm4;