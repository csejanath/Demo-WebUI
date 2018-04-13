import React, { Component } from 'react'
import AuthService from "../utils/AuthService";
import './header.css';

import { withRouter } from 'react-router-dom'

class Header extends Component {
    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {};
    }

    logout () {
        this.Auth.logout();

        this.props.history.push("/login");
    }
    render() {
        return (
            <nav className="header border-bottom">
                <h6 className="m-0 mr-3">Hello Bob</h6> <a className="text-dark" href="#0" onClick={()=>{this.logout()}}>logout</a>
            </nav>
        )
    }
}

export default withRouter(Header);