import React, {Component} from 'react'
import AuthService from "../utils/AuthService";
import './sidebar.css';

import {
    Button, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from 'reactstrap';
import Dropzone from "react-dropzone";
import {sha256} from 'js-sha256';
import {toast} from "react-toastify";
// import SnackBar from "react-material-snackbar/src/index";

// let crypto = require('crypto');
// let fs = require('fs');
// import axios from 'axios';

class SideBar extends Component {
    Auth = new AuthService();

    constructor(props) {
        super(props);
        this.state = {
            registryModal: false,
            confirmModal: false,
            verifyModal: false,
            confirmMsg: '',
            fileTransferModal: false,
            confirmType: '',
            fileList: [],
            files: [],
            fileName: "",
            fileSize: "",
            nickname: "",
            remarks: "",
            otherUsername: "",
            sendQuantity: 0,
            doc_type: "Bill of Landing",
            type: "",
            quantity: "",
            hash: "",
            selectedFile: null,
        };

        this.toggleRegistrationModal = this.toggleRegistrationModal.bind(this);
        this.selectFile = this.selectFile.bind(this);
    }

    // logout
    logout() {
        this.Auth.logout();

        this.props.history.push("/login");
    }

    //toggle file registration modal
    toggleRegistrationModal() {
        this.setState({
            registryModal: !this.state.registryModal,
            files: []
        });
    }

    //drop files
    onDrop(files) {

        let reader = new FileReader();

        const scope = this;
        reader.onload = function(e) {
            // alert(sha256(reader.result));
            // hash = reader.result;
            scope.setState({
                hash: sha256(reader.result)
            });
      
        };

        // reader.onload = () => this.setState({ hash: sha256(reader.result) })

        reader.readAsBinaryString(files[0]);

        this.setState({
            files: files,
            fileName: files[0].name,
            fileSize: files[0].size
        });
        
// // the file you want to get the hash    
// var fd = fs.createReadStream(files[0].name);
// var hash = crypto.createHash('sha256');
// hash.setEncoding('hex');

// fd.on('end', function() {
//     hash.end();
//     console.log(hash.read()); // the desired sha1sum
// });

// // read all file and pipe it (write it) to the hash object
// fd.pipe(hash);

// alert(sha256(files[0].name));

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
        this.updateFileList();
    }

    updateFileList() {
        fetch(`/registry/list`, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'GET',
            credentials: 'same-origin',
            withCredentials: true
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        fileList: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error)
                }
            )
    }

    //register file
    registryFile() {
        fetch(`/registry/${this.state.hash}`, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            credentials: 'same-origin',
            withCredentials: true,
            body: JSON.stringify({
                fileName: this.state.fileName,
                fileSize: this.state.fileSize,
                nickname: this.state.nickname,
                remarks: this.state.remarks,
                doc_type: this.state.doc_type,
                type: this.state.type,
                quantity: this.state.quantity
            })
        })
            .then(res => res.json())
            .then(
                (result) => {

                    if(result.error) {
                        toast(`${result.error}`, {
                            position: toast.POSITION.TOP_CENTER,
                            className: 'error',
                        });
                        return false
                    }

                    let files = this.state.fileList.slice();
                    files.push({fileName: this.state.fileName, fileSize: this.state.fileSize, nickname: this.state.nickname, remarks: this.state.remarks, doc_type: this.state.doc_type, quantity: this.state.quantity, myqty: this.state.quantity, totalqty: this.state.quantity, id: result.id});
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

                    toast(`${this.state.fileName} registry successful !`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'success',
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast("Error message !", {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'error',
                    });
                }
            )
    }

    //file select for info
    selectFile(file){
        this.props.setsSelectedFile(file);
        this.setState({
            selectedFile: file
        })
    }


    //toggle confirm modal
    toggleConfirmModal() {
        this.setState({
            confirmModal: !this.state.confirmModal,
        })
    }

    //toggle confirm modal
    confirmCallback() {
        this.toggleConfirmModal();
        if( this.state.confirmType === 'transfer') {
            this.transferFile();
        } else if( this.state.confirmType === 'cancel') {
            this.cancelFile();
        }
    }

    //tranfer file
    toggleFileTransferModal(){
        this.setState({
            fileTransferModal: !this.state.fileTransferModal,
        })
    }

    //tranfer file confirm
    fileTransferConfirm(){
        this.toggleFileTransferModal();
        this.toggleConfirmModal();
        this.setState({
            confirmType: 'transfer',
            confirmMsg: `Are you sure, you want transfer ${this.state.selectedFile.fileName}`,
        })
    }

    //tranfer file
    transferFile(){

        fetch(`/registry/transfer/${this.state.selectedFile.hash}`, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            credentials: 'same-origin',
            withCredentials: true,
            body: JSON.stringify({
                otherUsername: this.state.otherUsername,
                type: 'ETR',
                quantity: this.state.sendQuantity,
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.error) {
                        toast(`${result.error}`, {
                            position: toast.POSITION.TOP_CENTER,
                            className: 'error',
                        });
                        return false
                    }

                    this.updateFileList();
                    this.setState({
                        selectedFile: null,
                    })

                    toast(`${this.state.fileName} transfer successful !`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'success',
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast('Error', {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'error',
                    });
                }
            )
    }

    // toggleCancelConfirmModal
    toggleCancelConfirmModal() {
        this.toggleConfirmModal();
        this.setState({
            confirmType: 'cancel',
            confirmMsg: `Are you sure, you want cancel ${this.state.selectedFile.fileName}`,
        })
    }

    // toggleVerfyModal
    toggleVerifyModal() {
        this.setState({
            verifyModal: !this.state.verifyModal,
        })
    }

    //tranfer file
    cancelFile(){

        fetch(`/registry/cancel/${this.state.selectedFile.hash}`, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            credentials: 'same-origin',
            withCredentials: true,
            body: JSON.stringify({
                fileName: this.state.selectedFile.fileName,
                size: this.state.selectedFile.fileSize,
                type: 'ETR',
                quantity: this.state.selectedFile.quantity,
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.error) {
                        toast(`${result.error}`, {
                            position: toast.POSITION.TOP_CENTER,
                            className: 'error',
                        });
                        return false
                    }
                    this.updateFileList();
                    this.setState({
                        selectedFile: null,
                    })
                    toast(`${this.state.selectedFile.fileName} cancel successful !`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'success',
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast(`Error`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'success',
                    });
                }
            )
    }

    //tranfer file
    verifyFile(){

        fetch(`/registry/${this.state.hash}/${this.state.fileSize}`, {
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            method: 'GET',
            credentials: 'same-origin',
            withCredentials: true,
        })
            .then(res => res.json())
            .then(
                (result) => {

                    if(result.error) {
                        toast(`${result.error}`, {
                            position: toast.POSITION.TOP_CENTER,
                            className: 'error',
                        });
                        return false
                    }

                    this.updateFileList();
                    this.toggleVerifyModal();
                    toast("Wow so easy !", {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'black-background',
                    });
                    toast(`${this.state.fileName} verify successful !`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'success',
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast(`Error`, {
                        position: toast.POSITION.TOP_CENTER,
                        className: 'error',
                    });
                }
            )
    }

    setSelectQuantity () {
        let options = [];
        if (this.state.selectedFile) {
            for (let i = 0; i < this.state.selectedFile.quantity; i++) {
                options.push( <option key={i} value={i + 1}>{i + 1}</option>);
            }
        }
        return options;
    }

    render() {
        return (
            <aside className="side-bar border-right">
                {/*<SnackBar*/}
                    {/*show={true}                            //Boolean  - Required and Default - `false`*/}
                    {/*timer={6000}                           //Number   - Optional and Default - `4000` (4 secs)*/}
                {/*>*/}
                    {/*// Pass any HTML element to render*/}
                    {/*<p>Loading...</p>*/}
                {/*</SnackBar>*/}
                <ListGroup className="border-0">
                    {
                        this.state.fileList.map((f, i) =>
                            <ListGroupItem key={i} onClick={() => this.selectFile(f)} className={(f.quantity>0 ? 'list-group-item-etr' : 'list-group-item') +' '+ (f === this.state.selectedFile ? 'item-select' : '')} tag="a"
                                                                    href="#">{f.quantity>0 ? (f.fileName + ' (' + f.myqty + '/' + f.totalqty + ')') : f.fileName}</ListGroupItem>)
                    }
                </ListGroup>
                <div className="d-flex flex-column align-items-stretch p-3">
                    <Button color="primary mb-2" onClick={this.toggleRegistrationModal}>Register File</Button>
                    <Button color="primary mb-2">Register with Link</Button>
                    { this.state.selectedFile &&
                    <Button color="primary mb-2" onClick={this.toggleVerifyModal.bind(this)}>Verify File</Button>
                    }
                    { (this.state.selectedFile && this.state.selectedFile.quantity > 0) &&

                        <div className="d-flex flex-column align-items-stretch">
                            <Button color="primary mb-2" onClick={this.toggleFileTransferModal.bind(this)}>Transfer</Button>
                            <Button color="primary mb-2" onClick={this.toggleCancelConfirmModal.bind(this)}>Cancel</Button>
                        </div>
                    }
                </div>

                {/*register file modal*/}
                <Modal isOpen={this.state.registryModal} toggle={this.toggleRegistrationModal} className={this.props.className}>
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
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="nickname" sm={4}>Nickname:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="text" name="nickname"
                                           id="nickname" onChange={this.handleInputChange.bind(this)}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="remarks" sm={4}>Remarks:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="text" name="remarks" id="remarks"
                                           onChange={this.handleInputChange.bind(this)}/>
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="doc_type" sm={4}>Document Type:</Label>
                                <Col sm={8}>
                                    <Input className="border modal-input" type="select" name="doc_type" id="doc_type"
                                           onChange={this.handleInputChange.bind(this)}>
                                        <option value="Bill of Landing">Bill of Landing</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label sm={4} check className="ml-4">
                                    <Input type="radio" value="ETR" name="type" checked={this.state.type === 'ETR'}
                                           onChange={this.handleInputChange.bind(this)}/>
                                    Original
                                </Label>
                                <Label sm={4} check>
                                    <Input type="radio" value="TC" name="type" checked={this.state.type === 'TC'}
                                           onChange={this.handleInputChange.bind(this)}/>
                                    True copy
                                </Label>
                            </FormGroup>
                            {this.state.type === 'ETR' &&
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="quantity" sm={4}>Quantity:</Label>
                                <Col sm={8}>
                                    <Input className="border-bottom modal-input" type="number" name="quantity"
                                           id="quantity" onChange={this.handleInputChange.bind(this)}/>
                                </Col>
                            </FormGroup>
                            }
                        </Row>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.registryFile.bind(this)}>Register</Button>
                    </ModalFooter>
                </Modal>

                {/*verify file modal*/}
                <Modal isOpen={this.state.verifyModal} toggle={this.toggleVerifyModal} className={this.props.className}>
                    <ModalHeader>Verify</ModalHeader>
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

                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.verifyFile.bind(this)}>Verify</Button>
                    </ModalFooter>
                </Modal>

                {/* confirm modal */}
                <Modal isOpen={this.state.confirmModal} toggle={this.toggleConfirmModal} className={this.props.className}>
                    <ModalHeader>Confirm</ModalHeader>
                    <ModalBody className="pl-4 pr-4">
                        <p>{this.state.confirmMsg}</p>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.confirmCallback.bind(this)}>Confirm</Button>
                        <Button color="secondary" onClick={this.toggleConfirmModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* confirm modal */}
                <Modal isOpen={this.state.fileTransferModal} toggle={this.toggleFileTransferModal} className={this.props.className}>
                    <ModalHeader>File Transfer</ModalHeader>
                    <ModalBody className="pl-4 pr-4">
                        <Row>
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="doc_type" sm={4}>Select user:</Label>
                                <Col sm={8}>
                                    <Input className="border modal-input" type="select" name="otherUsername" id="otherUsername"
                                           onChange={this.handleInputChange.bind(this)}>
                                        <option value="">Select</option>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup row className="pt-1 pb-1 m-0 mt-2 w-100">
                                <Label for="doc_type" sm={4}>Select quantity:</Label>
                                <Col sm={8}>
                                    <Input className="border modal-input" type="select" name="sendQuantity" id="sendQuantity"
                                           onChange={this.handleInputChange.bind(this)}>
                                        <option value="">Select</option>)
                                        {this.setSelectQuantity()}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Row>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="primary" onClick={this.fileTransferConfirm.bind(this)}>Transfer</Button>
                        <Button color="secondary" onClick={this.toggleFileTransferModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </aside>
        )
    }
}

export default SideBar;