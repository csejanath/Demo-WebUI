import React, { Component } from 'react'
import './App.css'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import Login from "./Login";
import Dashboard from "./Dashboard";
import AuthService from "../utils/AuthService";


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.getToken()
            ? <Component {...props} />
            : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }} />
    )} />
)

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute path='/dashboard' component={Dashboard}/>
                    <Redirect from="/" to="login" />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;