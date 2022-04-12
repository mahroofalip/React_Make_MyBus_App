import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import "./style.css";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";


const settings = ["Profile", "Account", "Logout"];


const columns = [
  { field: "id", headerName: "BUS ID", width: 100 },
  { field:"busname",headerName:"BUS NAME",width:200},
  { field: "registernumber", headerName: "REGISTER NO", width: 120 },
  { field: "bustype", headerName: "TYPE BUS", width: 100 },
  {
    field: "seats",
    headerName: "SEATS",
    type: "number",
    width: 100,
  },
  {
    field: "tripdetails",
    headerName: "TRIP DETAILS",
    width:150
  }
  // {
  //   field: "tripdetails",
  //   headerName: "TRIP DETAILS",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];


function ViewBus() {
  const navigate = useNavigate();

  const [records, setRecords] = useState();
  
  

  useEffect(async () => {
    await axios.get("/admin/getbuses").then((res) => {
      console.log("get bus function ");
      setRecords(res.data.result);
        });
  },[]);

  
  //  let result = records.map((record)=>{
  //    let rec={id:record.id,busname:record.busname,regnumber:record.registernumber,bustype:record.bustype,seats:record.seats,}
  //      return rec
  //  })
  // setRows(result)
  // console.log('dddddddddddddddddddd    :',rows)



  
   
  




  console.log(records, "use eeeeeeeeeeeeeeeeeeeeffffct");
 
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateTo = (e) => {
    if (e.target.innerText === "Account") {
      navigate("/admin/login");
    }
  };

  const handleAddBus = () => {
    navigate("/admin/addbus");
  };



   
  //  useEffect(()=>{
  //   let response=records.map((record)=>{
  //     return {id:record.id,busname:record.busname,regnumber:record.registernumber,bustype:record.bustype,seats:record.seats,}
  //  }) 
  //  response.push(rows)
   
  //  },[])
 
    



  // const handleSearch = (e) => {
  //   let target = e.target;
  //   setFilterFn({
  //     fn: (items) => {
  //       if (target.value === "") return items;
  //       else
  //         return items.filter((x) =>
  //           x.fullName.toLowerCase().includes(target.value)
  //         );
  //     },
  //   });
  // };

  return (
    <>
      <AppBar sx={{ backgroundColor: "#fff" }} position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  md: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            >
              <DirectionsBusIcon style={{ color: "gray", fontSize: 40 }} />

              <span className="mybus">
                <strong style={{ color: "gray", fontWeight: 900 }}>
                  ADMIN PANEL
                </strong>
              </span>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={navigateTo}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <div>
        <Grid
          sx={{ backgroundColor: "#012169", marginTop: 0 }}
          container
          spacing={2}
        >
          <Grid
            className="tab"
            sx={{
              color: "#fff",
              backgroundColor: "#012169",
              border: "solid white",
              cursor: "pointer",
            }}
            item
            xs={12}
            sm={2}
            md={2}
          >
            <strong style={{ color: "white", margin: 40 }}>DASHBOARD</strong>
          </Grid>
          <Grid></Grid>
          <Grid
            onClick={handleAddBus}
            className="tab"
            sx={{
              color: "#fff",
              backgroundColor: "#012169",
              border: "solid white",
              cursor: "pointer",
            }}
            item
            xs={12}
            sm={2}
            md={2}
          >
            <strong className="tab" style={{ margin: 40 }}>
              ADD BUS
            </strong>
          </Grid>
          <Grid
            sx={{ backgroundColor: "gray", border: "solid white" }}
            item
            xs={12}
            sm={2}
            md={2}
          >
            <strong style={{ margin: 40 }}>VIEW BUS</strong>
          </Grid>
          <Grid
            className="tab"
            sx={{
              color: "#fff",
              backgroundColor: "#012169",
              border: "solid white",
              cursor: "pointer",
            }}
            item
            xs={12}
            sm={2}
            md={2}
          >
            <strong className="tab" style={{ margin: 40 }}>
              REPORTS
            </strong>
          </Grid>
        </Grid>
      </div>

      {/* table */}

      <Container>
        <div style={{ height: 400, width: "100%", marginTop: 10 }}>
          <DataGrid
            rows={records}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
             checkboxSelection
          />
        </div>
      </Container>
    </>
  );
}

export default ViewBus;
