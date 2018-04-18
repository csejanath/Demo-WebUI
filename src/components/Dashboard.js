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

    setsSelectedFile(file) {
        this.setState({
            selectedFile: file
        })
    }

    render() {
        return (
            <div className="wrapper">
                <Header/>
                <div className="main-content">
                    <SideBar setsSelectedFile={this.setsSelectedFile.bind(this)}></SideBar>
                    <div className="file-details">{this.state.selectedFile && <div className="p-3">{this.state.selectedFile.fileName}</div>}</div>
                </div>
            </div>
        )
    }
}

export default Dashboard;