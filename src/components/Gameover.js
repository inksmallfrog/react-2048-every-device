/*
* @Author: inksmallfrog
* @Date:   2017-04-25 13:47:00
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-25 17:18:48
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'

/*
 * 2048游戏结束画面
 * @props: game_over<boolean>
 *         game_score<object>
 *         newGame<Func>
 */
class Gameover extends React.Component{
    constructor(props){
        super(props);
    }
    handleClick(e){
        this.props.newGame();
        e.stopPropagation();
        e.preventDefault();
    }
    render(){
        let className = 'gameover';
        className += this.props.game_over ? ' show' : '';
        return (
            <div className={className}>
                <div className='text'>
                    <p className='title'>您挂了!</p>
                    <p className='score'>得分：{this.props.game_score.current}</p>
                </div>
                <button onClick={this.handleClick.bind(this)}>新游戏</button>
            </div>
        )
    }
}
Gameover.defaultProps = {
    game_over: false
}
Gameover.propTypes = {
    game_over: PropType.bool,
    game_score: PropType.shape({
        current: PropType.number,
        max: PropType.number
    }),
    newGame: PropType.func
}
export default Gameover;
