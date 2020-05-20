import React from 'react';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import ControlledForm from './Forms/controlled';
import DebounceForm from './Forms/debounced';
import UncontrolledForm from './Forms/uncontrolled';
import CustomInputsForm from './Forms/customInputs';



const App: React.FC = () => {


  return (
    <PerfectScrollbar>
      <div className="col" style={{ justifyContent: "center", display: "flex" }}>
        <a href="https://github.com/Jucian0/react-data-forms" target="_blank"> React Data Forms</a>
      </div>
      <div className="container">
        <div className="section">
          <ControlledForm />
        </div>
        <div className="section">
          <DebounceForm />
        </div >
        <div className="section">
          <UncontrolledForm />
        </div >
        <div className="section">
          <CustomInputsForm />
        </div >
      </div>
    </PerfectScrollbar>
  );
}

export default App;
