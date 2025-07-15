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

// import ReactQuill;
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import useMediaQuery from "@mui/material/useMediaQuery";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { Link } from "react-router-dom";

const ApplicationForm2 = ({ onNext }) => {
  const { updateForm, formData } = useJobForm();
  const [countryselected, setCountrySelected] = React.useState("");
  const [cityselected, setCitySelected] = React.useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: formData.company,
      city: formData.city,
      country: formData.country,
      companyWebsite: formData.companyWebsite,
      description: formData.description,
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

  // const Countries = [
  //   "Afghanistan",
  //   "Albania",
  //   "Algeria",
  //   "Andorra",
  //   "Angola",
  //   "Antigua and Barbuda",
  //   "Argentina",
  //   "Armenia",
  //   "Australia",
  //   "Austria",
  //   "Azerbaijan",
  //   "Bahamas",
  //   "Bahrain",
  //   "Bangladesh",
  //   "Barbados",
  //   "Belarus",
  //   "Belgium",
  //   "Belize",
  //   "Benin",
  //   "Bhutan",
  //   "Bolivia",
  //   "Bosnia and Herzegovina",
  //   "Botswana",
  //   "Brazil",
  // ];

  const Cities = [
    "Kabul",
    "Tirana",
    "Algiers",
    "Andorra la Vella",
    "Luanda",
    "Saint John's",
    "Buenos Aires",
    "Canberra",
    "Vienna",
    "Baku",
    "Nassau",
    "Manama",
    "Yerevan",
    "Hamilton",
    "Santo Domingo",
    "Sarajevo",
    "Gaborone",
  ];

  const onSubmit = (data) => {
    const plainDescription = data.description.replace(/<[^>]+>/g, "").trim();
    const cleanedData = {
      ...data,
      description: plainDescription,
    };
    updateForm(cleanedData);
    localStorage.setItem("formData2", JSON.stringify(cleanedData));
    console.log(cleanedData);
    onNext();
  };

  return (
    <form id="form-2"
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
        <Stack
          spacing={1}
          direction={"column"}
          className="gap-3"
          sx={{ width: { xs: "100%", lg: "40%" } }}
        >
          <div>
            <label className="block font-medium py-2">{`Company Name`}</label>
            <Input
              {...register("company", { required: true })}
              placeholder="Enter your Company Name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Company name is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium py-2 !text-blue-900">{`Company Website`}</label>
            <Input
              {...register("companyWebsite", { required: "Invalid URL format",
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                  message: "Invalid URL format",
                },
              })}
              placeholder=" Enter your Company Website"
            />
            {errors.companyWebsite && (
              <p className="text-red-500 text-sm">
                Invalid URL format
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium py-2 m-0">{`Company Location`}</label>
            <Stack spacing={1} direction={"row"} padding={1} margin={0}>
              <Stack sx={{ width: "100%" }}>
                <label className="block font-medium">{`Country`}</label>
                <Input
                  {...register("country", { required: true })}
                  placeholder="Enter your Country"
                  onChange={(e) => { setCountrySelected(e.target.value);}}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">Country is required</p>
                )}
              </Stack>
              <Stack sx={{ width: "100%" }}>
                <label className="block font-medium">{`City`}</label>
                <Input
                  {...register("city", { required: true })}
                  placeholder="Enter your City"
                  onChange={(e) => { setCitySelected(e.target.value);}}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">City is required</p>
                )}
              </Stack>
            </Stack>
          </div>
          {/* <Stack>
            <label color="#0F3552" className="block font-medium py-2">
              Company Description (required)
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
                    placeholder="Describe your company and its Services"
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
                Company description is required
              </p>
            )}
          </Stack> */}
        </Stack>
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "45%" }, margin: "auto" }}
        >
          <Paper
            className="p-5 text-center "
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

export default ApplicationForm2;
