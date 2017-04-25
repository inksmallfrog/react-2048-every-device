/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:38:06
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-24 17:22:04
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
/*
 * 游戏头部组件
 * @props: newGame <Function>
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
                <button onClick={this.handleNewGame.bind(this)}>新游戏</button>
            </section>
        )
    }
}
Header.propTypes = {
    newGame: PropType.func.isRequired
}
export default Header;
