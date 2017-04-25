/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:38:06
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-25 16:52:06
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
/*
 * 游戏头部组件
 * @props: newGame <Function>
 *         score:{
 *              current:
 *              max:
 *         }
 */
class Header extends React.Component{
    constructor(props){
        super(props);
    }
    /*
     * Event handler
     */
    handleNewGame(e){
        this.props.newGame();
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        return (
            <section className="header-sec">
                <h1>2048 Every device</h1>
                <div>
                    <p>历史最高: {this.props.score.max}</p>
                    <p>当前得分: {this.props.score.current}</p>
                    <button onClick={this.handleNewGame.bind(this)}>新游戏</button>
                </div>
            </section>
        )
    }
}
Header.defaultProps = {
    score: {
        current: 0,
        max: 0
    }
}
Header.propTypes = {
    newGame: PropType.func.isRequired,
    score: PropType.shape({
        current: PropType.num,
        max: PropType.num
    })
}
export default Header;
