import React from "react";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import DebounceForm from "./Forms/debounced";

const App: React.FC = () => {
  return (
    <PerfectScrollbar>
      <div className="container-fluid">
        <div className="section">
          <DebounceForm />
        </div>
      </div>
    </PerfectScrollbar>
  );
};

export default App;
