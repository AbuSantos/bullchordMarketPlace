/** @format */

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateItem from "./Create/CreateItem";
import Dashboad from "./DashBoard/Dashboad";
// import Hero from "./Hero/Hero";
// import Hero_footer from "./Hero_footer/Hero_footer";
import MarketPlace from "./MarketPlace/MarketPlace";
import MyAssets from "./MyAssets/MyAssets";
import Navigation from "./Navigation/Navigation";
import Home from "./Home";
import ErrorPage from "./ErrorPage";

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createcard" element={<CreateItem />} />
          <Route path="/mycards" element={<MyAssets />} />
          <Route path="/dashboard" element={<Dashboad />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
