import React from 'react';
import {svgDefs} from '../visualizations/Utils';

import {d_toogleOn, d_toogleOff} from '../icons/icons';

import './CalendarToggle.css';

class CalendarToggle extends React.Component {
    idx = 0;

    toggleView = evt => {
         evt.stopPropagation();
        //console.dir(evt.target.previousSibling.getAttribute('idx'));
        this.idx = parseInt(evt.target.previousSibling.getAttribute('idx'));
    
        if (this.idx === 0) {
          evt.target.previousSibling.setAttribute('d', d_toogleOff);
          evt.target.previousSibling.setAttribute('idx', "1");
        }
        else {
          evt.target.previousSibling.setAttribute('d', d_toogleOn);
          evt.target.previousSibling.setAttribute('idx', "0");
        }

        this.props.toggleVisMode(this.idx);
      };

    render() {
        return (
            <g>
                <text x="0" y={svgDefs.categoryHeight - 20} textAnchor="start">{ this.idx ?  'Category' : 'Calendar'} view</text>
                <g id="calendar-toggle">
                    <path idx="1" transform={`translate(${100}, ${svgDefs.categoryHeight - 37.5}) scale(0.05)`} fill="#415A77" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"></path>
                    <rect id="calendar-toggle-rect" x="100" y={svgDefs.categoryHeight - 35} width='30' height='20' opacity="0" styles={{zIndex: 1}} onClick={this.toggleView}/> 
                </g>
            </g>
        );
    }
}

export default CalendarToggle;