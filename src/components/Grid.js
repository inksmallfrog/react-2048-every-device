/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:53:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-25 11:32:02
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
/*
 * 2048数字单元组件
 * @props: number_grid = {
 *              id:
 *              grid_id:
 *              power:
 *              waiting_merge:
 *         }
 */
class Grid extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            style: {}
        }
    }
    componentDidMount(){
        this.forceUpdate();
    }
    calculateStyle(){
        const board_padding = 10,
              grid_width = this.refs.grid ?  this.refs.grid.scrollWidth : 130,
              grid_margin = 5,
              number_grid = this.props.number_grid,
              col = number_grid.grid_id % 4,
              row = Math.floor(number_grid.grid_id / 4),
              power = number_grid.power;

        let left = board_padding + (grid_width + grid_margin * 2) * col + grid_margin;
        let top = board_padding + (grid_width + grid_margin * 2) * row + grid_margin;
        return {
            left: left + 'px',
            top: top + 'px'
        }
    }
    render(){
        let style = this.calculateStyle();
        let className = "grid";
        className += " power" + this.props.number_grid.power;
        return (
            <div className={className} ref="grid" style={style}>{Math.pow(2, this.props.number_grid.power)}</div>
        )
    }
}
Grid.propTypes = {
    number_grid: PropType.shape({
        id: PropType.number,
        grid_id: PropType.number,
        power: PropType.number,
        waiting_merge: PropType.boolean
    }).isRequired
}
export default Grid;
