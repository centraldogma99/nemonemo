import React from "react";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";
import IntroPage from "./pages/IntroPage";

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <IntroPage />
      </div>
    </RecoilRoot>
  );
}

export default App;
