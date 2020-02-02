import React from 'react';
import * as d3 from 'd3';
import {SVG} from '../visualizations/Utils';
import {d_leftArrow, d_rightArrow} from '../icons/icons';
import './CalendarHeader.css';

const formatTime = d3.timeFormat("%d.%m.%y");

function CalendarHeader (props) {

    return (
            <g transform={`translate(0, ${SVG.categoryHeight - 35})`}>
                <g id="calendar-left-arrow" transform={`translate(${SVG.width *.5 - 100}, 0)`}>
                    <path transform={`scale(0.03)`} fill="#415A77" d={d_leftArrow}></path>
                    <rect onClick={props.backSelectedWeeks} id="calendar-left-arrow-rect" x="0" y="0" width='30' height='20' opacity="0" styles={{zIndex: 1}}/> 
                </g>
                <text x={`${SVG.width *.5}`} y='0' textAnchor='middle' alignmentBaseline="hanging" xmlSpace="preserve">
                        {formatTime(props.weeks[props.selectedWeeks[0]].sundayDate)}  -   {formatTime(d3.timeDay.offset(props.weeks[props.selectedWeeks[1]].sundayDate, 6))}
                </text>
                <g id="calendar-right-arrow" transform={`translate(${SVG.width *.5 + 85}, 0)`}>
                    <path transform={`scale(0.03)`} fill="#415A77" d={d_rightArrow}></path>
                    <rect onClick={props.forwardSelectedWeeks} id="calendar-left-arrow-rect" x="0" y="0" width='30' height='20' opacity="0" styles={{zIndex: 1}}/> 
                </g>
            </g>   

    );
}

export default CalendarHeader;