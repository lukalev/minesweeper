import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadScores, createScore } from '../../actions/scores';
import ScoresList from './scores-list';
import './scores.css';

//uses redux
class Scores extends Component {

  componentDidMount() {
      this.props.loadScores();
  }
  onSubmit = (e) => {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      let ref = this.refs['score-name'];
      let scoreName = ref.value;
      this.props.createScore(scoreName, this.props.time);
      ref.value = '';
  }
  render() {
      return (
          <div id="scores">
              <ScoresList scores={this.props.scores} />
              <form onSubmit={this.onSubmit} style={{display: !this.props.won ? "none" : "block"}}>
                  <input ref="score-name" /><br/>                  
                  <button>Add new score</button>
              </form>
          </div>
      );
  }
}

Scores.propTypes = {}
Scores.defaultProps = {}

//map state from store to props
const mapStateToProps = (state) => {
    return {
        scores: state.scoresReducer.scores
    }
}

//connect store to props
export default connect(mapStateToProps, { loadScores, createScore })(Scores);
