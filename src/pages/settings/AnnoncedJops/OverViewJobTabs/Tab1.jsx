import React from "react";
import { Box, Stack, Typography} from "@mui/material";
import { Input } from "@/components/ui/input";
import { useJobForm } from "../../../../context/jobApplicationFormContext";
import { useForm } from "react-hook-form";

export default function Tab1({ onNext }) {
  const [resetClicked, setResetClicked] = React.useState(false);
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
          Personal Info
        </Typography>
      </Box>

      <Stack
        justifyContent={"flex-start"}
        direction={"column"}
        sx={{ width: "100%" }}
      >
        <form
          id="form-1"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          //   style={{ width: "100%", display: "flex", alignItems: "flex-start" , flexDirection:"column" }}
        >
          <Stack
            spacing={4}
            direction={{ xs: "column", sm: "row" }}
            padding={3}
            className="w-full d-flex align-items-center justify-content-between"
          >
            <Stack
              spacing={1}
              direction={"column"}
              className="gap-3"
              sx={{ width: { xs: "100%", lg: "40%" } }}
            >
              <div>
                <label className="block font-medium py-2">{`Full Name`}</label>
                <Input
                  {...register("fullname", { required: true })}
                  placeholder=" Enter your Full Name"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">Name is required</p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2 !text-blue-900">{`Email Address`}</label>
                <Input
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  placeholder=" Enter your Email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{`Email is ${
                    errors.email.type === "pattern" ? "invalid" : "required"
                  }`}</p>
                )}
              </div>

              <div>
                <label className="block font-medium py-2">{`Phone Number`}</label>
                <Input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^01[2|0|1|5][0-9]{8}$/,
                      message:
                        "Phone number must be 11 digits and start with 01",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </Stack>
          </Stack>
        </form>
      </Stack>



    
    </Stack>
  );
}
