
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { Link, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import OverViewTaps from "./AnnoncedJops/OverViewJobTabs/OverViewSection";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { green } from "@mui/material/colors";
import ApplicantTable from "./AnnoncedJops/ApplicantDetailsTaps/ApplicantTable";

const AnnouncedJob = () => {
    const { id } = useParams<{ id: string }>();
    const [value, setValue] = useState("overview");
    
    const [job, setJob] = useState<any>({});
    
    useEffect(() => {
        getJob();
    }, []);
    
    const getJob = async () => {
        try {
            const response = await fetch(`https://jobgenius.bsite.net/api/JobListing/${id}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                toast({
                    title: "Error",
                    description: "Failed to get job details",
                    variant: "destructive",
                });
            }
            const data = await response.json();
            setJob(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
            setJob({});
        }
    }
    
    return (
       <div className="min-h-screen flex flex-col overflow-hidden" style={{ width: "98vw" }}>
  <div className="flex-grow flex overflow-hidden">
    <SettingsSidebar />
    <main className="flex-grow px-8 py-6 overflow-hidden flex flex-col" style={{ width: "100%" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Jobs Announcement</h1>
        <Button variant="outline" className="bg-white" asChild>
          <Link to="/">Back to homepage</Link>
        </Button>
      </div>

      {/* Title Section */}
      <div className="mb-1 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Box
        sx={{
          width: "100%",
          ml: "0px",
          my: "10px",
          borderBottom: "1px solid #C4C4C4",
          display: "flex",
          gap: "20px",
          justifyContent: "flex-start",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{
            "& .Mui-selected": {
              color: "#25324B",
              fontWeight: 600,
            },
          }}
        >
          <BottomNavigationAction
            label="Overview"
            value="overview"
            sx={{
              width: "135px",
              borderBottom: value === "overview" ? "2px solid #25324B" : "none",
              borderRadius: 0,
              transition: "all 0.3s ease-in-out",
              color: value === "overview" ? "#25324B" : "#C4C4C4",
            }}
          />
          <BottomNavigationAction
            label="Applicants Details"
            value="applicants"
            sx={{
              width: "200px",
              borderBottom: value === "applicants" ? "2px solid #25324B" : "none",
              borderRadius: 0,
              transition: "all 0.3s ease-in-out",
              color: value === "applicants" ? "#25324B" : "#C4C4C4",
            }}
          />
        </BottomNavigation>
      </Box>

      {/* Content Section with Scroll */}
      <Box
        sx={{
          mt: "20px",
          flexGrow: 1,
          overflowY: "auto",
          width: "100%",
        }}
      >
        {value === "overview" ? (
          <OverViewTaps jobdeails={job} />
        ) : (
          <ApplicantTable job={job} />
        )}
      </Box>
    </main>
  </div>
</div>

    );
};

export default AnnouncedJob;
