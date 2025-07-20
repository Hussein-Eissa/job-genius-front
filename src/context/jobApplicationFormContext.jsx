import React, { createContext, useContext, useState } from "react";


const JobFormContext = createContext();

export const JobFormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Temporary not required in backEnd
    fullname: "",
    email: "",
    phone: "",
    // /////////////////////////////////
    title: "",
    company: "",
    city: "",
    country: "",
    type: "",
    description: "",
    responsibilities: "",
    whoYouAre: "",
    niceToHaves: "",
    capacity: 0,
    applyBefore: "",
    salaryFrom: 0,
    salaryTo: 0,
    companyWebsite: "",
    keywords: "",
    additionalInformation: "",
    companyPapers: "",
    categories: [],
    skills: [],
    jobBenefits: [
      {
        title: "",
        description: "",
      },
    ],
    questions: [
      {
        title: "",
        type: "",
        answers: [] || "",
        correct: "In Progress",
      },
    ],
  });

  const updateForm = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  return (
    <JobFormContext.Provider value={{ formData, updateForm }}>
      {children}
    </JobFormContext.Provider>
  );
};

export const useJobForm = () => useContext(JobFormContext);
