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

  const Countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
  ];

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Stack spacing={4} direction={{ xs: "column", sm: "row" }} padding={3}>
        <Stack
          spacing={1}
          direction={"column"}
          sx={{ width: { xs: "100%", sm: "58%" } }}
        >
          <div>
            <label className="block font-medium py-2">{`Company Name (Required)`}</label>
            <Input
              {...register("company", { required: true })}
              placeholder="Enter your Company Name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Company name is required</p>
            )}
          </div>

          <div>
            <label className="block font-medium py-2 !text-blue-900">{`Company Website (Required)`}</label>
            <Input
              {...register("companyWebsite", { required: true })}
              placeholder=" Enter your Company Website"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                Company website is required
              </p>
            )}
          </div>
          <label className="block font-medium py-2">{`Company Location`}</label>
          <Stack spacing={1} direction={"row"}>
            <Stack sx={{ width: "100%" }}>
              <Controller
                name="country"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Countries.map((country, index) => (
                        <SelectItem key={`${country}-${index}`} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">Country is required</p>
              )}
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {Cities.map((city, index) => (
                        <SelectItem key={`${city}-${index}`} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">City is required</p>
              )}
            </Stack>
          </Stack>
          <Stack>
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
          </Stack>
          <div
            className="flex mt-5"
            style={{ width: "100%", justifyContent: "space-between" }}
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
        <Stack
          alignItems={"center"}
          sx={{ width: { xs: "100%", lg: "40%" }, margin: "auto" }}
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
        </Stack>
      </Stack>
    </form>
  );
};

export default ApplicationForm2;
