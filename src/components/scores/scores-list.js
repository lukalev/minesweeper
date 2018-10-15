import React from 'react';
import _ from 'lodash';

//lodash map because of convenience of mapping structure of props which is array of objects
export default (props) => {
    return (
        <div>
            <h3>Scoreboard</h3>
            <ul>
                {_.map(props.scores, (score) => <li key={score.id}>{score.name}:{score.score}s</li>)}
            </ul>
        </div>
        )
}