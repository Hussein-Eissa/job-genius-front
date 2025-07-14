import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useJobForm } from "../../../context/jobApplicationFormContext"; // adjust import
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
// import useMediaQuery from "@mui/material/useMediaQuery";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const ApplicationForm1 = ({ onNext }) => {
  // isMobile = useMediaQuery("(max-width: 600px)");
  const { updateForm, formData } = useJobForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: formData.fullname,
      email: formData.email,
      phone: formData.phone,
    },
  });

  const onSubmit = (data) => {
    updateForm(data);
    console.log(data);
    localStorage.setItem("formData1", JSON.stringify(data));
    onNext();
  };

  return (
    <form id="form-1"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      style={{ width: "100%", backgroundColor: "#f5f5f5" }}
    >
      <Stack
        spacing={4}
        direction={{ xs: "column", sm: "row" }}
        padding={3}
        className="w-full d-flex justify-evenly"
      >
        <Stack spacing={1} direction={"column"} className="gap-3" sx={{ width: { xs: "100%", lg: "40%" } }}>
          <div>
            <label className="block font-medium py-2">{`Full Name (Required)`}</label>
            <Input
              {...register("name", { required: true })}
              placeholder="Enter your Full Name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium py-2 !text-blue-900">{`Email Address (Required)`}</label>
            <Input
              {...register("email", { required: true })}
              placeholder=" Enter your Email"
              type='email'
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium py-2">{`Phone Number (Required)`}</label>
            <Input
              {...register("phone", { required: true })}
              placeholder="Enter your Phone Number"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Phone Number is required</p>
            )}
          </div>

        </Stack>
        {/* <Stack alignContent={"center"} style={{ width: "45%" }}> */}
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "45%" }, margin: "auto" }}
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

    </form>
  );
};

export default ApplicationForm1;
