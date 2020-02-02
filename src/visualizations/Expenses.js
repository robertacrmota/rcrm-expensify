import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import {getTranslateXValue, getTranslateYValue} from '../Utils';
import {delete_id} from '../data/categories';
import {expPreview_id} from '../data/expenses';
import './Expenses.css';

const simulation = d3.forceSimulation().alphaDecay(0.001).velocityDecay(0.3).stop();
const radiusScale = d3.scaleLinear().range([7, 15]);
const formatTime = d3.timeFormat("%d-%m-%y");
const drag = d3.drag();

class Expenses extends React.Component {
    svgRef;
    svg;
    vis ={};
    data = {};

    onDragStart = () => {
        d3.event.sourceEvent.stopPropagation();
        simulation.alphaTarget(0.1).restart();
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    onDrag = () => {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;

        // check if dragged into a category
        if (this.props.visMode === this.props.VisModes.Category) {
            _.forEach(this.props.categories, c => {
                
                if ( Math.abs(d3.event.x - c.x) < c.radius && 
                    Math.abs(d3.event.y - c.y) < c.radius ) {

                    this.draggedLink = {
                        expense: d3.event.subject,
                        category: c
                    }
                }
            });
        }
    }

    onDragEnd = () => {
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;

        // check new link creation
        if (this.draggedLink) {
            if (this.draggedLink.category.name === delete_id) {
                this.props.deleteCategoryLink(this.draggedLink);
            }
            else {
                this.props.addCategoryLink(this.draggedLink);
            }
            this.draggedLink = null;
        }
        
        // check update on expense's date
        else if (this.props.visMode === this.props.VisModes.Calendar){
            const deltaY = this.props.svg_categoryHeight;
            let draggedDay = null;
            d3.selectAll('.day').each(function(d) {
                const rect = d3.select(this).select('rect');
                const w = +rect.attr('width');
                const h = +rect.attr('height');

                const transl = d3.select(this).attr('transform');
                const x = getTranslateXValue(transl);
                const y = getTranslateYValue(transl) + deltaY;

                if ((d3.event.x > x) && (d3.event.x < x+w) && (d3.event.y > y) && (d3.event.y < y+h)) {  
                    const newDate = d3.select(this).datum().date;
                    const oldDate = d3.event.subject.date;

                    if (newDate.getTime() !== oldDate.getTime()){
                        draggedDay = {
                            expense: d3.event.subject,
                            oldDate,
                            oldSundayDate: d3.timeWeek.floor(oldDate),
                            newDate,
                            newSundayDate: d3.timeWeek.floor(newDate)
                        };
                    }
                }
            });

            if(draggedDay) {
                this.props.updateExpenseDate(draggedDay);
            }
        }
    }

    calculateVisData = () => {
        radiusScale.domain(d3.extent(this.props.expenses, exp => exp.amount));

        this.data.expenses = _.chain(this.props.expenses)
                                .filter(exp => {
                                   
                                    const [min, max] = this.props.selectedWeeks;
                                    const minTime = this.props.weeks[min].sundayDate.getTime();
                                    const maxTime = d3.timeWeek.offset(this.props.weeks[max].sundayDate).getTime();

                                    return exp.date.getTime() >= minTime && exp.date.getTime() < maxTime;
                                }).value();

        _.forEach(this.data.expenses, exp => {
                                    exp.radius = radiusScale(exp.amount);

                                    const exp_category = this.props.links.get(exp.id);
                                    
                                    if(this.props.visMode === this.props.VisModes.Category && exp_category) {
                                        const angle = exp.angle || Math.floor((Math.random()*360)+1);
                                        exp.angle = angle;
                                        exp.focusX = exp_category.x+exp_category.radius*Math.cos(angle);
                                        exp.focusY = exp_category.y+exp_category.radius*Math.sin(angle);
                                    }
                                    else {
                                            const id = '#d-' + formatTime(exp.date);
                                            const gDate = d3.select(id);
                                            
                                            const x = getTranslateXValue(gDate.attr('transform'));
                                            const y = getTranslateYValue(gDate.attr('transform'));

                                            let deltaY = this.props.svg_height - this.props.svg_categoryHeight - this.props.svg_margin.bottom;
                                            deltaY = deltaY / this.props.selectedWeeks_range;

                                            exp.focusX = exp.dayX = x + this.props.daysWeek[exp.date.getDay()].width *.5;
                                            exp.focusY = exp.dayY =  y + this.props.svg_categoryHeight + deltaY *.5;
                                    }
                                });
        
                                if (this.props.expensePreview !== null) {
                                    this.data.expenses.push(Object.assign(this.props.expensePreview, {
                                        x: -180,
                                        y: 180,
                                        radius: 10
                                    }));
                                }
    }

    

    renderExpenseCircles = () => {
        // join
        this.vis.expenseCircles = this.svg.selectAll('.expense')
                                            .data(this.data.expenses.filter(exp => exp.id !== expPreview_id), exp => exp.id);

        // remove
        this.vis.expenseCircles.exit().remove();
        
        // enter + update
        this.vis.expenseCircles = this.vis.expenseCircles.enter()
                            .append('circle')
                                .classed('expense', true)
                                .merge(this.vis.expenseCircles)
                                .attr('r', d => radiusScale(d.amount))
                                .attr('fill', '#FDFFFC')
                                .attr('stroke', d=> {
                                    if (this.props.visMode === this.props.VisModes.Category){
                                        const exp_category = this.props.links.get(d.id);
                                        if (exp_category) return '#415a77';
                                    }
                                    return '#FDFFFC';                                
                                })
                                .call(drag)
                                .on("mouseover", function(d) {		
                                    d3.select("#tooltip")		
                                        .style("opacity", .9)	
                                        .style("left", (d3.select(this).attr("cx") + 150) + "px")		
                                        .style("top", (d3.select(this).attr("cy") - 60) + "px")
                                        .html(function() {
                                                const dot = d.description.length > 10 ? '.' : '';
                                                return `${d.description.substring(0, 10)}  ${dot} <br/> $ ${d.amount.toFixed(2)}`;
                                        });	
                                    })					
                                .on("mouseout", function(d) {		
                                    d3.select("#tooltip")	
                                        .style("opacity", 0);	
                                });

        
    }

    renderPreviewCircle = () => {
        // join
        this.vis.expensePrevCircle = this.svg.selectAll(`#${expPreview_id}`)
                                            .data(this.data.expenses.filter(d => d.id === expPreview_id), exp => exp.id);

        // remove
        this.vis.expensePrevCircle.exit().remove();
        
        // enter + update
        const enter_transition = d3.transition().duration(800).ease(d3.easeBounceOut);

        this.vis.expensePrevCircle = this.vis.expensePrevCircle.enter()
                            .append('circle')
                                .attr("id", expPreview_id)
                                .classed('expense', true)
                                .merge(this.vis.expensePrevCircle)
                                .attr('cx', d => d.x)
                                .attr('cy', d => d.y)
                                .attr('fill', '#aaa')
                                .transition(enter_transition)
                                .attr('r', d => d.radius);
    }

    forceTick = () => {
        this.vis.expenseCircles.attr("cx", d => d.x).attr("cy", d => d.y);
    }

    // React lifecycle ---------------

    constructor(props) {
        super(props);

        this.vis = this;
        this.svgRef = React.createRef();
    }

    componentDidMount() {
        this.svg = d3.select(this.svgRef.current);

        drag.on('start', this.onDragStart);
        drag.on('drag', this.onDrag);
        drag.on('end', this.onDragEnd);

        this.calculateVisData();
        this.renderExpenseCircles();
        this.renderPreviewCircle();

        simulation.nodes(this.data.expenses)  
            .on('tick', this.forceTick)
            .force("focusX", d3.forceX(d => d.focusX))
            .force("focusY", d3.forceY(d => d.focusY))
            .force("collision", d3.forceCollide(d => d.radius*1.1))
            .alpha(0.9)
            .restart();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.categoryPreview !== this.props.categoryPreview) return;

        this.calculateVisData();
        this.renderExpenseCircles();
        this.renderPreviewCircle();

        simulation.nodes(this.data.expenses)
            .alpha(0.9)
            .restart();
    }

    render() {
        return (
            <g ref={this.svgRef} className="expenses" />
        );
    }
}

export default Expenses;