import React from 'react';
import './CategoryInput.css';

class CategoryInput extends React.Component {
    categoryInput_Ref;

    handleKeyPress = e => { 
        e.stopPropagation();

        if (e.key === 'Enter') {
            const category = this.categoryInput_Ref.current.value;

            if (category) {
                e.preventDefault();
                this.props.addCategory(category);
                e.currentTarget.value = ''; 
            }
            else {
                this.setState({error: 'Error: missing input.'})
            }
        }
    }

    constructor(props) {
        super(props);

        this.categoryInput_Ref = React.createRef();

        this.state = {
            error: ''
        }
    }

    render() {
        return (
            <div id="category-input-container">
                <span>Add Category: </span>
                <br />
                <input ref={this.categoryInput_Ref} 
                        onKeyPress={this.handleKeyPress} 
                        onFocus={() => this.props.previewCategory(true)}
                        onBlur={() => this.props.previewCategory(false)}
                        type="text" 
                        placeholder="name" 
                />
                {this.state.error && <p>{this.state.error}</p>}  
            </div>
        );
    }
}

export default CategoryInput;