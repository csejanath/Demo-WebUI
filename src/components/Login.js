import React, {Component} from 'react'
import AuthService from "../utils/AuthService";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

import './login.css';

class Login extends Component {

    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    login() {
         if(this.Auth.login(this.state.userName, this.state.password)) {
             let _this = this;
             setTimeout(function () {
                 _this.props.history.push("/dashboard");
                 // location.reload();
             },500)
        }else  {
            console.log("Got 401");
            // alert('login failed');
        }
    }

    render() {
        return (
            <div className="login-wrapper">
                <Form className="login-box p-3">
                    <FormGroup>
                        <Label for="exampleEmail">Username</Label>
                        <Input name="userName" type="text" ref="userName" onChange={this.handleInputChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input name="password" type="password" ref="password" onChange={this.handleInputChange}/>
                    </FormGroup>
                    <Button color="primary" onClick={() => {
                        this.login()
                    }}>Login</Button>
                </Form>
            </div>
        )
    }
}

export default Login;