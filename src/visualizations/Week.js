import React from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import _ from 'lodash';
import './Week.css';

const xDayAccessor = day => day.id;
const xScale = d3.scaleBand().padding(0.025);
const chromaScale = chroma.scale(['2EC4B6', 'FF9F1C', 'E71D36']);

const formatTime = d3.timeFormat("%d-%m-%y");
const formatDayTime = d3.timeFormat('%d');

class Week extends React.Component {
    svgRef;
    svg;
    vis = {};
    data = {};

    calculateVisData = () => {
        xScale.domain(_.map(this.props.daysWeek, xDayAccessor));
        xScale.range([0, this.props.svg_width]);
        chromaScale.domain([0, d3.max(_.map(this.props.expenses, exp => exp.amount))]);
        
        _.forEach(this.props.daysWeek, day => Object.assign(day, {width: xScale.bandwidth(),}));

        this.data.daysWeek = _.map(this.props.daysWeek, day => {
            const id = day.id,
            label = day.label;
            
            return {
                id,
                label,
                date: d3.timeDay.offset(this.props.week.sundayDate, day.id),
                totalExpense: _.sumBy(this.props.week.expenses, exp => {
                    return exp.date.getDay() === day.id ? exp.amount : 0
                })
            }
        });
    }

    // render each week as a group of rect days
    renderDays = () => {
        // join
        this.vis.days = this.svg.selectAll('.day')
                                .data(this.data.daysWeek);

        // exit        
        this.vis.days.exit().remove();

        // enter
        const enter = this.vis.days.enter()
                        .append('g')
                            .attr('id', d => 'd-' + formatTime(d.date))
                            .classed('day', true)
                            .attr('transform', d => `translate(${xScale(d.id)}, ${this.props.week.y})`);
        
        enter.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", xScale.bandwidth())
            .attr("height", this.props.week.height)
            .attr("opacity", 1)
            .attr("transform-origin", `${xScale.bandwidth()*.5}px ${this.props.week.height *.5}px`);

        enter.append('text')
            .attr('x', xScale.bandwidth() *.5)
            .attr('y', this.props.week.height)
            .attr('dy', '-.5em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#FDFFFC')
            .text(d => `${formatDayTime(d.date)}/${d.label}`);

        //update
        const transition_update = d3.transition().duration(300).ease(d3.easeQuadIn);
        
        this.vis.days = enter.merge(this.vis.days);

        this.vis.days
            .attr('transform', d => `translate(${xScale(d.id)}, ${this.props.week.y})`);
            
        this.vis.days.select('rect')
                        .transition(transition_update)
                        .attr("fill", d => chromaScale(d.totalExpense))
                        .attr("height", this.props.week.height);

        this.vis.days.select('text')
                    .attr('y', this.props.week.height);

    }

    // Lifecycle --------------------------
    
    constructor(props){
        super(props);

        this.svgRef = React.createRef();
    }
    

    componentDidMount() {
        this.svg = d3.select(this.svgRef.current);

        this.calculateVisData();
        this.renderDays();
    }

    componentDidUpdate() {
        this.calculateVisData();
        this.renderDays();
    }

    render() {
        return (
            <g ref={this.svgRef} id={'w-'+ formatTime(this.props.week.sundayDate)} className="week">
                <text x="0" y={this.props.week.y + this.props.week.height*.5} textAnchor="end">{formatTime(this.props.week.sundayDate)}</text>
            </g>
        );
    }
}

export default Week;