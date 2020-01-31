import React, { Component } from 'react';
import logo from './mine.png';
import './app.css';
import Grid from '../grid/grid';
import Scores from '../scores/scores';
import Timer from '../timer/timer';
import Notifications, { notify } from 'react-notify-toast';

export const NOTIFY_INTERVAL = 2000

class App extends Component {    
    constructor() {
        super();
        this.state = {
            width: 9,
            height: 9,
            minesNumber: 4,
            timer: false,
            scores: false,
            won: false,
            time: 0,
            refresh: false,
        };
    }
    formIsValid(minesNumber, width, height) {
        let valid = true, msg = '';
        if (minesNumber && width && height) {
            if (width * height > 1500) {
                msg = 'Too large!';
                valid = false;
            }
            else if (minesNumber > width * height) {
                msg = 'Too many mines!';
                valid = false;
            }
            if (!valid)
                notify.show(msg, 'custom', 2000, { background: '#ebccd1', text: '#a94442' });
        }
        return valid;
    }    
    handleChange = (e) => {
        const name = e.target.name, val = e.target.value;
        let minesNumber = this.state.minesNumber, width = this.state.width, height = this.state.height;
        if (e.target.name === 'minesNumber')
            minesNumber = val;
        else if (e.target.name === 'width')
            width = val;  
        else if (e.target.name === 'height')
            height = val;
        if (this.formIsValid(minesNumber, width, height))
        {
            const state = this.state;
            state[name] = parseInt(val);
            this.setState(state);
        }
    }
    handleStartTimer = () => {
        this.setState({ ...this.state, timer: true });
    }
    handleStopTimer = (win) => {
        this.setState({ ...this.state, timer: false, scores: true, won : win }); 
    }
    saveTime = (time) => {
        this.setState({ ...this.state, time: time }); 
    }
    restart = () => {
        const state = this.state;
        state.refresh = !state.refresh;
        this.setState(state);
    }
    render() {
        return (
            <div id="app">
                <Notifications />
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Minesweeper by Luka</h1>
                </header>
                <div className="app-intro">
                    <div className="app-wrapper">
                        <div className="app-center">
                            <form>
                                Deploy <input type="number" name="minesNumber" value={this.state.minesNumber} onChange={(e) => this.handleChange(e)} /> mines in <input type="number" name="width" value={this.state.width} onChange={(e) => this.handleChange(e)} /> x <input type="number" name="height" value={this.state.height} onChange={(e) => this.handleChange(e)} /> field
                            </form>
                        </div>
                        <div className="timer">
                           <Timer isOn={this.state.timer} saveTime={this.saveTime} />
                        </div>
                    </div>
                </div>
                <div className="app-wrapper">
                    <div className="app-center">
                        <Grid refresh={this.state.refresh} width={this.state.width} height={this.state.height} minesNumber={this.state.minesNumber} onStart={this.handleStartTimer} onStop={this.handleStopTimer}/>
                    </div>
                    <div className="app-right">
                        {this.state.scores ? <Scores time={this.state.time} won={this.state.won}/> : null}
                    </div>
                </div>
                <ul className="info">
                    <li>i) Use right mouse click to label mines</li>
                    <li>i) Change number of mines and field to taste</li>
                </ul>
                <div>
                    <button onClick={this.restart}>Restart</button>
                </div>
            </div>
        );
    }
}


export default App;
