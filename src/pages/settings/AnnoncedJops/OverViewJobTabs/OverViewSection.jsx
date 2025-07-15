import React from "react";
import { Box, Pagination, Stack, Typography, Button } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Tab2 from "./Tab2";
import Tab from "./Tab1";
import Tab3 from "./Tab3";
import ApplicantTable from "../ApplicantDetailsTaps/ApplicantTable";

export default function Tab1() {
  const [value, setValue] = React.useState("overview");
  const [page, setPage] = React.useState(1); 

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCurrentTab = () => {
    switch (page) {
      case 1:
        return <Tab onNext={() => setPage(2)} />;
      case 2:
        return <Tab2 onNext={() => setPage(3)} />;
      case 3:
        return <Tab3 onNext={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <Stack direction={"column"}>
      {/* Buttons Box to navigation In future */}
      <Box
        sx={{
          width: "95%",
          ml: "auto",
          my: "20px",
          borderBottom: "1px solid #C4C4C4",
          display: "flex",
          gap: "20px",
          justifyContent: "flex-start",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
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
              width: "100px",
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
              borderBottom:
                value === "applicants" ? "2px solid #25324B" : "none",
              borderRadius: 0,
              mx: "10px",
              width: "200px",
              transition: "all 0.3s ease-in-out",
              color: value === "applicants" ? "#25324B" : "#C4C4C4",
            }}
          />
        </BottomNavigation>
      </Box>

      {/* Render dynamic tab */}
      {renderCurrentTab()}

      {/* <ApplicantTable /> */}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          my: "20px",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: { xs: "100%", lg: "30%" },
            mx: "5%",
          }}
        >
          <Button
            sx={{
              width: "45%",
              color: "#333",
              border: "1px solid #333",
              borderRadius: "10px",
            }}
          >
            Clear
          </Button>
          <Button
            type="submit"
            sx={{
              width: "45%",
              color: "#fff",
              backgroundColor: "#244F6F",
              border: "1px solid #333",
              borderRadius: "10px",
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Pagination */}
      <Pagination
        count={3}
        shape="rounded"
        color="primary"
        page={page}
        onChange={handlePageChange}
        sx={{ mt: "20px", margin: "20px auto" }}
      />
    </Stack>
  );
}
