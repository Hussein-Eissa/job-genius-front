import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { format } from "date-fns";

// import { useModal } from "../Context/ModalContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.tsx";

export default function ApplicantTable({ job }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //   const { showModal } = useModal();
  const MyColumns = [
    {
      field: "IDnumber",
      headerName: "ID",
      width: isMobile ? 70 : 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: isMobile ? 150 : 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Email",
      headerName: "Email",
      width: isMobile ? 150 : 200,
      align: "center",
      headerAlign: "center",
      hide: isMobile,
    },
    {
      field: "Phone",
      headerName: "Phone",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "DateOfApply",
      headerName: "Date Of Apply",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        format(new Date(params.row.DateOfApply), "MMMM d, yyyy"),
    },
    {
      field: "Linkedin",
      headerName: "Linkedin",
      width: isMobile ? 120 : 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <a style={{ color: "blue" }} target="_blank" href={params.row.Linkedin}>linkedIn</a>;
      },
    },
     {
      field: "Portfolio",
      headerName: "Portfolio",
      width: 120,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return <a href={params.row.Portfolio} target="_blank" style={{ color: "purple" }}>Portfolio</a>;
      },
    },
    {
      field: "CV",
      headerName: "CV",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ( params) => {
        return <a href={"#"}>CV</a>;
      },
    },
   
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: () => {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </Box>
        );
      },
    },
  ];
  const rows = job.jobApplications.$values.map((app) => ({
    id: app.applicationID,
    IDnumber: app.userID,
    name: app.fullname,
    Email: app.email,
    Phone: app.phone,
    DateOfApply: app.appliedDate,
    Linkedin: app.linkedInLink,
    Portfolio: app.portfolioLink,
    Status: app.status,
    CV: app.resumeFile,
  }));

  return (
    <Box sx={{ overflow: "hidden", p: 2, width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Applicant List
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "70vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowX: "auto",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[400],
              borderRadius: "4px",
            },
          }}
        >
          {/* <Box sx={{ minWidth: isMobile ? "600px" : "800px", height: "100%" }}> */}
          <DataGrid
            // checkboxSelection
            rows={rows}
            // @ts-ignore
            columns={MyColumns}
            disableRowSelectionOnClick
            sx={{
              fontSize: 13,
              "& .MuiDataGrid-columnHeaders": { fontSize: 14 },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "auto",
              },
            }}
          />
          {/* </Box> */}
        </Box>
      </Box>
    </Box>
  );
}
