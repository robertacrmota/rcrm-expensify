import React from 'react';
import {Button} from 'react-bootstrap'
import * as d3 from 'd3';

import './ExpenseInput.css';

class ExpenseInput extends React.Component {
    descriptionRef;
    amountRef;
    dateRef;

    constructor(props) {
        super(props);

        this.descriptionRef = React.createRef();
        this.amountRef = React.createRef();
        this.dateRef = React.createRef();

        this.state = {
            error: ''
        }
    }

    handleSubmit = e => {
        e.stopPropagation();
        this.setState({error: ''});

        const description = this.descriptionRef.current.value;
        const amount = parseFloat(this.amountRef.current.value);
        const parseTime = d3.timeParse("%d-%m-%Y");
        const date = parseTime(this.dateRef.current.value);

        e.preventDefault();

        if(description && date && !isNaN(amount)) {
            this.descriptionRef.current.value = '';
            this.amountRef.current.value = '';
            this.dateRef.current.value = '';
            this.descriptionRef.current.focus();

            this.props.addExpense(description, amount, date);
        }
        else {
            this.setState({error: 'Error: could not parse input values. Are you missing any input?'});
        }

        this.props.previewExpense(false);
    }
    
    previewExpense = () => {
        this.props.previewExpense(true);
    }

    render() {

        const buttonStyle = {
            borderRadius: '15px',
            color: '#415A77'
        };

        return (
            <div id="expense-input-container">
                <span>Add Expense: </span>
                <input ref={this.descriptionRef} type="text" placeholder="description" onKeyPress={this.handleKeyPress} onFocus={this.previewExpense}/>
                <input ref={this.amountRef} type="text" placeholder="$ expense" onKeyPress={this.handleKeyPress} />
                <input ref={this.dateRef} type="text" placeholder="dd-mm-yyyy" onKeyPress={this.handleKeyPress} />
                <Button onClick={this.handleSubmit} style={buttonStyle} variant="link" size="sm"><i className="fa fa-plus-circle"></i></Button>   
                {this.state.error && <p>{this.state.error}</p>}      
            </div>
        );
    }
}

export default ExpenseInput;