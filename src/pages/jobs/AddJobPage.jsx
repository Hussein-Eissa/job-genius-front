import React, { useState } from "react";
import Button from "@mui/material/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ApplicationForm1 from "@/components/jobs/jobApplicationForms/ApplicationForm1";
import ApplicationForm2 from "@/components/jobs/jobApplicationForms/ApplicationForm2";
import ApplicationForm3 from "@/components/jobs/jobApplicationForms/ApplicationForm3";

const AddJobPage = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const goNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinalSubmit();
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            window.history.back();
        }
    };

    return (
        <>
        <div className="min-h-screen flex flex-col" style={{ width: "100%", backgroundColor: "#f5f5f5" }}>
            <Header />

            {currentStep === 1 && <ApplicationForm1 onNext={goNext} />}
            {currentStep === 2 && <ApplicationForm2 onNext={goNext} />}
            {currentStep === 3 && <ApplicationForm3 />}

            <div
            className="flex mt-5"
            style={{
                width: "50%",
                justifyContent: "space-between",
                margin: " 20px auto",
            }}
            >
            <Button
                onClick={goBack}
                sx={{
                width: "45%",
                color: "#333",
                border: "1px solid #333",
                borderRadius: "10px",
                }}
            >
                Back
            </Button>

            {currentStep < 3 ? (
                // Submit is handled inside form component
                <Button
                form={`form-${currentStep}`}
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
            ) : (
                <Button
                form={`form-${currentStep}`}
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
            )}
            </div>

            <p 
                className="text-xs text-gray-500 text-center" 
                style={{
                    margin: "0px 0px 20px 0px",
                }}
            >
            By sending the request you confirm that you accept our{" "}
            <a href="#" className="text-blue-500 underline">
                Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 underline">
                Privacy Policy
            </a>
            .
            </p>

            <Footer />
        </div>
        </>
    );
};

export default AddJobPage;
