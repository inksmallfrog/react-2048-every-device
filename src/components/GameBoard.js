/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:48:33
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-25 16:41:11
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
import Grid from 'components/Grid';
import Gameover from 'components/Gameover'
/*
 * 2048面板组件
 * @props: numbergrids = [{
 *              id:
 *              grid_id:
 *              power:
 *              waiting_merge:
 *         }]
 *         game_time<number>
 *         game_over<boolean>
 *         newGame<Func>
 */
class GameBoard extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="game-board">
                <Gameover game_over={this.props.game_over} game_score={this.props.game_score} newGame={this.props.newGame}/>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                <div className="grid-bg"></div>
                {this.props.number_grids.map((value) => {
                    return <Grid key={value.id + ' ' + this.props.game_time} number_grid={value}/>
                })}
            </div>
        )
    }
}
GameBoard.defaultProps = {
    number_grids: [],
    game_time: 0,
    game_over: false
}
GameBoard.propTypes = {
    number_grids: PropType.arrayOf(PropType.shape({
        id: PropType.number,
        grid_id: PropType.number,
        power: PropType.number,
        waiting_merge: PropType.bool
    })),
    game_time: PropType.number,
    game_over: PropType.bool,
    game_score: PropType.shape({
        current: PropType.number,
        max: PropType.number
    }),
    newGame: PropType.func
}
export default GameBoard;
