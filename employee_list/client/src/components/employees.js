import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EmployeesList from './EmployeeList/employeesList';
import EmployeeSearch from './EmployeeList/employeesSearch';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getEmpolyees, deleteEmployee } from '../store.js';

class Employees extends Component{
    componentDidMount() {
        this.props.updateCreateStatus();
        this.props.updateEditStatus();
        this.props.loadEmpolyees({
            limit      : this.props.limit, 
            sort       : this.props.sort_obj, 
            search     : this.props.search_text, 
            manager_id : this.props.manager_id, 
            DR         : this.props.DR
        });
    }

    searchUser = input => {
        this.props.setSearch(input);
        this.props.loadEmpolyees({
            limit      : this.props.offset, 
            sort       : this.props.sort_obj, 
            search     : input,
            manager_id : this.props.manager_id, 
            DR         : this.props.DR
        });
    }

    sortUser = input => {
        let sort = {};
        Object.keys(this.props.order).forEach(ele => {
            if (ele === input.split('_').shift() + '_order'){
                this.props.order[ele] === 1 ? sort[input] = -1 : sort[input] = 1;
            }
        })
        this.props.loadEmpolyees({
            limit      : this.props.limit, 
            search     : this.props.search_text, 
            manager_id : this.props.manager_id, 
            DR         : this.props.DR,
            sort
        });
        this.props.sortEmployee(input, sort);
        this.props.changePage(0);
    }

    reset = () => {
        window.location.reload();
        // this.props.loadEmpolyees({
        //     limit      : this.props.offset,
        //     sort       : {}, 
        //     search     : undefined,
        //     manager_id : undefined, 
        //     DR         : undefined
        // });
        // this.props.reset();
    }

    changePage = offset => {
        this.props.changePage(offset);
    }

    render(){
        return(
            <div style={{textAlign : "center"}}>
                <div style={{float : "left"}}>
                    <EmployeeSearch searchUser={this.searchUser} search={this.props.search_text} />
                </div>
                <div style={{float : "right"}}>
                    <Button bsStyle="default" onClick={this.reset}>Reset</Button>&nbsp;
                    <Button bsStyle="success"><Link style={{ color: '#FFF' }} to="/addEmployee">Add New Employee</Link></Button>
                </div>
                <br />
                <EmployeesList 
                    employees={this.props.employees} 
                    sortUser={this.sortUser} 
                    load_status={this.props.load_status}
                    delete_status={this.props.delete_status}
                    deleteEmployee={this.props.deleteEmployee}
                    order={this.props.order}
                    search_text={this.props.search_text}
                    loadmore={this.props.loadEmpolyees}
                    limit={this.props.limit}
                    offset={this.props.offset}
                    sort={this.props.sort_obj}
                    search={this.props.search_text}
                    hasMore={this.props.hasMore}
                    changePage={this.changePage}
                    setManager={this.props.setManager}
                    setDR={this.props.setDR}
                    DR={this.props.DR}
                    deleting={this.props.deleting}
                />
            </div>
        )
    }
};

const mapStateToProps = state => {
    return {
        employees     : state.employees,
        load_status   : state.load_status,
        delete_status : state.delete_status,
        limit         : state.limit,
        offset        : state.offset,
        count         : state.count,
        search_text   : state.search_text,
        sort_obj      : state.sort_obj,
        hasMore       : state.hasMore,
        manager_id    : state.manager_id,
        DR            : state.DR,
        deleting      : state.deleting,
        order         : {
            name_order    : state.name_order,
            title_order   : state.title_order,
            sex_order     : state.sex_order,
            start_order   : state.start_order,
            office_order  : state.office_order,
            cell_order    : state.cell_order,
            sms_order     : state.sms_order,
            manager_order : state.manager_order,
            email_order   : state.email_order
        }
    }
  };
  
const mapDispatchToProps = dispatch => {
    return({
        loadEmpolyees : (range) => {
            dispatch(getEmpolyees(range));
        },
        setSearch     : (value) => {
            dispatch({
                type : 'SET_SEARCH',
                value 
            });
        },
        updateCreateStatus : () => {
            dispatch({
                type   : 'ADD_EMPLOYEE_STATUS',
                status : 'initial'
            });
        },
        updateEditStatus : () => {
            dispatch({
                type   : 'EDIT_EMPLOYEE_STATUS',
                status : 'initial'
            });
        },
        sortEmployee   : (key, sort) => {
            dispatch({
                type   : 'SORT_EMPLOYEE',
                column : key,
                sort
            });
        },
        deleteEmployee : (obj) => {
            dispatch(deleteEmployee(obj));
        },
        changePage     : (limit) => {
            dispatch({
                type   : 'CHANGE_PAGE',
                limit
            });
        },
        setManager     : (id) => {
            dispatch({
                type   : 'SET_MANAGER',
                id
            });
        },
        setDR          : (id) => {
            dispatch({
                type   : 'SET_DR',
                id
            });
        },
        reset          : () => {
            dispatch({
                type   : 'RESET'
            });
        }
    })
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Employees);