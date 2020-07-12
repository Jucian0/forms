import React from "react";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import DebounceForm from "./Forms/debounced";
import Controlled from "./Forms/controlled";
import Uncontrolled from "./Forms/uncontrolled";
import CustomInputs from "./Forms/customInputs";

const App: React.FC = () => {
  return (
    <PerfectScrollbar>
      <div className="container-fluid">
        <div className="section">
          <DebounceForm />
        </div>
        <div className="section">
          <Controlled />
        </div>
        <div className="section">
          <Uncontrolled />
        </div>
        <div className="section">
          <CustomInputs />
        </div>
      </div>
    </PerfectScrollbar>
  );
};

export default App;
