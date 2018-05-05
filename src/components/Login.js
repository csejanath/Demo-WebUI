import React, {Component} from 'react'
import AuthService from "../utils/AuthService";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

import './login.css';
import {Flip, toast, ToastContainer} from "react-toastify";

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
        this.Auth.login(this.state.userName, this.state.password).then(response => {
            if (response) {
                let _this = this;
                setTimeout(function () {
                    _this.props.history.push("/dashboard");
                }, 500)
            } else {
                console.log("Got 401");

                toast(`Login Failed`, {
                    position: toast.POSITION.TOP_CENTER,
                    className: 'error',
                });
            }
        })
    }

    render() {
        return (
            <div className="login-wrapper">
                <ToastContainer transition={Flip} autoClose={10000} closeButton={false} hideProgressBar={true}/>
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