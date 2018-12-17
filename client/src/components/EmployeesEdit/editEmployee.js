import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, FormGroup, ControlLabel, FormControl, ToggleButtonGroup, ToggleButton, Button, HelpBlock, Alert, Navbar, Nav, NavItem } from 'react-bootstrap';
import { editEmployees, getManager } from '../../store.js';
import { connect } from 'react-redux';
import Avatar from 'react-avatar';
import DatePicker from 'react-date-picker';
import ReactPhoneInput from 'react-phone-input-2';
import validator from 'email-validator';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../../index.css';

class editEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfo : {
                first   : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).name.split(' ')[0],
                last    : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).name.split(' ')[1],
                title   : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).title,
                photo   : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).photo,
                file    : '',
                sex     : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).sex,
                date    : this.props.employees.length === 0 ? new Date() : new Date(this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).start_date + " "),
                office  : this.props.employees.length === 0 ? '' : "+1 " + this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).office_number,
                cell    : this.props.employees.length === 0 ? '' : "+1 " + this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).cell_number,
                sms     : this.props.employees.length === 0 ? '' : "+1 " + this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).sms,
                email   : this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).email,
                manager : this.props.employees.length === 0 ? '' : { value : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).manager._id,
                    label : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).manager.name ? this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).manager.name : "None"
                }
            },
            info_valid : {
                first_valid    : true,
                last_valid     : true,
                title_valid    : true,
                photo_valid    : true,
                sex_valid      : true,
                office_valid   : true,
                cell_valid     : true,
                sms_valid      : true,
                email_valid    : true,
                manager_valid  : true
            },
            map         : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            changePhoto : false,
            changeName  : false
        };
    }

    componentDidMount(){
        this.props.getManager();
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    handlePhotoChange = e => {
        this.setState({ 
            userinfo    : {...this.state.userinfo,
                photo : URL.createObjectURL(e.target.files[0]),
                file  : e.target.files[0]
            },
            changePhoto : true
        });
    }

    handleFirstChange = e => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, first : e.target.value},
            info_valid : {...this.state.info_valid, first_valid: true },
            changeName : true
        });
    } 

    handleLastChange = e => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, last : e.target.value},
            info_valid : {...this.state.info_valid, last_valid: true },
            changeName : true
        });
    }

    handleTitleChange = e => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, title : e.target.value},
            info_valid : {...this.state.info_valid, title_valid: true }
        });
    }

    handleDateChange = date => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, date}
        });
    }

    handleSexChange = input => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, sex : input},
            info_valid : {...this.state.info_valid, sex_valid: true }
        });
    }

    handleOfficeChange = input => {
        this.setState({ 
            userinfo     : {...this.state.userinfo, office : input},
            info_valid   : {...this.state.info_valid, office_valid: true}
        });
    }

    handleCellChange = input => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, cell : input},
            info_valid : {...this.state.info_valid, cell_valid: true}
        });
    }

    handleSMSChange = input => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, sms : input},
            info_valid : {...this.state.info_valid, sms_valid: true}
        });
    }

    handleEmailChange = e => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, email : e.target.value},
            info_valid : {...this.state.info_valid, email_valid: e.target.value === '' ? true : validator.validate(e.target.value)}
        });
    }

    handleManagerChange = input => {
        this.setState({ 
            userinfo   : {...this.state.userinfo, manager : input},
            info_valid : {...this.state.info_valid, manager_valid: true}
        });
    }

    submitChange = () => {
        if (this.state.userinfo.first.trim() === ''){
            this.setState({ 
                userinfo   : {...this.state.userinfo, first : ''},
                info_valid : {...this.state.info_valid, first_valid : false }
            });
            return;
        }
        if (this.state.userinfo.last.trim() === ''){
            this.setState({
                userinfo   : {...this.state.userinfo, last : ''}, 
                info_valid : {...this.state.info_valid, last_valid : false }
            });
            return;
        }
        if (this.state.userinfo.title.trim() === ''){
            this.setState({
                userinfo   : {...this.state.userinfo, title : ''}, 
                info_valid : {...this.state.info_valid, title_valid : false }
            });
            return;
        }
        if (this.state.userinfo.sex === ''){
            this.setState({ 
                info_valid : {...this.state.info_valid, sex_valid : false }
            });
            return;
        }
        if (this.state.userinfo.office.length !== 17 || !this.state.userinfo.office.startsWith("+1 (")){
            this.setState({ 
                info_valid : {...this.state.info_valid, office_valid : false }
            });
            return;
        }
        if (this.state.userinfo.cell.length !== 17 || !this.state.userinfo.cell.startsWith("+1 (")){
            this.setState({ 
                info_valid : {...this.state.info_valid, cell_valid : false }
            });
            return;
        }
        if (this.state.userinfo.sms.length !== 17 || !this.state.userinfo.sms.startsWith("+1 (")){
            this.setState({ 
                info_valid : {...this.state.info_valid, sms_valid : false }
            });
            return;
        }
        if (this.state.userinfo.email === ''){
            this.setState({ 
                info_valid : {...this.state.info_valid, email_valid : false }
            });
            return;
        }

        if (this.state.userinfo.manager === ''){
            this.setState({ 
                info_valid : {...this.state.info_valid, manager_valid : false }
            });
            return;
        }
        let employee = new FormData();
        let date     = (this.state.userinfo.date).toString().split(' ').slice(1, 4);
        let month    = this.state.map.findIndex( ele => ele === date[0]) + 1;
        employee.append('id',            this.props.match.params.id);
        employee.append('name',          this.state.userinfo.first + ' ' + this.state.userinfo.last);
        employee.append('title',         this.state.userinfo.title);
        employee.append('sex',           this.state.userinfo.sex);
        employee.append('office_number', this.state.userinfo.office.slice(3, 17));
        employee.append('cell_number',   this.state.userinfo.cell.slice(3, 17));
        employee.append('sms',           this.state.userinfo.sms.slice(3, 17));
        employee.append('start_date',    date[2] + '-' + (month < 10 ? '0' + month : month) + '-' + date[1]);
        employee.append('email',         this.state.userinfo.email);
        employee.append('manager',       JSON.stringify({name : this.state.userinfo.manager.label === "None" ? null : this.state.userinfo.manager.label, _id : this.state.userinfo.manager.value}));
        employee.append('photo',         this.state.changePhoto ? this.state.userinfo.file : new Blob([new Uint8Array(this.state.userinfo.photo.data.data)], {type : 'image/png'}));
        employee.append('changePhoto',   this.state.changePhoto);
        employee.append('changeName',    this.state.changeName);
        this.props.editEmployees(employee);
    }

    render() {
        if (this.props.status === "success"){
            return <Redirect to='/' />
        }
        let managers = [];
        this.props.manager.forEach(ele => {
            let cur_employee = ele;
            while (cur_employee) {
                if (cur_employee._id === this.props.match.params.id)
                    break;
                cur_employee = this.props.manager.find(employee => employee._id === cur_employee.manager._id);
            }
            if (!cur_employee)
                managers.push(ele);
        });
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>Edit Employee:</Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem componentClass='span'>
                            <Button bsStyle="default">
                                <Link style={{ color: 'black' }} to="/">Go Back</Link>
                            </Button>
                        </NavItem>
                        <NavItem>
                            <Button bsStyle="success" onClick={this.submitChange} disabled={
                                this.props.status                 === 'uploading' ||
                                this.state.userinfo.first.trim()  === ''          ||
                                this.state.userinfo.last.trim()   === ''          ||
                                this.state.userinfo.title.trim()  === ''          ||
                                this.state.userinfo.sex           === ''          ||
                                this.state.userinfo.office.length !== 17          ||
                                this.state.userinfo.cell.length   !== 17          ||
                                this.state.userinfo.sms.length    !== 17          ||
                                this.state.userinfo.email         === ''          ||
                                !this.state.userinfo.office.startsWith("+1 (")    ||
                                !this.state.userinfo.cell.startsWith("+1 (")      ||
                                !this.state.userinfo.sms.startsWith("+1 (")
                            }>
                                {this.props.status === 'uploading' ? "Saving" : "Save"}
                            </Button>
                        </NavItem>
                    </Nav>
                </Navbar>
                {this.props.status === "fail" ? (<Alert bsStyle="danger">
                    <strong>Opps, Something wrong!</strong> Please upload again!
                </Alert>) : null}
                <div style={{width : '600px', float : "left", textAlign : "center"}}>
                    <Avatar src={this.state.changePhoto ? this.state.userinfo.photo : "data:image/png;base64," + this.arrayBufferToBase64(this.props.employees.length === 0 ? '' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).photo.data.data)} size="480" /><br />
                    <div style={{display: "flex", justifyContent : "center", flexDirection : "row"}}>
                        <FormGroup validationState={this.state.info_valid.photo_valid ? null : "error"}>
                            <ControlLabel>Please select a photo as avatar: </ControlLabel>
                        </FormGroup>
                        <input
                        type="file"
                        onChange={this.handlePhotoChange} 
                        />
                    </div>
                    {this.state.info_valid.photo_valid ? null : (<HelpBlock>Please Select A Photo</HelpBlock>)}
                </div>
                <div style={{width : '600px', float : "right"}}>
                    <Form>
                        <FormGroup validationState={this.state.info_valid.first_valid ? null : "error"}>
                            <ControlLabel>First Name: </ControlLabel>
                            <FormControl
                                type="text" 
                                onChange={this.handleFirstChange} 
                                value={this.state.userinfo.first}
                                placeholder="Enter First Name"
                            />
                            {this.state.info_valid.first_valid ? null : (<HelpBlock>Please Enter Valid First Name</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.last_valid ? null : "error"}>
                            <ControlLabel>Last Name: </ControlLabel>
                            <FormControl
                                type="text" 
                                onChange={this.handleLastChange} 
                                value={this.state.userinfo.last}
                                placeholder="Enter Last Name"
                            />
                            {this.state.info_valid.last_valid ? null : (<HelpBlock>Please Enter Valid Last Name</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.title_valid ? null : "error"}>
                            <ControlLabel>Title: </ControlLabel>
                            <FormControl
                                type="text" 
                                onChange={this.handleTitleChange} 
                                value={this.state.userinfo.title}
                                placeholder="Enter Title"
                            />
                            {this.state.info_valid.title_valid ? null : (<HelpBlock>Please Enter Valid Title</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.sex_valid ? null : "error"}>
                            <ControlLabel>Sex: </ControlLabel>&nbsp;
                            <ToggleButtonGroup 
                                type="radio" 
                                name="sex" defaultValue='unselected' 
                                defaultValue={this.props.employees.length === 0 ? 'unselected' : this.props.employees.find(ele => {return ele._id === this.props.match.params.id}).sex} 
                                onChange={this.handleSexChange}
                            >
                                <ToggleButton value='Male'>Male</ToggleButton>
                                <ToggleButton value='Female'>Female</ToggleButton>
                            </ToggleButtonGroup><br />
                            {this.state.info_valid.sex_valid ? null : (<HelpBlock>Please Select Gender</HelpBlock>)}
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Start Date: </ControlLabel>&nbsp;
                            <DatePicker
                                onChange={this.handleDateChange}
                                value={this.state.userinfo.date}
                            />
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.office_valid ? null : "error"}>
                            <ControlLabel>Office Phone: </ControlLabel>
                            <ReactPhoneInput
                                defaultCountry={'us'}
                                value={this.state.userinfo.office}
                                onChange={phone => this.handleOfficeChange(phone)}
                            />
                            {this.state.info_valid.office_valid ? null : (<HelpBlock>Please Enter Valid US Phone Number</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.cell_valid ? null : "error"}>
                            <ControlLabel>Cell Phone: </ControlLabel>
                            <ReactPhoneInput
                                defaultCountry={'us'}
                                value={this.state.userinfo.cell}
                                onChange={phone => this.handleCellChange(phone)}
                            />
                            {this.state.info_valid.cell_valid ? null : (<HelpBlock>Please Enter Valid US Phone Number</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.sms_valid ? null : "error"}>
                            <ControlLabel>SMS: </ControlLabel>
                            <ReactPhoneInput
                                defaultCountry={'us'}
                                value={this.state.userinfo.sms}
                                onChange={phone => this.handleSMSChange(phone)}
                            />
                            {this.state.info_valid.sms_valid ? null : (<HelpBlock>Please Enter Valid US Phone Number</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.email_valid ? null : "error"}>
                            <ControlLabel>Email: </ControlLabel>
                            <FormControl
                                type="text" 
                                onChange={this.handleEmailChange} 
                                value={this.state.userinfo.email}
                                placeholder="Enter Email"
                            />
                            {this.state.info_valid.email_valid ? null : (<HelpBlock>Please Enter Valid Email</HelpBlock>)}
                        </FormGroup>
                        <FormGroup validationState={this.state.info_valid.manager_valid ? null : "error"}>
                            <ControlLabel>Manager: </ControlLabel><br />
                            <Dropdown 
                                options={[{label : 'None', value : null}].concat(managers.map(ele => { return {label : ele.name, value : ele._id}}))} 
                                onChange={this.handleManagerChange}
                                value={this.state.userinfo.manager.label}
                                placeholder="Select Manager"
                            />
                            {this.state.info_valid.manager_valid ? null : (<HelpBlock>Please Select Manager</HelpBlock>)}
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        employees : state.employees,
        manager   : state.managers,
        status    : state.edit_status
    }
};
  
const mapDispatchToProps = dispatch => {
    return({
        editEmployees     : (employee) => {
            dispatch(editEmployees(employee));
        },
        getManager : () => {
            dispatch(getManager());
        }
    })
}
  
export default connect(mapStateToProps, mapDispatchToProps)(editEmployee);