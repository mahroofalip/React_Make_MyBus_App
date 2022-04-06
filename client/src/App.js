import { Routes, Route } from "react-router-dom";
import Signup from "./Components/admin/Signup";
import Login from "./Components/admin/Login";
import AdminHome from "./Components/admin/AdminHome";
import MainHome from "./Components/user/MainHome";
import Txt from "./Components/user/navbar/Txt";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/" element={<MainHome />} />
        <Route path="/test" element={<Txt/>}/>
      </Routes>
    </div>
  );
}

export default App;
