import React from 'react';
import Table from 'react-bootstrap/Table';
import * as d3 from 'd3';
import './ExpenseItem.css'

const formatTime = d3.timeFormat("%d.%m.%y");

class ExpenseItem extends React.Component {
    state ={};
    iconDefault = 'far';
    iconHover = 'fas';

    constructor(props) {
        super(props);

        this.state = {
            icon: this.iconDefault
        }
    }

    handleMouseOut = () => this.setState(prevState => ({icon: this.iconDefault}));
    handleMouseOver = () => this.setState(prevState => ({icon: this.iconHover}));
    handleClick = () => this.props.deleteExpense(this.props.expense);
    
    formatDescription = desc => desc.substring(0, 9) + (desc.length > 10 ? '.' : '');
    
    render() {
        return (
            <li>
                <Table borderless size='sm' id="expense-table">
                    <tbody>
                        <tr>
                            <td onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}><span onClick={this.handleClick}><i className={`${this.state.icon} fa-times-circle`}></i></span></td>
                            <td>{this.formatDescription(this.props.expense.description)}</td>
                            <td>${this.props.expense.amount.toFixed(2)}</td>
                            <td>{formatTime(this.props.expense.date)}</td>
                        </tr>
                    </tbody>
                </Table>
            </li>
        );
    }
}

export default ExpenseItem;