import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class EmployeeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { text : this.props.search ? this.props.search : '' };
    }

    handleChange = e => {
        this.setState({ text : e.target.value });
        this.props.searchUser(e.target.value);
    }

    render() {
        return (
            <Form inline>
                <FormGroup>
                    <ControlLabel>Search: </ControlLabel>
                    <FormControl
                        type="text" 
                        onChange={this.handleChange} 
                        value={this.state.text}
                    />
                </FormGroup>
            </Form>
        )
    }
};

export default EmployeeSearch;