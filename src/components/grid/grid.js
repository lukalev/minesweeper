import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import { NOTIFY_INTERVAL } from '../app/app';
import './grid.css';

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            array: [],
            playArray: []
        };
    }    
    componentDidMount() {
        this.generateGrid();
    }
    //rerender new grid if properties changed and have values
    componentDidUpdate(prevProps) {

        if (JSON.stringify(this.props) !== JSON.stringify(prevProps) && this.props.minesNumber && this.props.width && this.props.height)
            this.generateGrid();
    }    
    generateGrid() {
        let grid = [], playGrid = [], mines = [], randoms = [];
        //initialize mine randoms
        for (let i = 0; i < this.props.height; i++)
            for (let j = 0; j < this.props.width; j++)
                randoms.push({ x: i, y: j });      
        //randomize mine coordinates
        for (let m = 0; m < this.props.minesNumber; m++) {
            let min = 0, max = randoms.length, mine = Math.floor(Math.random() * (max - min)) + min;            
            mines.push({ x: randoms[mine].x, y: randoms[mine].y });
            randoms.splice(mine, 1);
        }
        //deploy mines to grid
        for (let i = 0; i < this.props.height; i++) {
            let row = [];
            for (let j = 0; j < this.props.width; j++) {
                let value = null;
                for (let m = 0; m < this.props.minesNumber; m++) {
                    if ((mines[m].x === i) && (mines[m].y === j)) {
                        value = '*';
                        break;
                    }
                }
                row.push(value);
            }
            grid.push(row);
        }
        //calculate mine numbers by iterating through each field and checking its 8 (9 - self) neighbours.
        for (let i = 0; i < this.props.height; i++) {
            for (let j = 0; j < this.props.width; j++) {
                let count = 0;
                if (grid[i][j] !== '*') {
                    for (let iExpand = i - 1; iExpand <= i + 1; iExpand++)
                        for (let jExpand = j - 1; jExpand <= j + 1; jExpand++)
                            (this.isMined(grid, iExpand, jExpand) && count++);
                    grid[i][j] = count;
                }
            }
        }
        //initialize playArray as empty grid
        for (let i = 0; i < this.props.height; i++) {
            let row = [];
            for (let j = 0; j < this.props.width; j++) {
                row.push(null);
            }
            playGrid.push(row);
        }
        this.setState({ array: grid, playArray: playGrid });
        notify.show('Game initialized!', 'custom', NOTIFY_INTERVAL, { background: '#dff0d8', text: '#3c763d' });
    }
    isMined(array, i, j) {
        if ((i >= 0 && i < array.length) && (j >= 0 && j < array[i].length))
            if (array[i][j] === '*')
                return true;
        return false;
    }
    //recursion for expansion of empty fields / zeros
    expandEmptyFields(playArray, i, j) {
        if ((i >= 0 && i < this.state.array.length) && (j >= 0 && j < this.state.array[i].length)) {
            //proceed if empty field in array and not yet applied in playing array
            if (this.state.array[i][j] === 0 && playArray[i][j] === null) {
                playArray[i][j] = 0;
                for (let iExpand = i - 1; iExpand <= i + 1; iExpand++)
                    for (let jExpand = j - 1; jExpand <= j + 1; jExpand++)
                        this.expandEmptyFields(playArray, iExpand, jExpand);    //recursion
            }
            else if (this.state.array[i][j] !== '*' && playArray[i][j] === null) {
                playArray[i][j] = this.state.array[i][j];
            }
        }
    }
    //check if user got all fields in play array right
    isGameCompleted(playArray) {
        let clickedFields = 0, allFields = 0;
        for (let i = 0; i < this.props.height; i++)
            clickedFields += playArray[i].filter(function (el) { return (el != null && el !== '!') }).length;
        for (let i = 0; i < this.props.height; i++)
            allFields += this.state.array[i].filter(function (el) { return (el !== null && el !== '*') }).length;
        if (allFields === clickedFields) {
            notify.show('Game completed!', 'custom', NOTIFY_INTERVAL, { background: '#dff0d8', text: '#3c763d' });
            this.stopTimer();
            return true;
        }
        return false;
    }
    gameOver(playArray) {
        //expand all fields
        for (let i = 0; i < this.props.height; i++)
            for (let j = 0; j < this.props.width; j++)
                playArray[i][j] = this.state.array[i][j];
        notify.show('Game over!', 'custom', NOTIFY_INTERVAL, { background: '#ebccd1', text: '#a94442' });
        this.stopTimer();
    }
    startTimer() {
        this.startTimer = function () { }; // empty function don't call it anymore
        this.props.onStart();
    }
    stopTimer() {
        //this.startTimer = function () { }; // empty function don't call it anymore
        this.props.onStop();
    }
    handleClick = (e, i, j) => {    
        let state = this.state;
        //right click
        if (e.type === 'contextmenu') { 
            //prevent context menu from opening
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            if (state.playArray[i][j] !== '!')
                state.playArray[i][j] = '!'; //show flag
            else
                state.playArray[i][j] = null; //remove flag
        }
        //left click
        else {
            this.startTimer();
            if (state.array[i][j] === '*') {  //mine                
                this.gameOver(state.playArray);
            }
            else if (state.array[i][j] === 0) {   //empty field
                this.expandEmptyFields(state.playArray, i, j);  
                this.isGameCompleted(state.playArray);
            }
            else {  //number
                state.playArray[i][j] = state.array[i][j];
                this.isGameCompleted(state.playArray);
            }
        }
        this.setState(state);
    }
    renderButton(cell, i, j) {
        if (cell === 0)
            return <Button className="btn" disabled></Button>;
        else if (cell === '*')
            return <Button className="btn explode" disabled></Button>;
        else if (cell === '!')
            return <Button className="btn pin" onContextMenu={(e) => this.handleClick(e, i, j)} onClick={(e) => this.handleClick(e, i, j)}></Button>;
        else 
            return <Button className="btn" onContextMenu={(e) => this.handleClick(e, i, j)} onClick={(e) => this.handleClick(e, i, j)}>{cell}</Button>;
    }
    render() {        
        return (
            <div id="grid">
                <table>
                    <tbody>
                        {this.state.playArray.map((row, i) => {
                            return (
                                <tr key={i}>
                                    {row.map((cell, j) => {
                                        return (
                                            <td key={j}>
                                                {this.renderButton(cell, i, j)}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

Grid.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    minesNumber: PropTypes.number
}
Grid.defaultProps = {
    width: 9,
    height: 9,
    minesNumber: 10
}

export default Grid;
