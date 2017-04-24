/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:48:33
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-24 17:03:40
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
import Grid from 'components/Grid';
/*
 * 2048面板组件
 * @props: grids = [{
 *              num: 0
 *         }]
 */
class GameBoard extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="game-board">
                {this.props.grids.map((value, index) => {
                    return <Grid grid={value} />
                })}
            </div>
        )
    }
}
GameBoard.defaultProps = {
    grids: Array.apply(null, new Array(16)).fill({num: 0})
}
GameBoard.propTypes = {
    grids: PropType.arrayOf(PropType.shape({
        num: PropType.number
    }))
}
export default GameBoard;
