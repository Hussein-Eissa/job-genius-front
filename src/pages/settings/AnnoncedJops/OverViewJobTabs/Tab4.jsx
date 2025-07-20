import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const UpdateQuestionsForm = ({ job }) => {
  const { updateForm, formData } = useJobForm();
  const isInitialized = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questions:
        job?.questions?.$values?.length > 0
          ? job.questions.$values.map((q) => ({
              questionId: q.questionId,
              title: q.title || "",
              type: q.type || "",
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
          : formData.questions?.length > 0
          ? formData.questions
          : [],
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

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initialQuestions =
      job?.questions?.$values?.length > 0
        ? job.questions.$values.map((q) => ({
            questionId: q.questionId,
            title: q.title || "",
            type: q.type || "",
            answers:
              q.type === "select_one" && typeof q.answers === "string"
                ? JSON.parse(q.answers)
                : q.type === "true_false"
                ? ["True", "False"]
                : null,
            correct: q.correct || null,
          }))
        : formData.questions?.length > 0
        ? formData.questions
        : [];
    if (initialQuestions.length > 0) {
      setValue("questions", initialQuestions);
      updateForm({ questions: initialQuestions });
      localStorage.setItem(
        "formDataQuestions",
        JSON.stringify({ questions: initialQuestions })
      );
    }
  }, [job, formData, setValue, updateForm]);

  const handleDeleteQuestion = async (questionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No token found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.delete(
        `https://jobgenius.bsite.net/api/JobListing/${job.jobID}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the question from the form state after successful deletion
      const indexToRemove = fields.findIndex(
        (field) => field.questionId === questionId
      );
      if (indexToRemove !== -1) {
        remove(indexToRemove);
      }
      toast({ title: "Question Deleted Successfully" });
    } catch (error) {
      console.error("Error deleting question:", error.response?.data || error);
      toast({
        title: "Error Deleting Question",
        description:
          error.response?.data?.message || "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = () => {
    append({
      questionId: null,
      title: "",
      type: "short_text", // Set default type to show text field immediately
      answers: null,
      correct: null,
    });
  };

  const onSubmit = async (data) => {
    if (!job?.jobID) {
      console.error("Error: jobId is undefined or invalid");
      toast({
        title: "Error Updating Job Questions",
        description: "Invalid job ID",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No authorization token found");
      toast({
        title: "Error Updating Job Questions",
        description: "Authorization token missing",
        variant: "destructive",
      });
      return;
    }
    const processedQuestions = data.questions.map((question) => ({
      questionId: question.questionId,
      title: question.title,
      type: question.type,
      answers:
        question.type === "select_one" || question.type === "true_false"
          ? JSON.stringify(
              question.type === "true_false"
                ? ["True", "False"]
                : question.answers
            )
          : null,
      correct: question.correct || null,
    }));

    console.log("Processed Questions:", processedQuestions);
    setIsSubmitting(true);
    try {
      // Placeholder for adding new questions - replace with actual POST endpoint if available
      const newQuestions = processedQuestions.filter((q) => !q.questionId);
      if (newQuestions.length > 0) {
        console.warn(
          "Adding new questions is not implemented. Provide POST endpoint."
        );
       await axios.post(`https://jobgenius.bsite.net/api/JobListing/${job.jobID}/questions`, newQuestions[0], { headers: { Authorization: `Bearer ${token}` } });
      }

      const response = await axios.put(
        `https://jobgenius.bsite.net/api/JobListing/${job.jobID}/questions/bulk`,
        processedQuestions,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Job Questions Updated Successfully");
        toast({ title: "Job Questions Updated Successfully" });
        updateForm({ questions: data.questions });
        localStorage.setItem(
          "formDataQuestions",
          JSON.stringify({ questions: data.questions })
        );
      } else {
        throw new Error(`Failed to update questions: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Error updating job questions:",
        error.response?.data || error
      );
      console.log(
        "Detailed server errors:",
        JSON.stringify(error.response?.data?.errors, null, 2)
      );
      toast({
        title: "Error Updating Job Questions",
        description: error.response?.data?.errors
          ? JSON.stringify(error.response.data.errors, null, 2)
          : error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (index, field) => {
    switch (field.type) {
      case "short_text":
      case "long_text":
        return (
          <Box>
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
              style={{ width: "100%" }}
            />
            {errors?.questions?.[index]?.title && (
              <p
                style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}
              >
                {errors.questions[index].title.message}
              </p>
            )}
          </Box>
        );
      case "select_one":
        return (
          <Stack spacing={1}>
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
              style={{ width: "100%" }}
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
                <Stack spacing={1} sx={{ maxHeight: 150, overflowY: "auto" }}>
                  {(Array.isArray(value) ? value : []).map(
                    (option, optIndex) => (
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
                        <IconButton
                          onClick={() => {
                            const newAnswers = [...value];
                            newAnswers.splice(optIndex, 1);
                            onChange(newAnswers);
                          }}
                          disabled={value.length <= 2}
                          sx={{ color: "#EF4444" }}
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Stack>
                    )
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => onChange([...(value || []), ""])}
                    sx={{ width: "fit-content" }}
                  >
                    Add Option
                  </Button>
                </Stack>
              )}
            />
            {errors?.questions?.[index]?.title && (
              <p
                style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}
              >
                {errors.questions[index].title.message}
              </p>
            )}
            {errors?.questions?.[index]?.answers && (
              <p
                style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}
              >
                {errors.questions[index].answers.message}
              </p>
            )}
          </Stack>
        );
      case "true_false":
        return (
          <Box>
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
              style={{ width: "100%" }}
            />
            {errors?.questions?.[index]?.title && (
              <p
                style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}
              >
                {errors.questions[index].title.message}
              </p>
            )}
          </Box>
        );
      default:
        return null;
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
          Update Job Questions
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
          <Stack
            direction="column"
            sx={{ width: { lg: "70%", xs: "100%" }, gap: "16px" }}
          >
            {fields.map((field, index) => (
              <Paper
                key={field.id}
                sx={{
                  padding: "16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <CloseOutlinedIcon
                  sx={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    fontSize: "16px",
                    color: "#EF4444",
                  }}
                  onClick={() => handleDeleteQuestion(field.questionId)}
                />
                <Stack direction="column" spacing={2}>
                  <Box>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "500",
                        padding: "8px 0",
                        color: "#244F6F",
                      }}
                    >
                      Question Type (required)
                    </label>
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
                                : value === "short_text" ||
                                  value === "long_text"
                                ? null
                                : []
                            );
                            setValue(`questions.${index}.correct`, null);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger style={{ width: "100%" }}>
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
                    {errors.questions?.[index]?.type && (
                      <p
                        style={{
                          color: "#EF4444",
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.questions[index].type.message}
                      </p>
                    )}
                  </Box>
                  {renderQuestionInput(index, field)}
                </Stack>
              </Paper>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddQuestion}
              sx={{ width: "fit-content", marginTop: "16px" }}
            >
              <AddIcon /> Add Question
            </Button>
          </Stack>

          <Stack
            direction="column"
            sx={{
              width: { lg: "30%", xs: "100%" },
              margin: "0 auto",
              gap: "16px",
            }}
          >
            <Paper
              sx={{
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
                backgroundColor: "#EEF7FE",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: "8px" }}
              >
                Job Questions Tips
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>
                Edit, delete, or add questions as needed. Provide a POST
                endpoint for new questions if required.
              </Typography>
            </Paper>
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
              type="button"
              variant="outlined"
              sx={{
                width: "45%",
                color: "#333",
                border: "1px solid #333",
                borderRadius: "10px",
              }}
              onClick={() => {
                setValue("questions", []);
                updateForm({ questions: [] });
                localStorage.setItem(
                  "formDataQuestions",
                  JSON.stringify({ questions: [] })
                );
              }}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default UpdateQuestionsForm;