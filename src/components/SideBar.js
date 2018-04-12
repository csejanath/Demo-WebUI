import React, { Component } from 'react'
import AuthService from "../utils/AuthService";
import './sidebar.css';

import {
    Button, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from 'reactstrap';
import Dropzone from "react-dropzone";

class SideBar extends Component {
    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            files: []
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
            files
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

    render() {
        return (
            <aside className="side-bar border-right">
                <ListGroup className="border-0">
                    <ListGroupItem className="border-bottom" tag="a" href="#">Cras justo odio</ListGroupItem>
                    <ListGroupItem className="border-bottom" tag="a" href="#">Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem className="border-bottom" tag="a" href="#">Morbi leo risus</ListGroupItem>
                    <ListGroupItem className="border-bottom" tag="a" href="#">Porta ac consectetur ac</ListGroupItem>
                    <ListGroupItem className="border-bottom" tag="a" href="#">Vestibulum at eros</ListGroupItem>
                </ListGroup>
                <div className="d-flex flex-column align-items-stretch p-3">
                    <Button color="primary" onClick={this.toggleRegistrationModal}>Register File</Button>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggleRegistrationModal} className={this.props.className}>
                    <ModalHeader>Registration</ModalHeader>
                    <ModalBody className="pl-4 pr-4">
                        <Dropzone onDrop={this.onDrop.bind(this)} className="dropzone" style={{
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
                                <Label for="documentType" sm={4}>Document Type:</Label>
                                <Col sm={8}>
                                    <Input className="border modal-input" type="select" name="documentType" id="documentType" onChange={this.handleInputChange.bind(this)}>
                                        <option>Bill of Landing</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-3 pb-3 m-0 mt-2 w-100">
                                <Label sm={4} check className="ml-4">
                                    <Input type="radio" name="radio1"  />
                                    Original
                                </Label>
                                <Label sm={4} check>
                                    <Input type="radio" name="radio1" />
                                    True copy
                                </Label>
                            </FormGroup>
                        </Row>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.toggleRegistrationModal}>Register</Button>
                    </ModalFooter>
                </Modal>
            </aside>
        )
    }
}

export default SideBar;