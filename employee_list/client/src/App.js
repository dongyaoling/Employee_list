import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Employees from './components/employees'
import AddEmployee from './components/EmployeeCreate/addEmployee'
import editEmployee from './components/EmployeesEdit/editEmployee'
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Employees} />
            <Route path="/addEmployee" component={AddEmployee} />
            <Route path="/editEmployee/:id" component={editEmployee} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
