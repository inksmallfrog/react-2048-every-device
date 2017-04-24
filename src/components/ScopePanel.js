/*
* @Author: inksmallfrog
* @Date:   2017-04-24 16:45:23
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-24 17:03:13
*/

'use strict';
import React from 'react'
import PropType from 'prop-types'
/*
 * 游戏记分组件
 * @props: score:{
 *              current: num,
 *              max: num
 *         }
 */
class ScopePanel extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <p>得分: {this.props.score.current}</p>
                <p>历史最高: {this.props.score.max}</p>
            </div>
        )
    }
}
ScopePanel.defaultProps = {
    score: {
        current: 0,
        max: 0
    }
}
ScopePanel.propTypes = {
    score: PropType.shape({
        current: PropType.num,
        max: PropType.num
    })
}
export default ScopePanel;
