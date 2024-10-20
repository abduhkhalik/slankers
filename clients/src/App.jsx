import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { NavbarSimple } from "./componets/Navbar";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Posts_List from "./pages/Posts_List";
import { useContext } from "react";
import { Context } from "./context/Context";
import PostId from "./pages/PostId";
import Daftar from "./pages/Register";
import Simpul from "./pages/Simpul";
import { Footer } from "./componets/Footer";

const App = () => {
  const { user } = useContext(Context);
  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
  return (
    <>
      <Routers>
        {user ? <NavbarSimple /> : ""}
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/simpul" element={user ? <Simpul /> : <Login />} />
          <Route path="/posts" element={user ? <Posts_List /> : <Login />} />
          <Route path="/posts/forms" element={user ? <Posts /> : <Login />} />
          <Route path="/posts/:id" element={user ? <PostId /> : <Login />} />
          <Route path="/register" element={user ? <Home /> : <Daftar />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
        </Routes>
        <Footer/>
      </Routers>
    </>
  );
};

export default App;
