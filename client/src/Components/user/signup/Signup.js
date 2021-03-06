import React, { useRef, useFocus, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../forms.css";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControl from "@mui/material/FormControl";
import OtpInput from "react-otp-input";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function Signup() {
  const { useState } = React;
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [PasswordErr, setPasswordErr] = useState(false);
  const [mobileErr, setMobileErr] = useState(false);
  const [mobileValidErr, setmobileValidErr] = useState(false);

  // modal state
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xs");
  const [otp, setOtp] = React.useState("");
  const [otpErr, seOtptErr] = React.useState(false);
  const [otpValidErr, setOtpValidErr] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [eye, seteye] = useState(true);
  const [pass, setpass] = useState("password");


  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "name") {
      setName(value);
    }

    if (name === "password") {
      setPassword(value);
    }

    if (name === "mobile") {
      setMobileNumber(value);
    }
  };



  const submitForm = (e) => {
    e.preventDefault();
    let error=false
    if (Name.length < 1) {
      setNameErr(true);
      error=true
    } else {
      setNameErr(false);
    }

    if (mobileNumber === "") {
    
      setMobileErr(true);
      setmobileValidErr(false);
      error=true
    } else {
      setMobileErr(false);
      if (mobileNumber.length <= 9 || mobileNumber.length >= 11) {
        setmobileValidErr(true);
        error=true
      } else if (isNaN(mobileNumber)) {
        setmobileValidErr(true);
        error=true
      } else {
        setmobileValidErr(false);
      }
    }

    if (Name === "") {
     
   
      setNameErr(true);
      error=true
   
    } else {
      setNameErr(false);
      
    }

    if (Email.length < 1) {
      setEmailErr(true);
      error=true
    } else {
      setEmailErr(false);
    }

    if (Email === "") {
      setEmailErr(true);
      error=true
    } else {
      setEmailErr(false);
    }
    if (Password === "") {
      setPasswordErr(true);
      error=true
    } else {
      setPasswordErr(false);
    }
   
    if (error) {

     alert('err')
      
      
    }else{

     axios
       .post("/user/otp/request", {
         Name,
         Email,
         Password,
         mobileNumber,
       })
       .then((res) => {
       
      
        
         if (res.data.status==='pending') {
          
          console.log(JSON.stringify(res.data.user));
          localStorage.setItem("userData", JSON.stringify(res.data.user));
          handleClickOpen()

         } else {
           alert("otp authentication is failed");
         }
       });
    }
  };

  const Eye = () => {
    if (pass === "password") {
      setpass("text");
      seteye(false);
    } else {
      setpass("password");
      seteye(true);
    }
  };

  const submitCode = (number) => {
     
    axios.post("/user/otp/verify", {
       
        OTP:number,
        USER: localStorage.getItem("userData")
        }).then((response)=>{

           console.log(response);
         
        if(response.data.status){
         
          alert(response.data.userToken)

          localStorage.clear("userData");
          localStorage.setItem("userToken", response.userToken);
        
          navigate('/') 
          
        }else{
          alert(response.data.Error)
          
         
        }
         
      

        })
        

        
  };

  return (
    <>
      <div className="wraper">
        <div className="container">
          <div className="card">
            <div className="form">
              <div className="left-side">
                <img
                  src="https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVzfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                  alt=""
                />
              </div>

              <div className="right-side">
                <div className="register">
                  <p>
                    Have you already Account ? <Link to="/login">Login</Link>
                  </p>
                </div>

                <div className="hello">
                  <h2>Signup</h2>
                </div>

                <form onSubmit={submitForm}>
                  <div className="input_text">
                    <input
                      className={` ${nameErr ? "warning" : "nowarning"}`}
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={Name}
                      onChange={inputEvent}
                    />
                    <p className={` ${nameErr ? "danger" : "nodanger"}`}>
                      <i className="fa fa-warning"></i>Please enter your name .
                    </p>
                  </div>
                  <div className="input_text">
                    <input
                      className={` ${emailErr ? "warning" : "nowarning"}`}
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={Email}
                      onChange={inputEvent}
                    />
                    <p className={` ${emailErr ? "danger" : "nodanger"}`}>
                      <i className="fa fa-warning"></i>Please enter a valid
                      email address.
                    </p>
                  </div>
                  <div className="input_text">
                    <input
                      className={` ${mobileErr ? "warning" : "nowarning"}`}
                      type="text"
                      placeholder="Enter your Mobile"
                      name="mobile"
                      value={mobileNumber}
                      onChange={inputEvent}
                    />
                    <p className={` ${mobileValidErr ? "danger" : "nodanger"}`}>
                      <i className="fa fa-warning"></i>Please enter your a valid
                      mobile number
                    </p>
                    <p className={` ${mobileErr ? "danger" : "nodanger"}`}>
                      <i className="fa fa-warning"></i>Please enter your mobile
                      number.
                    </p>
                  </div>
                  <div className="input_text">
                    <input
                      className={` ${PasswordErr ? "warning" : "nowarning"}`}
                      type={pass}
                      placeholder="Enter Password"
                      name="password"
                      value={Password}
                      onChange={inputEvent}
                    />
                    <i
                      onClick={Eye}
                      className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}
                    ></i>

                    <p className={` ${PasswordErr ? "danger" : "nodanger"}`}>
                      <i className="fa fa-warning"></i>Please enter password
                    </p>
                  </div>

                  <div className="btn">
                    <button type="submit">Sign up</button>
                    <Dialog
                      fullWidth={fullWidth}
                      maxWidth={maxWidth}
                      open={open}
                      onClose={handleClose}
                    >
                      <DialogContent>
                        <DialogContentText align="center">
                          we sent otp in your phone number Enter here
                        </DialogContentText>

                        <Box
                          noValidate
                          component="form"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            m: "auto",
                            width: "fit-content",
                          }}
                        >
                          <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <p
                              className={otpErr ? "incorrect" : "correct"}
                              align="center"
                              style={{ color: "red" }}
                            >
                              {" "}
                              Entered otp is incorrect
                            </p>
                            <p
                              className={otpValidErr ? "incorrect" : "correct"}
                              align="center"
                              style={{ color: "red" }}
                            >
                              {" "}
                              Otp Must be 4 charactor
                            </p>
                            <OtpInput
                              inputStyle={{
                                width: "3rem",
                                height: "3rem",
                                margin: "30px 5px",
                                fontSize: "1rem",
                                borderRadius: 4,
                                border: "2px solid rgba(0,0,0,0.3)",
                              }}
                              onChange={(otp) => {
                                setOtp(otp);
                                seOtptErr(false)
                                if (otp.length === 4) {
                                
                              
                                  submitCode(otp);
                                } else {
                                  console.log("not reached 4 character");
                                 
                                }
                              }}
                              numInputs={4}
                              separator={<span> &ensp; </span>}
                              value={otp}
                              shouldAutoFocus
                            />
                          </FormControl>
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </div>
                </form>

                <h3 className="signWith">Or Signup With</h3>
                <div className="google">
                  <GoogleIcon className="googleIcon" />{" "}
                  <strong className="googletext">Signup With Google</strong>
                </div>

                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
