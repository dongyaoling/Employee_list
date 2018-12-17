import React, { Component } from 'react';
import { Table, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import { MdUnfoldMore, MdExpandLess, MdExpandMore, MdDeleteForever } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import BottomScrollListener from 'react-bottom-scroll-listener';

class EmployeesList extends Component {    
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    onBottom = () => {
        if (this.props.hasMore){
            this.props.loadmore({
                limit  : this.props.offset + this.props.limit, 
                search : this.props.search, 
                sort   : this.props.sort, 
                DR     : this.props.DR
            });
            this.props.changePage(this.props.offset + this.props.limit);
        }
    }

    getManager = id => {
        if (id){
            this.props.loadmore({
                limit      : this.props.limit, 
                search     : this.props.search, 
                sort       : this.props.sort, 
                manager_id : id, 
                DR         : undefined
            });
            this.props.setManager(id);
        }
    }

    getDR = id => {
        if (id){
            this.props.loadmore({
                limit      : this.props.limit,
                search     : this.props.search, 
                sort       : this.props.sort, 
                manager_id : undefined, 
                DR         : id
            });
            this.props.setDR(id);
        }
    }

    render() {
        const { employees, sortUser, load_status, delete_status, deleteEmployee, order, search_text, hasMore, deleting} = this.props;
        if (load_status === "loading" && employees.length === 0)
            return (
                <div style={{textAlign : "center"}}>
                    <br />
                    <Loader 
                        type="Ball-Triangle"
                        color="#00BFFF"
                        height="100"	
                        width="100"
                    /> 
                </div>
            )
        if (load_status === "fail")
            return (
                <div style={{textAlign : "center"}}>
                    <br />
                    <Alert bsStyle="danger">
                        <strong>Opps, Something wrong</strong> Please reload the page
                    </Alert>
                </div>
            )
        if (employees.length === 0)
            return !search_text ? (
                <div style={{textAlign : "center"}}>
                    <br />
                    <p style={{color : "#C3B3AF", fontSize : "50px"}}>No Employee Found</p>
                </div>
            ) : (
                <div style={{textAlign : "center"}}>
                    <br />
                    <p style={{color : "#C3B3AF", fontSize : "50px"}}>No Satisfied Employee</p>
                </div>
            )
        return (
            <div>
                <br />
                <BottomScrollListener onBottom={this.onBottom} />
                {delete_status === "fail" ? (<Alert bsStyle="danger">
                        <strong>Opps, Cannot delete</strong> Please try again
                    </Alert>) : null}
                <Table responsive striped condensed hover>
                    <thead>
                        <tr>
                            <th style={{textAlign : 'center'}}></th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('name')}>
                                Name {!order.name_order            ? (<MdUnfoldMore />) : order.name_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('title')}>
                                Title {!order.title_order          ? (<MdUnfoldMore />) : order.title_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('sex')}>
                                Sex {!order.sex_order              ? (<MdUnfoldMore />) : order.sex_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('start_date')}>
                                Start Date {!order.start_order     ? (<MdUnfoldMore />) : order.start_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('office_number')}>
                                Office Number {!order.office_order ? (<MdUnfoldMore />) : order.office_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('cell_number')}>
                                Cell Number {!order.cell_order     ? (<MdUnfoldMore />) : order.cell_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('sms')}>
                                SMS {!order.sms_order              ? (<MdUnfoldMore />) : order.sms_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('email')}>
                                Email {!order.email_order          ? (<MdUnfoldMore />) : order.email_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{color : "#0066cc", textAlign : 'center'}} onClick={() => sortUser('manager')}>
                                Manager {!order.manager_order      ? (<MdUnfoldMore />) : order.manager_order === 1 ? (<MdExpandLess />) : (<MdExpandMore />)}
                            </th>
                            <th style={{textAlign : 'center'}}>
                                # of DR
                            </th>
                            <th style={{textAlign : 'center'}}></th>
                            <th style={{textAlign : 'center'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(ele => (
                            <tr key={ele._id + 'tr' + this.props.offset}>
                                <td style={{verticalAlign : "middle"}} key={ele._id + 'photo'}>
                                    <Avatar src={"data:image/png;base64," + this.arrayBufferToBase64(ele.photo.data.data)} size="22" round/>
                                </td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + 'name' + ele.name}>{ele.name}</td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + ele.title}>{ele.title}</td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + ele.sex}>{ele.sex.charAt(0)}</td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + ele.start_date}>{ele.start_date}</td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + 'office' + ele.office_number}>
                                    <a href={"tel:" + ele.office_number}>{ele.office_number}</a>
                                </td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + 'cell' + ele.cell_number}>
                                    <a href={"tel:" + ele.cell_number}>{ele.cell_number}</a>
                                </td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + 'sms' + ele.sms}>{ele.sms}</td>
                                <td style={{verticalAlign : "middle"}} key={ele._id + ele.email}>
                                    <a href={'mailto:' + ele.email}>{ele.email}</a>
                                </td>
                                <td style={{verticalAlign : "middle", color : "#0066cc"}} key={ele._id + ele.manager._id} onClick={() => this.getManager(ele.manager._id)}>{!ele.manager._id ? null : ele.manager.name}</td>
                                {ele.report.length === 0 ? (<td style={{verticalAlign : "middle"}} key={ele._id + 'DR'}>{ele.report.length}</td>) : (
                                    <td style={{verticalAlign : "middle", color : "#0066cc"}} key={ele._id + 'DR'} onClick={() => this.getDR(ele._id)}>{ele.report.length}</td>
                                )}
                                <td key={ele._id + 'edit'}>
                                    <Link style={{ color: 'black' }} to={`/editEmployee/${ele._id}`}><FaEdit size={25} /></Link>
                                </td>
                                <td key={ele._id + 'delete'}>
                                    {delete_status === "deleting" && ele._id === deleting ? (
                                        <Loader 
                                            type="Triangle"
                                            color="#00BFFF"
                                            height="22"	
                                            width="22"
                                        />
                                    ) : (
                                        <MdDeleteForever onClick={() => deleteEmployee(ele._id)} size={28} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {hasMore ? null : (
                    <div style={{textAlign : "center"}}>
                        <p style={{color : "#C3B3AF", fontSize : "20px"}}>No More Employees</p>
                    </div>
                )}
                {load_status === "loading" && employees.length !== 0 ? (
                    <div style={{textAlign : "center"}}>
                        <Loader 
                            type="ThreeDots"
                            color="#00BFFF"
                            height="50"	
                            width="50"
                        /> 
                    </div>
                ) : null}
            </div>
        )
    };   
};

export default EmployeesList;