import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import chroma from 'chroma-js';
import {getTranslateXValue, getTranslateYValue} from '../Utils';
import {catPreview_name, delete_id} from '../data/categories';
import {d_delete} from '../icons/icons';
import './Categories.css';

const simulation = d3.forceSimulation().alphaDecay(0.02).velocityDecay(0.15).stop();
const chromaScale = chroma.scale(['2EC4B6', 'FF9F1C', 'E71D36']);
const drag = d3.drag();
const radius = 35;

class Categories extends React.Component {
    svgRef;
    svg;
    vis = {};
    data = {};

    onDragStart = () => {
        simulation.alphaTarget(0.1).restart();
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
        
    };

    onDrag = () => {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
    }

    onDragEnd = () => {
        if (!d3.event.active) simulation.alphaTarget(0);
        this.props.updateCategoryLink();
    }

    forceTick = () => {
        this.vis.circleGroups.attr("transform", d => `translate(${d.x},${d.y})`);
        this.vis.deleteGroup.attr("transform", d => `translate(${d.x},${d.y})`);

        if(this.props.visMode === this.props.VisModes.Category){ this.props.updateCategoryLink(); }
    }

    forceEnd = () => {

        if(this.props.visMode === this.props.VisModes.Category){
            this.data.categories.forEach(c => Object.assign(c, {
                fx: c.x,
                fy: c.y
            }));

            this.props.updateCategoryLink();
        } 
    }

    calculateVisData = () => {
        chromaScale.domain([0, d3.max(_.map(this.props.expenses, exp => exp.amount))]);

        const {x, y} = this.props.categoriesFocus;

        if (x) {
            simulation.force('radial', d3.forceRadial(30, x, y));
        }

        this.data.categories = this.props.categories;

        this.data.categories.forEach(category => {
            let totalExpense = 0;
            this.props.links.forEach((linkCategory, exp_id) => {
                let exp_amount = _.find(this.props.expenses, exp => exp.id === exp_id).amount; 
                let add = 0;
                if (linkCategory.name === category.name) add = exp_amount;
                totalExpense  += add;
            });
            

            Object.assign(category, {
                x: category.x || -180,
                y: category.y || 500,
                fx: null,
                fy: null,
                radius,
                totalExpense
            });
        });

        if (this.props.categoryPreview !== null) {
            this.data.categories.push(Object.assign(this.props.categoryPreview, {
                fx: -180,
                fy: 500,
                radius: radius
            }))
        }
    }

    renderCircles = () => {
        // join
        this.vis.circleGroups = this.svg.selectAll('g')
                                    .data(_.filter(this.data.categories, c => c.name !== delete_id), d => d.name);

        // remove
        this.vis.circleGroups.exit().remove();

        // enter
        const enter_transition = d3.transition().duration(800).ease(d3.easeBounceOut);

        let circleGroups_enter = this.vis.circleGroups
                                        .enter()
                                        .append('g')
                                            .classed('category', true)
                                            .attr("id", d => d.name)
                                            .call(drag)
                                            .on("mouseover", function(d) {
                                                if (d.name === catPreview_name) return;

                                                const transl = d3.select(this).attr('transform');
                                                const x = getTranslateXValue(transl);
                                                const y = getTranslateYValue(transl);

                                                d3.select("#tooltip")		
                                                            .style("opacity", .9)	
                                                            .style("left", x + "px")		
                                                            .style("top", y + "px")
                                                            .html(function() {
                                                                return `<b>${d.name}</b> total: <br/> $ ${d.totalExpense.toFixed(2)}`;
                                                });	
                                            })					
                                            .on("mouseout", function(d) {		
                                                d3.select("#tooltip")	
                                                    .style("opacity", 0);	
                                            });
        
        circleGroups_enter.append('circle')
                                .transition(enter_transition)
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("r", radius)
                                .attr("stroke", "#eee")
                                .attr("opacity", 1);
        
        circleGroups_enter.append('text')
                                .transition(enter_transition)
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("fill", "#FDFFFC")
                                .attr("text-anchor", "middle");

        // update
        this.vis.circleGroups = circleGroups_enter.merge(this.vis.circleGroups);     
        
        this.vis.circleGroups.selectAll('circle')
                                .transition(enter_transition)
                                .attr('fill', d => chromaScale(d.totalExpense));

        this.vis.circleGroups.selectAll('text')
                             .text(d => (d.name === catPreview_name) ? '' : d.name);
    }

    renderDeleteCircle = () => {
        this.vis.deleteGroup = this.svg.selectAll('#delete')
                                    .data(_.filter(this.data.categories, c => c.name === delete_id), d => d.name)
                                    .enter()
                                    .append('g')
                                        .attr('id', 'delete-category')
                                        .call(drag);
        
        this.vis.deleteGroup.append('circle')
                                        .attr("cx", 0)
                                        .attr("cy", 0)
                                        .attr("r", radius*0.8)
                                        .attr('fill', '#fff');
                                        

        this.vis.deleteGroup.append('path')
                                .attr('fill', '#dedede')
                                .attr('transform', 'translate(-27, -27) scale(0.105)')
                                .attr('d', d_delete);        
    }

    // React lifecycle ---------------------------------

    constructor(props) {
        super(props);

        drag.on("start", this.onDragStart);
        drag.on("drag", this.onDrag);
        drag.on("end", this.onDragEnd);

        this.svgRef = React.createRef();
    }

    componentDidMount() {
        this.svg = d3.select(this.svgRef.current);

        this.calculateVisData();
        this.renderCircles();
        this.renderDeleteCircle();

        simulation.nodes(this.data.categories)  
            .on('tick', this.forceTick)
            .on('end', this.forceEnd)
            .force("collision", d3.forceCollide(radius*1.1))
            .force('radial', d3.forceRadial(30, this.props.svg_width *.5, this.props.svg_categoryHeight *.5))
            .alpha(0.3)
            .restart();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.links !== this.props.links ||
           prevProps.categoryPreview !== this.props.categoryPreview ||
           prevProps.categoriesFocus !== this.props.categoriesFocus ||
           prevProps.categories !== this.props.categories ||
           this.props.visMode !== this.props.VisModes.Category){

            this.calculateVisData();
            this.renderCircles();
            this.renderDeleteCircle();

            simulation.nodes(this.data.categories)
                        .alpha(0.3)
                        .restart();
            
        }
    }

    render() {
        return (
            <g ref={this.svgRef} className="categories"></g>
        );
    }
}

export default Categories;