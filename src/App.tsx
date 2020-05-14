import React, { useEffect } from 'react';
import './App.css';
import { useForm, useCustom } from './RForm';
import Select from 'react-select';
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
  "birthday": null,
  date: null,
  accept: true
}

const App: React.FC = () => {


  const [{ values, onSubmit, reset, resetField }, { input, context }] = useForm(initialState)
  const [select] = useCustom(context)
  const [date, selected] = useCustom(context)


  const submit = () => {
    onSubmit(data => {
      console.log(data)
    })
  }

  useEffect(() => {
    console.log(values)
  }, [values])


  return (
    <div className="content">
      <div className="row">
        <div className="col-lg-4">
          <div className="form-group">
            <label>Nome</label>
            <input className="form-control" autoComplete="off" {...input('name', 'text')} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input className="form-control" autoComplete="off" {...input("email", "email")} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea className="form-control" autoComplete="off" {...input("bio")} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" autoComplete="off" {...input('password', "password")} />
          </div>

          <div>
            <h3>Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input className="form-control" autoComplete="off" {...input({ name: "address.0.street", type: "text" })} />
            </div>
            <div className="form-group">
              <label>Number</label>
              <input className="form-control" autoComplete="off" {...input("address.0.number", "number")} />
            </div>
          </div>

        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label>Select Option</label>
            <select {...input("options")}>
              <option value="value 1">Option 1</option>
              <option value="value 2">Option 2</option>
              <option value="value 3">Option 3</option>
              <option value="value 4">Option 4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Files</label>
            <input className="form-control" {...input("file", 'file')} multiple />
          </div>

          <div className="form-group">
            <label>Range</label>
            <input className="form-control" {...input("range", "range")} />
          </div>

          <div className="form-group">
            <label>Accept</label>
            <input className="form-control" autoComplete="off" {...input("accept", "checkbox")} />
          </div>


        </div>

        <div className="col-lg4">
          <div className="form-group">
            <label>React Select</label>
            <Select
              {...select("iceCream.flavor")}
              options={options}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div className="form-group">
            <label>Native Web Date</label>
            <input className="form-control" autoComplete="off" {...input("date", "date")} />
          </div>

          <div className="form-group">
            <label>Date Picker</label>
            <DatePicker
              selected={selected}
              {...date("year")}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>

          <div className="form-group">
            <label>Radio Options</label>
            <div className="form-check">
              <input className="form-check-input" {...input({ name: "radio", value: "op1", type: "radio" })} />
              <label className="form-check-label" htmlFor="exampleRadios1" >OP1</label>
            </div>
            <div className="form-check">
              <input className="form-check-input"
                {...input({ name: "radio", value: "op2", type: "radio" })}
              />
              <label className="form-check-label" htmlFor="exampleRadios2" >OP2</label>
            </div>
            <div className="form-check disabled">
              <input className="form-check-input" {...input({ name: "radio", value: "op3", type: "radio" })} />
              <label className="form-check-label" htmlFor="exampleRadios3" >OP3</label>
            </div>
          </div >
        </div>

        <div className="col-lg-5">
          <button type="button" className="btn btn-primary" onClick={submit}>Submit</button>
        </div>
        <div className="col-lg-2">
          <button type="button" className="btn btn-primary" onClick={() => resetField("year")}>Reset number</button>
        </div>
        <div className="col-lg-2">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>Reset All</button>
        </div>
      </div>
    </div >
  );
}

export default App;
