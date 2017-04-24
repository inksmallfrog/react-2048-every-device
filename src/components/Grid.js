/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:53:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-24 17:02:54
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
/*
 * 2048数字单元组件
 * @props: grid = {
 *              num: 0
 *         }
 */
class Grid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="grid">{this.props.grid.num}</div>
        )
    }
}
Grid.defaultProps = {
    grid: {
        num: 0
    }
}
Grid.propTypes = {
    grid: PropType.shape({
        num: PropType.number
    })
}
export default Grid;
