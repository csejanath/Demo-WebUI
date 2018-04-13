import React, { Component } from 'react'
import AuthService from "../utils/AuthService";
import './sidebar.css';

import {
    Button, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from 'reactstrap';
import Dropzone from "react-dropzone";
import { sha256 } from 'js-sha256';
// import axios from 'axios';

class SideBar extends Component {
    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            fileList: [],
            files: [],
            fileName: "",
            fileSize: "",
            nickname: "",
            remarks: "",
            doc_type: "Bill of Landing",
            type: "",
            quantity: ""
        };

        this.toggleRegistrationModal = this.toggleRegistrationModal.bind(this);
    }

    // logout
    logout () {
        this.Auth.logout();

        this.props.history.push("/login");
    }

    //toggle file registration modal
    toggleRegistrationModal() {
        this.setState({
            modal: !this.state.modal,
            files: []
        });
    }

    //drop files
    onDrop(files) {
        this.setState({
            files: files,
            fileName: files[0].name,
            fileSize: files[0].size,
        });
    }

    // handle input change
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // component Did Mount
    componentDidMount() {

    }

    registryFile() {
        fetch(`http://13.229.127.31:8080/demo-0.0.1-SNAPSHOT/registry/${sha256('Message to hash')}`, {
            method: 'post',
            body: JSON.stringify({
                fileName: this.state.fileName,
                fileSize: this.state.fileSize,
                nickname: this.state.nickname,
                remarks: this.state.remarks,
                doc_type: this.state.doc_type,
                type: this.state.type,
                quantity: this.state.quantity
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);

                    let files = this.state.fileList.slice();
                    files.push({name: this.state.fileName, id: result.id});
                    this.setState({
                        fileList: files,
                        fileName: "",
                        fileSize: "",
                        nickname: "",
                        remarks: "",
                        doc_type: "Bill of Landing",
                        type: "",
                        quantity: ""
                    });
                    this.toggleRegistrationModal();
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }


    render() {
        return (
            <aside className="side-bar border-right">
                <ListGroup className="border-0">
                    {
                        this.state.fileList.map(f => <ListGroupItem key={f.id} className="border-bottom" tag="a" href="#">{f.name}</ListGroupItem>)
                    }
                </ListGroup>
                <div className="d-flex flex-column align-items-stretch p-3">
                    <Button color="primary mb-2" onClick={this.toggleRegistrationModal}>Register File</Button>
                    <Button color="primary mb-2">Register with Link</Button>
                    <Button color="primary mb-2">Verify File</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggleRegistrationModal} className={this.props.className}>
                    <ModalHeader>Registration</ModalHeader>
                    <ModalBody className="pl-4 pr-4">
                        <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} className="dropzone" style={{
                            height: '200px',
                            border: '2px dashed rgb(102, 102, 102)',
                            borderRadius: '5px',
                            width: '100%',
                        }}>
                            {
                                this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                            <p>Try dropping some files here, or click to select files</p>
                        </Dropzone>


                        <Row>
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label for="nickname" sm={4}>Nickname:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="text" name="nickname" id="nickname" onChange={this.handleInputChange.bind(this)} />
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label for="remarks" sm={4}>Remarks:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="text" name="remarks" id="remarks" onChange={this.handleInputChange.bind(this)} />
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label for="doc_type" sm={4}>Document Type:</Label>
                                <Col sm={8}>
                                    <Input className="border modal-input" type="select" name="doc_type" id="doc_type" onChange={this.handleInputChange.bind(this)}>
                                        <option value="Bill of Landing">Bill of Landing</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label sm={4} check className="ml-4">
                                    <Input type="radio" value="ETR" name="type" checked={this.state.type==='ETR'} onChange={this.handleInputChange.bind(this)}/>
                                    Original
                                </Label>
                                <Label sm={4} check>
                                    <Input type="radio" value="TC" name="type" checked={this.state.type==='TC'} onChange={this.handleInputChange.bind(this)}/>
                                    True copy
                                </Label>
                            </FormGroup>
                            {this.state.type === 'ETR' &&
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label for="quantity" sm={4}>Quantity:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="number" name="quantity" id="quantity" onChange={this.handleInputChange.bind(this)} />
                                </Col>
                            </FormGroup>
                            }
                        </Row>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.registryFile.bind(this)}>Register</Button>
                    </ModalFooter>
                </Modal>
            </aside>
        )
    }
}

export default SideBar;