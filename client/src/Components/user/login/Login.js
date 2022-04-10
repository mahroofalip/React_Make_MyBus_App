import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../forms.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();
  const { useState } = React;

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [emailErr, setEmailErr] = useState(false);
  const [PasswordErr, setPasswordErr] = useState(false);

  const [eye, seteye] = useState(true);
  const [pass, setpass] = useState("password");
  console.log(Email, Password);
  console.log(Email, Password);

  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

   

    if (Email.length < 1) {
      setEmailErr(true);
     
    } else {
      setEmailErr(false);
    }
    if (Email === "") {
      setEmailErr(true);
    
    } else {
      setEmailErr(false);
    }
    if (Password === "") {
      setPasswordErr(true);
    
    } else {
      setPasswordErr(false);
    }

    if (!emailErr && !PasswordErr) {
      axios

        .post("http://localhost:3001/user/Login", { Email, Password })
        .then((res) => {
          console.log(res.data.user);

          let user = res.data.user;
          if (user === 0) {
            alert("Password wrong");
          } else if (!user) {
            alert("Invalid user");
          } else {
            alert("successfully login");

            navigate("/home");
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
  return (
    <>
      <div className="wraper">
        <div className="container">
          <div className="card">
            <div className="form">
              <div className="left-side">
                <img
                  className="imagebus"
                  src="https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVzfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                  alt=""
                />
              </div>

              <div className="right-side">
                <div className="register">
                  <p>
                    New User ?<Link to="/signup">Signup Now</Link>
                  </p>
                </div>

                <div className="hello">
                  <h2>Login</h2>
                </div>

                <form onSubmit={submitForm}>
                  <div className="input_text">
                    <input
                      style={{ color: "black" }}
                      className={` ${emailErr ? "warning" : "nowarning"}`}
                      type="email"
                      placeholder="Enter Email"
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
                  <div className="recovery">
                    <p>Recovery Password</p>
                  </div>
                  <div className="btn">
                    <button type="submit">Sign in</button>
                  </div>
                </form>

                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
