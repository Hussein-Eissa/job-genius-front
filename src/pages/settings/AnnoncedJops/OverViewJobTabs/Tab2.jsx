import React from "react";
import { useForm } from "react-hook-form";

// Custom Components
import { Input } from "@/components/ui/input";
// Context Import
import { useJobForm } from "../../../../context/jobApplicationFormContext";

// MUI Components
import { Box, Stack, Typography } from "@mui/material";

// import ReactQuill;
import "react-quill/dist/quill.snow.css";
const Tab2 = ({ onNext }) => {
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
    <Stack direction={"column"} sx={{ width: "100%" }}>
      <Box
        sx={{
          width: "98%",
          ml: "auto",
          my: "20px",
          borderBottom: "1px solid #7C8493",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#25324B", py: "10px" }}
        >
          Company Info
        </Typography>
      </Box>

      <Stack
        justifyContent={"flex-start"}
        direction={"column"}
        sx={{ width: "100%" }}
      >
        <form
          id="form-2"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          //   style={{ width: "100%" }}
        >
          <Stack
            spacing={4}
            direction={{ xs: "column", sm: "row" }}
            padding={3}
            className="w-full d-flex justify-content-between"
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
                  <p className="text-red-500 text-sm">
                    Company name is required
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 !text-blue-900">{`Company Website`}</label>
                <Input
                  {...register("companyWebsite", {
                    required: "Invalid URL format",
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                      message: "Invalid URL format",
                    },
                  })}
                  placeholder=" Enter your Company Website"
                />
                {errors.companyWebsite && (
                  <p className="text-red-500 text-sm">Invalid URL format</p>
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
                      onChange={(e) => {
                        setCountrySelected(e.target.value);
                      }}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        Country is required
                      </p>
                    )}
                  </Stack>
                  <Stack sx={{ width: "100%" }}>
                    <label className="block font-medium">{`City`}</label>
                    <Input
                      {...register("city", { required: true })}
                      placeholder="Enter your City"
                      onChange={(e) => {
                        setCitySelected(e.target.value);
                      }}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">City is required</p>
                    )}
                  </Stack>
                </Stack>
              </div>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};
export default Tab2;
