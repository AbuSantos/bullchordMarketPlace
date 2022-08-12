/** @format */

import "./App.css";
import Hero from "./src/Hero/Hero";
import Hero_footer from "./src/Hero_footer/Hero_footer";
import MarketPlace from "./src/MarketPlace/MarketPlace";
import Navigation from "./src/Navigation/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <div className="App">
        <Hero />
        <Hero_footer />
        <div className="display-market">
          <MarketPlace />
        </div>
      </div>
    </>
  );
}

export default App;
