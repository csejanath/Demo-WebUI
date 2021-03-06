import React, { Component } from 'react'
import AuthService from "../utils/AuthService";
import './dashboard.css';
import Header from "./Header";
import SideBar from "./SideBar";
import {ToastContainer, Flip} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

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
                <ToastContainer transition={Flip} autoClose={10000} closeButton={false} hideProgressBar={true}/>
                <Header/>
                <div className="main-content">
                    <SideBar setsSelectedFile={this.setsSelectedFile.bind(this)}></SideBar>
                    <div className="file-details">{this.state.selectedFile && 
                        <div className="p-3">{
                        <ul>
                            <li>File Name       : {this.state.selectedFile.fileName}</li>
                            <li>File Size       : {this.state.selectedFile.fileSize}</li>
                            <li>Nickname        : {this.state.selectedFile.nickname}</li>
                            <li>Remarks         : {this.state.selectedFile.remarks}</li>
                            <li>Document Type   : {this.state.selectedFile.doc_type}</li>
                            <li>Quantity        : {this.state.selectedFile.quantity}</li>
                        </ul>
                        }</div>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;