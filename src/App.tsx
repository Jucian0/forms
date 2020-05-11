import React, { useEffect } from 'react';
import './App.css';
import { useForm } from './RForm';
import Select, { OptionsType } from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const options = [
  { value: 'chocolate', label: 'Chocolate', },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]


const initialState = {
  name: "jose antonio",
  email: "jose@hotmail.com",
  password: "123456",
  address: [
    {
      street: "jose osvaldo",
      number: 160
    }
  ],
  options: "value 1",
  radio: "op3",
  iceCream: {
    "flavor": options[2]
  },
  year: null,
  "birthday": null
}

const App: React.FC = () => {


  const [values, { text, checkbox, radio, select, number, custom, date }] = useForm(initialState, { onChange: true })


  useEffect(() => {
    console.log(values)
  }, [values])


  return (
    <div className="content">
      <form>
        <div className="form-group">
          <label>Nome</label>
          <input className="form-control" autoComplete="off" {...text({ name: "name" })} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input className="form-control" autoComplete="off" {...text("email")} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" autoComplete="off" {...text("password")} />
        </div>

        <div className="form-group">
          <label>Accept</label>
          <input className="form-control" autoComplete="off" {...checkbox("accept")} />
        </div>

        <div className="form-group">
          <label>React Select</label>
          <Select
            {...custom("iceCream.flavor")}
            options={options}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />

        </div>

        <div className="form-group">
          <label>Date</label>
          <DatePicker
            selected={values.year}
            {...date("year")}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <DatePicker
            selected={values.birthday}
            showPopperArrow={false}
            {...date("birthday")}
          />
          <input className="form-control" autoComplete="off" type="date" />

        </div>

        <div className="form-group">
          <label>Select Option</label>
          <select {...select("options")}>
            <option value="value 1">Option 1</option>
            <option value="value 2">Option 2</option>
            <option value="value 3">Option 3</option>
            <option value="value 4">Option 4</option>
          </select>
        </div>

        <div className="form-group">
          <label>Radio Options</label>
          <div className="form-check">
            <input className="form-check-input" {...radio({ name: "radio", value: "op1" })} />
            <label className="form-check-label" htmlFor="exampleRadios1" >Default radio</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" {...radio("radio", "op2")} />
            <label className="form-check-label" htmlFor="exampleRadios2" >Second default radio</label>
          </div>
          <div className="form-check disabled">
            <input className="form-check-input" {...radio("radio", "op3")} />
            <label className="form-check-label" htmlFor="exampleRadios3" >Disabled radio</label>
          </div>
        </div >

        <div>
          <h3>Address</h3>
          <div className="form-group">
            <label>Street</label>
            <input className="form-control" autoComplete="off" {...text({ name: "street" })} />
          </div>
          <div className="form-group">
            <label>Number</label>
            <input className="form-control" autoComplete="off" {...number("address[0].number")} />
          </div>
        </div>

        <button type="button" className="btn btn-primary">Submit</button>
      </form >
    </div >
  );
}

export default App;
