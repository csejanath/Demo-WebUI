import React, { Component } from 'react'
import AuthService from "../utils/AuthService";
import './dashboard.css';
import Header from "./Header";
import SideBar from "./SideBar";

class Dashboard extends Component {
    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="wrapper">
                <Header/>
                <div className="main-content">
                    <SideBar></SideBar>
                </div>
            </div>
        )
    }
}

export default Dashboard;