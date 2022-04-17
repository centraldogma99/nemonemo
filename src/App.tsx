import React from "react";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Layout />
      </div>
    </RecoilRoot>
  );
}

export default App;
