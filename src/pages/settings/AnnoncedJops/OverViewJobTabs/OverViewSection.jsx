import React from "react";
import { Box, Pagination, Stack, Typography, Button } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Tab2 from "./Tab2";
import Tab from "./Tab1";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";

export default function Tab1({ jobdeails }) {
  const [page, setPage] = React.useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCurrentTab = () => {
    switch (page) {
      case 1:
        return <Tab onNext={() => setPage(2)} job={jobdeails} />;
      case 2:
        return <Tab2 onNext={() => setPage(3)} job={jobdeails} />;
      case 3:
        return <Tab3 job={jobdeails} />;
      case 4:
        return (
          jobdeails?.questions?.$values?.length > 0 ?<Tab4 job={jobdeails} />: window.history.back()
        );
      default:
        return null;
    }
  };

  return (
    <Stack direction={"column"}>
      {/* Render dynamic tab */}
      {renderCurrentTab()}

      {/* <ApplicantTable /> */}

      {/* <Box
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
      </Box> */}

      {/* Pagination */}
      <Pagination
        count={jobdeails?.questions?.$values?.length > 0 ? 4 : 3}
        shape="rounded"
        color="primary"
        page={page}
        onChange={handlePageChange}
        sx={{ mt: "20px", margin: "20px auto" }}
      />
    </Stack>
  );
}
