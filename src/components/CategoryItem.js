import React from 'react';
import Table from 'react-bootstrap/Table';
import './CategoryItem.css'

class CategoryItem extends React.Component {
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
    handleDelete = () => this.props.deleteCategory(this.props.name);

    render() {
        return (
            <li>
                <Table borderless size='sm' id="category-table">
                        <tbody>
                            <tr>
                                <td><span className="delete-icon" onClick={this.handleDelete} 
                                                                  onMouseOver={this.handleMouseOver} 
                                                                  onMouseOut={this.handleMouseOut}>
                                        <i className={`${this.state.icon} fa-times-circle`}></i>
                                     </span>
                                </td>
                                <td>{this.props.name}</td>
                            </tr>
                        </tbody>
                </Table>
            </li>    
        );
    }
}

export default CategoryItem;