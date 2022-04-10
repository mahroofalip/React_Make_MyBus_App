import { Routes, Route } from "react-router-dom";
import Signup from "./Components/admin/Signup";
import Login from "./Components/admin/Login";
import AdminHome from "./Components/admin/AdminHome";
import MainHome from "./Components/user/MainHome";
import UserLogin from "./Components/user/login/Login";
import UserSignup from "./Components/user/signup/Signup";
import MaxWidthDialog from "./Components/user/Otp/OtpInput";
import AddBus from "./Components/admin/addbus";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/signup" element={<UserSignup/>}/>
        <Route path="/otp" element={<MaxWidthDialog/>}/>
        <Route path="/admin/addbus" element={<AddBus/>}/>
       
      </Routes>
    </div>
  );
}

export default App;
