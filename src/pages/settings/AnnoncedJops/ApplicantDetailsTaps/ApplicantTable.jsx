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
// import { useModal } from "../Context/ModalContext";

const rows = [
  {
    id: 1,
    IDnumber: 1,
    name: "Aymen Khalil ",
    DateOfApply: "AymenKhalil123@gmail.com",
    TimeOfApply: "30",
    Role: "123-456-7890",
    Access: "Admin",
  },
  {
    id: 2,
    IDnumber: 2,
    name: "Data Grid Pro",
    DateOfApply: "the Pro version",
    TimeOfApply: "30",
    Role: "123-456-7890",
    Access: "Admin",
  },
  {
    id: 3,
    IDnumber: 3,
    name: "Data Grid Premium",
    DateOfApply: "the Premium version",
    TimeOfApply: "30",
    Role: "123-456-7890",
    Access: "User",
  },
  {
    id: 4,
    IDnumber: 4,
    name: "Data Grid Premium",
    DateOfApply: "the Premium version",
    TimeOfApply: "30",
    Role: "123-456-7890",
    Access: "User",
  },
  {
    id: 5,
    IDnumber: 5,
    name: "Data Grid Premium",
    DateOfApply: "the Premium version",
    TimeOfApply: "30",
    Role: "123-456-7890",
    Access: "Manager",
  },
];

export default function ApplicantTable() {
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
      field: "DateOfApply",
      headerName: "Date Of Apply",
      width: isMobile ? 150 : 200,
      align: "center",
      headerAlign: "center",
      hide: isMobile,
    },
    {
      field: "TimeOfApply",
      headerName: "TimeOfApply",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Role",
      headerName: "Role",
      width: isMobile ? 120 : 150,
      align: "center",
      headerAlign: "center",
      hide: isMobile,
    },
    {
      field: "Access",
      headerName: "Access",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { Access } }) => {
        return (
          <Box
            sx={{
              maxWidth: "80%",
              mx: "auto",
              my: "8px",
              color: "white",
              display: "flex",
              textAlign: "center",
              justifyContent: "space-evenly",
              alignItems: "center",
              p: "5px",
              borderRadius: "5px",
              backgroundColor:
                Access === "Admin"
                  ? theme.palette.success.main
                  : Access === "ManTimeOfApplyr"
                  ? theme.palette.warning.dark
                  : theme.palette.secondary.dark,
            }}
          >
            {Access === "Admin" ? (
              <AdminPanelSettingsOutlinedIcon sx={{ fontSize: "small" }} />
            ) : Access === "User" ? (
              <LockOpenOutlinedIcon sx={{ fontSize: "small" }} />
            ) : (
              <SecurityOutlinedIcon sx={{ fontSize: "small" }} />
            )}
            <Typography sx={{ fontSize: "14px" }}>{Access}</Typography>
          </Box>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: () => {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", gap: "5px" }}>
            <Button
              sx={{
                my: "7px",
                border: `1px solid ${theme.palette.secondary.main}`,
                color: theme.palette.secondary.main,
                width: "40px",
                height: "30px",
                minWidth: "30px",
              }}
              onClick={() =>
                console.log("EditTeam")
                // showModal("Edit Applicant", () => {
                // })
              }
            >
              <EditOutlinedIcon sx={{ fontSize: "small" }} />
            </Button>
            <Button
              onClick={() =>
                console.log("DeleteApplicant")
                // showModal("You Sure wants to delete this Applicant", () => {
                // })
              }
              sx={{
                m: "7px",
                border: `1px solid ${theme.palette.error.dark}`,
                color: theme.palette.error.dark,
                width: "43px",
                height: "30px",
                minWidth: "30px",
              }}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "small" }} />
            </Button>
          </Box>
        );
      },
    }
  ];

  return (
    <Box sx={{ overflow: "hidden", p: 2, width: "90vw", m: "auto" }}>
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
