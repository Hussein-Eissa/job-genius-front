import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ResumeUploaderProps {
  onUpload: (fileName: string, file: File) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

const ResumeUploader = ({ onUpload, jobDescription, setJobDescription }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFile(file);
    setIsUploaded(true);
  };

  const handleClickUpload = () => {
    document.getElementById("resume-upload")?.click();
  };

  const handleTryItNow = () => {
    if (isUploaded && jobDescription.trim().length >= 20 && file) {
      onUpload(fileName, file);
    }
  };

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center mb-6 cursor-pointer transition-colors ${
          isDragging ? "border-jobblue bg-blue-50" : "border-gray-300 hover:border-jobblue"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-jobblue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          {isUploaded ? (
            <p className="text-xl text-jobblue font-semibold">{fileName}</p>
          ) : (
            <p className="text-xl text-jobblue font-semibold">
              Click to Upload or drag and drop<br />
              PDF, DOC, DOCX or TXT (max. 20 mb)
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex align-center justify-center mb-6">
        <input
          className="border-2 border-dashed border-jobblue h-full min-w-full min-h-20 text-center overflow-show"
          placeholder="Enter the job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <Button
          className={`bg-jobblue hover:bg-jobblue-dark text-white px-10 ${
            (!isUploaded || jobDescription.trim().length < 20) && "opacity-50"
          }`}
          disabled={!isUploaded || jobDescription.trim().length < 20}
          onClick={handleTryItNow}
        >
          Try it Now
        </Button>
      </div>
    </>
  );
};

export default ResumeUploader;
