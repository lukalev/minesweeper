import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadScore } from '../../actions/scores';

class Timer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            start: 0
        }
    }
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
            this.startTimer();
        }
    }  
    startTimer = () => {
        if (this.props.isOn) {
            this.setState({
                time: this.state.time,
                start: Date.now() - this.state.time
            })
            this.timer = setInterval(() => this.setState({
                time: Date.now() - this.state.start
            }), 1);
        }
        else {
            clearInterval(this.timer);
            this.props.loadScore(this.timer);
            this.props.saveTime(parseInt(this.state.time / 1000));
        }
    }
    render() {
        return (
            <div id="time" ref="time" style={{ marginTop: 0 }}>
                timer: {parseInt(this.state.time / 1000)}
            </div>
        )
    }
}
//map state from store to props
const mapStateToProps = (state) => {
    return {
        scores: state.scoresReducer.score
    }
}
//connect store to props
export default connect(mapStateToProps, { loadScore })(Timer);