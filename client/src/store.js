import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const InitState = {
    employees      : [],
    managers       : [],
    name_order     : 0,
    title_order    : 0,
    sex_order      : 0,
    start_order    : 0,
    office_order   : 0,
    cell_order     : 0,
    sms_order      : 0,
    manager_order  : 0,
    email_order    : 0,
    offset         : 15,
    limit          : 15,
    count          : 0,
    hasMore        : false,
    search_text    : undefined,
    manager_id     : undefined,
    DR             : undefined,
    deleting       : undefined,
    sort_obj       : {},
    load_status    : 'initial',
    add_status     : 'initial',
    delete_status  : 'initial',
    edit_status    : 'initial',
    manager_status : 'initial'
}

export function getEmpolyees(range) {
    return (dispatch) => {
        dispatch({
            type   : 'LOAD_EMPOLYEE_STATUS',
            status : 'loading'
        });
        axios.get('/getall', { params : {
            limit      : range.limit,
            search     : range.search,
            sort       : range.sort,
            manager_id : range.manager_id,
            DR         : range.DR
        }})
            .then((response) => {
                dispatch({
                    type      : 'EMPOLYEE_COMPLETE',
                    empolyees : response.data.empolyees,
                    count     : response.data.count,
                    limit     : range.limit
                });
            })
            .catch(err => {
                dispatch({
                    type   : 'LOAD_EMPOLYEE_STATUS',
                    status : 'fail'
                })
            });
    }
}

export function getManager() {
    return (dispatch) => {
        dispatch({
            type   : 'LOAD_MANAGER_STATUS',
            status : 'loading'
        });
        axios.get('/getmanager')
            .then((response) => {
                dispatch({
                    type    : 'MANAGER_COMPLETE',
                    manager : response.data
                });
            })
            .catch(err => {
                dispatch({
                    type   : 'LOAD_MANAGER_STATUS',
                    status : 'fail'
                })
            });
    }
}

export function addEmployee(employee) {
    return (dispatch) => {
        dispatch({
            type   : 'ADD_EMPLOYEE_STATUS',
            status : 'uploading'
        });
        axios.post('/addemployee', employee)
            .then((response) => {
                dispatch({
                    type   : 'ADD_EMPLOYEE_COMPLETE',
                    status : 'success',
                    id     : response.data
                })
            })
            .catch(err => {
                dispatch({
                    type   : 'ADD_EMPLOYEE_STATUS',
                    status : 'fail'
                })
            });
    }
}

export function deleteEmployee(id) {
    return (dispatch, getState) => {
        dispatch({
            type     : 'DELETE_EMPLOYEE_STATUS',
            status   : 'deleting',
            deleting : id
        });
        axios.delete('/deleteemployee', { params : {
            id,
            limit      : getState().limit, 
            search     : getState().search_text,
            sort       : getState().sort_obj,
            DR         : getState().DR ? getState().DR.toString() : getState().DR
        }})
            .then((response) => {
                dispatch({
                    type       : 'DELETE_EMPLOYEE_COMPLETE',
                    status     : 'success',
                    employees  : response.data,
                    count      : getState().count - 1,
                })
            })
            .catch(err => {
                dispatch({
                    type     : 'DELETE_EMPLOYEE_STATUS',
                    status   : 'fail',
                    deleting : undefined
                })
            });
    }
}

export function editEmployees(employee) {
    return (dispatch) => {
        dispatch({
            type   : 'EDIT_EMPLOYEE_STATUS',
            status : 'uploading'
        });
        axios.post('/editemployee', employee)
            .then((response) => {
                dispatch({
                    type   : 'EDIT_EMPLOYEE_STATUS',
                    status : 'success'
                })
            })
            .catch(err => {
                dispatch({
                    type      : 'EDIT_EMPLOYEE_STATUS',
                    status    : 'fail',
                    employees : []
                })
            });
    }
}

const myReducer = (state = InitState, action) => {
    switch (action.type) {
        case 'LOAD_EMPOLYEE_STATUS':
            return {
                ...state, 
                load_status: action.status
            };
        case 'EMPOLYEE_COMPLETE':
            return {
                ...state, 
                load_status : 'success', 
                employees   : action.empolyees, 
                count       : action.count, 
                hasMore     : action.limit < action.count
            };
        case 'LOAD_MANAGER_STATUS':
            return {
                ...state, 
                manager_status : action.status
            };
        case 'MANAGER_COMPLETE':
            return {
                ...state, 
                load_status : 'success', 
                managers    : action.manager
            };
        case 'DELETE_EMPLOYEE_COMPLETE':
            return {
                ...state, 
                delete_status : 'success', 
                employees     : action.employees, 
                count         : action.count,
                hasMore       : state.limit < action.count
            };
        case 'SET_SEARCH':
            return {
                ...state, 
                search_text : action.value
            }
        case 'ADD_EMPLOYEE_STATUS':
            return {
                ...state, 
                add_status : action.status,
                employees  : []
            };
        case 'ADD_EMPLOYEE_COMPLETE':
            return {
                ...state, 
                add_status : action.status
            };
        case 'EDIT_EMPLOYEE_STATUS':
            return {
                ...state, 
                edit_status : action.status,
                employees   : action.employees ? action.employees : state.employees
            };
        case 'DELETE_EMPLOYEE_STATUS':
            return {
                ...state, 
                delete_status : action.status,
                deleting      : action.deleting
            };
        case 'SORT_EMPLOYEE':
            return {
                ...state,
                employees     : [], 
                name_order    : action.column !== 'name'          ? 0 : state.name_order === 1      ? -1 : 1,
                title_order   : action.column !== 'title'         ? 0 : state.title_order  === 1    ? -1 : 1,
                sex_order     : action.column !== 'sex'           ? 0 : state.sex_order   === 1     ? -1 : 1,
                start_order   : action.column !== 'start_date'    ? 0 : state.start_order   === 1   ? -1 : 1,
                office_order  : action.column !== 'office_number' ? 0 : state.office_order   === 1  ? -1 : 1,
                cell_order    : action.column !== 'cell_number'   ? 0 : state.cell_order   === 1    ? -1 : 1,
                sms_order     : action.column !== 'sms'           ? 0 : state.sms_order   === 1     ? -1 : 1,
                email_order   : action.column !== 'email'         ? 0 : state.email_order   === 1   ? -1 : 1,
                manager_order : action.column !== 'manager'       ? 0 : state.manager_order   === 1 ? -1 : 1,
                sort_obj      : action.sort
            }
        case 'CHANGE_PAGE':
            return {
                ...state, 
                limit : action.limit
            }
        case 'SET_MANAGER':
            return {
                ...state,
                manager_id : action.id, 
                DR         : undefined,
                employees  : []
            }
        case 'SET_DR':
            return {
                ...state, 
                DR         : action.id, 
                manager_id : undefined,
                employees  : []
            }
        case 'RESET':
            return {
                ...state,
                search_text   : undefined,
                manager_id    : undefined,
                DR            : undefined,
                sort_obj      : {},
                limit         : state.offset,
                name_order    : 0,
                title_order   : 0,
                sex_order     : 0,
                start_order   : 0,
                office_order  : 0,
                cell_order    : 0,
                sms_order     : 0,
                manager_order : 0,
                email_order   : 0
            }
        default:
          return state;
      }
  };

  const store = createStore(myReducer, InitState, applyMiddleware(thunk));
  export default store;