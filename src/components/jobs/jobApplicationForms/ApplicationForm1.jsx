import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useJobForm } from "../../../context/jobApplicationFormContext"; // adjust import
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
// import useMediaQuery from "@mui/material/useMediaQuery";
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import Typography from "@mui/material/Typography";

const ApplicationForm1 = ({ onNext }) => {
    // isMobile = useMediaQuery("(max-width: 600px)");
  const { updateForm, formData } = useJobForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      title: formData.title,
      company: formData.company,
      city: formData.city,
      country: formData.country,
    },
  });

  const onSubmit = (data) => {
    updateForm(data);
    console.log(data);
    localStorage.setItem("formData1", JSON.stringify(data));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Stack spacing={4} direction={{ xs: "column", sm: "row" }} padding={3} sx={{backgroundColor: "#f5f5f5"}}>
        <Stack spacing={1} direction={"column"}>
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

          <div className="flex mt-5" style={{width: "100%" , justifyContent: "space-between"}}>
            <Button sx={{width: "45%", color: "#333" , border: "1px solid #333" , borderRadius: "10px"}} >
              Back
            </Button>
            <Button onClick={handleSubmit(onSubmit)} type="submit" sx={{width: "45%", color: "#fff",  backgroundColor: "#244F6F", border: "1px solid #333" , borderRadius: "10px"}}  >
                Next
            </Button>

          </div>
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
        <Stack alignContent={"center"}>
          <Paper className= "p-5 text-center rounded-md"  sx={{ backgroundColor: "#EEF7FE" , width: "100%" , mt:{xs: 2, lg:5} }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" , mb: 2 }} >
               <TipsAndUpdatesOutlinedIcon />  Job Announce Tips
            </Typography>
            <p className="text-sm text-gray-600"  >
              Looking to improve & boost your Post? <br />
              Check out our{" "}
              <a href="#" className="text-blue-500 underline">
                FAQs
              </a>{" "}
              for Tips and Tricks!
            </p>
          </Paper>
        </Stack>
      </Stack>
    </form>
  );
};

export default ApplicationForm1;
