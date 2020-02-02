import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import Week from './Week';


const yWeekAccessor = week => week.sundayDate;
const yScale = d3.scaleTime();

class Calendar extends React.Component {
    svgRef;
    svg;
    vis = {};
    data = {};

    calculateVisData = () => {
        this.data.weeks = _.filter(this.props.weeks, (week, i) => i >= this.props.selectedWeeks[0] && i <= this.props.selectedWeeks[1]);

        yScale.domain(d3.extent(this.data.weeks, yWeekAccessor));

        this.data.weeks = _.map(this.data.weeks, week => Object.assign(week, {
                                y: yScale(week.sundayDate),
                                height: yScale.range()[1] / this.props.selectedWeeks_range}));
    }

    renderWeeks = () => {        
        this.calculateVisData();

        if (this.data.weeks) {
            return this.data.weeks.map(week => <Week key={week.sundayDate} {...this.props} week={week} />)
        }
    }

    // Lifecycle --------------------

    constructor(props){
        super(props);

        this.svgRef = React.createRef();
    }
    
    componentWillMount() {
        yScale.range([0, this.props.svg_height - this.props.svg_categoryHeight - this.props.svg_margin.bottom]);
    }

    componentDidMount() {
        this.svg = d3.select(this.svgRef.current);
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.selectedWeeks === nextProps.selectedWeeks) return false;
        return true;
    }

    render() {
        return (
            <g ref={this.svgRef}  transform={`translate(0, ${this.props.svg_categoryHeight})`}> 
                {this.renderWeeks()}
            </g>
        );
    }

}

export default Calendar;