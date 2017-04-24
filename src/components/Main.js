require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Header from 'components/Header';
import ScopePanel from 'components/ScopePanel';
import GameBoard from 'components/GameBoard';

class AppComponent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            score:{
                current: 0,
                max: localStorage.max_score
            },
            //16个面板内容初始化为空
            grids: Array.apply(null, new Array(16)).fill(
                {
                    num: 0
                }
            )
        }
    }
    newGame(){

    }
    render() {
        return (
            <div className="index">
                <Header newGame={this.newGame.bind(this)}/>
                <ScopePanel score={this.state.score}/>
                <GameBoard grids={this.state.grids}/>
            </div>
        );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
