import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HashMap from 'hashmap';
import _ from 'lodash';
import * as d3 from 'd3';

import './App.css';

import CategoryInput from './components/CategoryInput';
import CategoryItem from './components/CategoryItem';
import ExpenseInput from './components/ExpenseInput';
import ExpenseItem from './components/ExpenseItem';
import CalendarToggle from './components/CalendarToggle';
import CalendarHeader from './components/CalendarHeader';

import Categories from './visualizations/Categories';
import Expenses from './visualizations/Expenses';
import Calendar from './visualizations/Calendar';

import {SVG, daysWeek} from './visualizations/Utils';

import {categories_sample, catPreview_name, delete_id} from './data/categories';
import {expPreview_id} from "./data/expenses";
import {exps} from './data/expenses';
import {links_sample} from './data/links';

const VisModes = {Category: 1, Calendar: 0};
const selectedWeeks_range = 5;



class App extends React.Component {
  svgColRef;

  // Expense ---------------------------------

  addExpense = (description, amount, date) => {
        const exp = {description, amount, date};
        const exp_sundayDate = d3.timeWeek.floor(date);

        // update state.weeks with a new week range, if required
        let weeks = null;
        if (exp_sundayDate.getTime() < _.first(this.state.weeks).sundayDate.getTime()) {
            weeks = d3.timeWeek.range(exp_sundayDate, _.first(this.state.weeks).sundayDate);
        }
        else if (exp_sundayDate.getTime() > _.last(this.state.weeks).sundayDate.getTime()) {
            weeks = d3.timeWeek.range(d3.timeWeek.offset(_.last(this.state.weeks).sundayDate, 1), 
                                      d3.timeWeek.offset(exp_sundayDate,1));
        }

        // add new expense to state.weeks
        if(weeks) {
          weeks = _.map(weeks, week => {
            const sundayDate = d3.timeWeek.floor(week);
            const expenses = (exp_sundayDate.getTime() === sundayDate.getTime()) ? [exp] : [] ;
            return { sundayDate, expenses }; 
          });

          weeks = _.chain(weeks)
                    .concat(this.state.weeks)
                    .sortBy(week => week.sundayDate)
                    .value();
        }
        else {
           _.forEach(this.state.weeks, week => {
            if (week.sundayDate.getTime() === exp_sundayDate.getTime()) {
                week.expenses.push(exp);
            }
          });

          weeks = this.state.weeks;
      }

        const length = weeks.length;
        let minWeek = _.findIndex(weeks, week => week.sundayDate.getTime() === exp_sundayDate.getTime());
        minWeek = Math.min(minWeek, length - selectedWeeks_range);
        const maxWeek = Math.min(minWeek + selectedWeeks_range - 1, length - 1);
        const id = this.state.expenses.length > 0 ? this.state.expenses[this.state.expenses.length - 1].id + 1 : 0;
        exp.id = id;
        let exps = _.concat(this.state.expenses, exp);

        this.setState(prevState => {
            return {
              selectedWeeks: [minWeek, maxWeek],
              expenses: exps,
              weeks: weeks ? weeks : this.state.weeks
            }
        });   
  };

  deleteExpense = (expense) => {
    // remove expense from state.week's expenses
    const exp_sundayDate = d3.timeWeek.floor(expense.date);

    _.forEach(this.state.weeks, week => {
      if (week.sundayDate.getTime() === exp_sundayDate.getTime()) {
        week.expenses = _.filter(week.expenses, exp => exp.id !== expense.id);
      }
    })

    // delete links with this expense
    let links = this.state.links.clone();
    links.remove(expense.id);

    const expenses = _.filter(this.state.expenses, exp => exp.id !== expense.id);
    this.setState(() => ({expenses, links, selectedWeeks: _.cloneDeep(this.state.selectedWeeks)}));
  }

  updateExpenseDate = (draggedDay) => {
    const {expense, oldDate, oldSundayDate, newDate, newSundayDate} = draggedDay;

    // update expense's date
    expense.date = newDate;

    if (oldSundayDate.getTime() !== newSundayDate.getTime()) {;
      // remove exp from current week's expenses, then add exp to new week's expenses
      _.forEach(this.state.weeks, week => {
        if (week.sundayDate.getTime() === newSundayDate.getTime()) {
          week.expenses.push(expense);
        }
        else if (week.sundayDate.getTime() === oldSundayDate.getTime()) {
          _.remove(week.expenses, exp => exp === expense);
        }
      });
    } 

    this.setState(prevState => ({selectedWeeks: _.cloneDeep(this.state.selectedWeeks)}));
    this.forceUpdate();
  };
  
  previewExpense = (preview) => {
    if (!preview) {
      const expense = _.filter(this.state.expenses, exp => exp.id !== expPreview_id);
      this.setState(prevState => ({expensePreview: null}));
    }
    else if (preview && !this.state.expensePreview) {
      this.setState(prevState => ({expensePreview: {id: expPreview_id}}));
    }
  }

  // Category ---------------------------------

  addCategory = (category) => { 
    let categories = _.filter(this.state.categories, c => c.name !== catPreview_name)
    categories = [...categories, {name: category}];
    this.setState(prevState => ({categories: categories, categoryPreview: null}));
  }

  deleteCategory = (name) => {
    // delete links with this category
    let ids = [];
    this.state.links.forEach(function(category, exp_id) {
        if (category.name === name) ids.push(exp_id);
    });
    _.forEach(ids, id => this.state.links.remove(id));
    
    // delete category
    const categories = _.filter(this.state.categories, category => category.name !== name);
    this.setState({categories});
  }

  previewCategory = (preview) => {
    if (!preview) {
      const categories = _.filter(this.state.categories, c => c.name !== catPreview_name)
      this.setState(prevState => ({categories, categoryPreview: null}));
    }
    else if (preview && !this.state.categoryPreview) {
      this.setState(prevState => ({categoryPreview: {name: catPreview_name}}));
    }
  }

  surroundCategories = (x, y) => {
      this.setState(prevState => ({categoriesFocus: {x, y}, expenses: _.flatten(this.state.expenses)}));
  }

  updateExpenses = () => {
    const expenses = _.cloneDeep(this.state.expenses);
    this.setState(prevState => ({expenses}));
  }

  // Category-expense link ---------------------------------

  addCategoryLink = (link) => {
      let links = new HashMap();
      this.state.links.forEach((value, key) => links.set(key, value));
      links.set(link.expense.id, link.category);
      this.setState({links});
      this.forceUpdate();
  }

  deleteCategoryLink = (link) => {
    let links = this.state.links.remove(link.expense.id);
    links = links.clone();
    this.setState({links});
  }

  updateCategoryLink = () => {
      this.forceUpdate();
  }

  // Other -------------------------------------------

  toggleVisModes = (idx) => {
    const visMode = (idx === VisModes.Calendar) ? VisModes.Calendar : VisModes.Category;
    this.setState(prevState => ({visMode}));
  }

  backSelectedWeeks = evt => {
    evt.stopPropagation();
    let [minWeek, maxWeek] = this.state.selectedWeeks;

    minWeek = Math.max(minWeek - selectedWeeks_range, 0);
    maxWeek = Math.max(maxWeek - selectedWeeks_range, selectedWeeks_range - 1);
    this.setState(prevState => ({selectedWeeks: [minWeek, maxWeek]}));
  }

  forwardSelectedWeeks = evt => {
    evt.stopPropagation();
    const length = this.state.weeks.length;
    let [minWeek, maxWeek] = this.state.selectedWeeks;

    minWeek = Math.min(minWeek + selectedWeeks_range, length - selectedWeeks_range);
    maxWeek = Math.min(maxWeek + selectedWeeks_range, length - 1);
    this.setState(prevState => ({selectedWeeks: [minWeek, maxWeek]}));
  }

  // React Lifecycle ---------------------------------

  constructor(props) {
    super(props);

    const weekExtent = d3.extent(exps, exp => d3.timeWeek.floor(exp.date));
    let weeks = d3.timeWeek.range(weekExtent[0], d3.timeWeek.offset(weekExtent[1],1));
    weeks = _.map(weeks, week => {
        const sundayDate = d3.timeWeek.floor(week);
        const expenses = _.filter(exps, exp => d3.timeWeek.floor(exp.date).getTime() === sundayDate.getTime());
        return { sundayDate, expenses }
    });   

    let links = new HashMap();
    _.forEach(links_sample, link => {
        const category = _.find(categories_sample, c => c.name === link.category_name);
        if(category)
        links.set(link.exp_id, category);
    });

    this.state = {
      categories: categories_sample,
      categoriesFocus: {x: null, y: null},
      categoryPreview: null,
      expenses: exps, 
      expensePreview: null,
      weeks: weeks,
      selectedWeeks: [0, selectedWeeks_range - 1],
      links: links,
      visMode: VisModes.Calendar
    }

    this.svgColRef = React.createRef();
  }

  render() {
      const props = {
        VisModes,
        svg_width: SVG.width, 
        svg_height: SVG.height, 
        svg_margin: SVG.margin,
        svg_categoryHeight: SVG.categoryHeight,
        daysWeek,
        selectedWeeks_range,
        backSelectedWeeks: this.backSelectedWeeks,
        forwardSelectedWeeks: this.forwardSelectedWeeks,
        deleteExpense: this.deleteExpense,
        updateExpenses: this.updateExpenses,
        updateExpenseDate: this.updateExpenseDate,
        surroundCategories: this.surroundCategories,
        addCategoryLink: this.addCategoryLink,
        deleteCategoryLink: this.deleteCategoryLink,
        updateCategoryLink: this.updateCategoryLink
      }
      
      
      return (  
        <Container fluid>
          <Row>
            <Col id='col-header' sm={3}>
              <p><span>Total Expenses:</span> $ {_.sumBy(this.state.expenses, exp => exp.amount).toFixed(2)} </p>
              <ExpenseInput addExpense={this.addExpense} previewExpense={this.previewExpense}/>
              <div id="expense-list">
                <ul>
                {
                  _.chain(this.state.expenses)
                  .filter(exp => {
                        const [min, max] = this.state.selectedWeeks;
                        const minTime = this.state.weeks[min].sundayDate.getTime();
                        const maxTime = this.state.weeks[max].sundayDate.getTime();

                        return exp.date.getTime() >= minTime && exp.date.getTime() <= maxTime;
                  })
                  .sortBy(exp => exp.date)
                  .map(exp => <ExpenseItem key={exp.id} expense={exp} deleteExpense={this.deleteExpense}/>)
                  .value()
                }
                </ul>
            </div>
              <br />
              <CategoryInput addCategory={this.addCategory}
                             previewCategory={this.previewCategory} />
              <div id="category-list">
                <ul>
                  {
                    _.chain(this.state.categories)
                    .filter(c => c.name !== delete_id)
                    .map(category => <CategoryItem key={category.name} {...category} deleteCategory={this.deleteCategory} /> )
                    .value()
                  }
                </ul>
              </div>
            </Col>
            <Col ref={this.svgColRef} sm={'auto'}>
              <div id='tooltip'/>
              <svg width={SVG.width} height={SVG.height} onClick={(e) => { this.surroundCategories(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}}>
                      <CalendarHeader {...props} {...this.state}/>
                      <Calendar {...props} {...this.state}/>
                      <Expenses  {...props} {...this.state} />   
                      <Categories  {...props} {...this.state} />     
                      <CalendarToggle toggleVisMode={this.toggleVisModes}/>
              </svg>
            </Col>
          </Row>
        </Container>
      );
  }
}

export default App;
