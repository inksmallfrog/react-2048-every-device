require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import Header from 'components/Header';
import GameBoard from 'components/GameBoard';

function getRandomFromRange(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

//Add this polyfill for webview
function isInteger(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
};

class AppComponent extends React.Component {
    constructor(props){
        super(props);

        this.last_keyevent_time;                        //记录上次键盘事件发生时间
        this.touch = {x: -1, y: -1, active: false};     //记录手指触控起点信息
        this.state = {
            score:{
                current: 0,
                max: 0
            },
            step: -2,
            game_time: 0,
            is_gameover: false,
            number_grids: [/*{
                grid_id:
                power:
                waiting_merge:
            }*/]
        }
    }
    componentDidMount(){
        this.newGame();
        this.refs.game_component.focus();
    }
    /*
     *返回随机的一个空网格位置
     *@params number_grids: 存在数字的grids信息
     */
    getRandomEmptyGrid(number_grids){
        //获取所有网格数组
        let grids_id = Array.apply(null, new Array(16)).map((value, index)=>{
            return index;
        });
        //获取被number占据的网格数组
        let number_grids_id = number_grids.map((grid)=>{
            return grid.grid_id;
        })
        //从网格数组中过滤被number占用的位置
        let empty_grids_id = grids_id.filter((grid) => {
            return number_grids_id.indexOf(grid) < 0;
        });
        //从空格数组中随机选出一个下标
        let randomIndex = getRandomFromRange(0, empty_grids_id.length);
        return empty_grids_id[randomIndex];
    }
    getRandomPower(){
        //获取当前最大的power值
        let current_max_power = 3;
        this.state.number_grids.forEach((value) => {
            current_max_power = Math.max(current_max_power, value.power);
        });
        //计算每个数字出现的比例差——这里用二次加权
        let rand = getRandomFromRange(0, (1 + current_max_power) * current_max_power * (current_max_power + 2) / 6);
        let total = 0;
        for(let i = 1; i < current_max_power; ++i){
            if(rand < total) return current_max_power - i + 1;
            else total += i * i;
        }
        return 1;
    }
    /*
     * 生成新游戏
     */
    newGame(){
        let max_hist = isInteger(+localStorage.max_score) ? +localStorage.max_score : 0;
        localStorage.max_score = Math.max(max_hist, this.state.score.max);
        let number_grids = [],
            step = -2,
            game_time = this.state.game_time + 1;
        //初始时，随机生成两个数值
        number_grids.push({
            id: step++,
            grid_id: this.getRandomEmptyGrid(number_grids),
            power: this.getRandomPower(),
            waiting_merge: false
        });
        number_grids.push({
            id: step++,
            grid_id: this.getRandomEmptyGrid(number_grids),
            power: this.getRandomPower(),
            waiting_merge: false
        });
        this.setState({
            number_grids: number_grids,
            step: step,
            game_time: game_time,
            is_gameover: false,
            score: {
                current: 0,
                max: +localStorage.max_score
            }
        })
    }
    //将数字网格映射到16个面板中的网格，方便进行比较计算
    rejectNumberGrids2BoardGrids(number_grids){
        //初始化16个空面板网格
        let board_grids = Array.apply(null, new Array(16)).map(()=>{
            return new Array(0);
        });
        number_grids.forEach((grid) => {
            let grid_id = grid.grid_id;
            let number_count_in_grid = board_grids[grid_id].length;
            board_grids[grid_id][number_count_in_grid] = {};
            board_grids[grid_id][number_count_in_grid].id = grid.id;
            board_grids[grid_id][number_count_in_grid].power = grid.power;
        })
        return board_grids;
    }
    //将面板网格映射回数字网格
    rejectBoardGrids2NumberGrids(board_grids){
        let number_grids = [];
        board_grids.forEach((board_grid, index)=>{
            let grid_content_num = board_grid.length;
            if(grid_content_num == 0) return;
            else if(grid_content_num == 1){     //无网格合并状态
                number_grids.push({
                    id: board_grid[0].id,
                    grid_id: index,
                    power: board_grid[0].power,
                    waiting_merge: false
                });
            }
            else if(grid_content_num == 2){     //存在网格合并状态
                number_grids.push({
                    id: board_grid[0].id,
                    grid_id: index,
                    power: board_grid[0].power,
                    waiting_merge: true
                });
                number_grids.push({
                    id: board_grid[1].id,
                    grid_id: index,
                    power: board_grid[1].power,
                    waiting_merge: true
                });
            }
        });
        //为返回的网格进行排序，保证最后显示数字网格数组顺序一致
        return number_grids.sort((grid0, grid1) => {
            return  grid0.id - grid1.id;
        });
    }
    /*
     * 执行动作
     * @params direction<string>: ['up', 'down', 'left', 'right']
     *         test_mode 是否仅检查可改变数字面板数
     */
    doCommand(direction, test_mode = false){
        let number_grids = this.state.number_grids.slice(),     //当前所有数字网格
            next_step,                                          //每一次移动的间距
            col_or_row_arr,                                     //记录遍历行或列的次序数组
            isBoarder,                                          //检查是否为边缘的函数
            calculatePos,                                       //根据参数计算面板id的函数
            changed_num = 0,                                    //统计可改变的数字面板数
            board_grids = this.rejectNumberGrids2BoardGrids(number_grids);
        //为指定方向定制参数
        switch(direction.toLowerCase()){
            case 'up':
                next_step = -4;
                col_or_row_arr = [1, 2, 3];
                isBoarder = (value) => {
                    return Math.floor(value / 4) == 0;
                }
                calculatePos = (row, col) => {
                    return row * 4 + col;
                }
                break;
            case 'down':
                next_step = 4;
                col_or_row_arr = [2, 1, 0];
                isBoarder = (value) => {
                    return Math.floor(value / 4) == 3;
                }
                calculatePos = (row, col) => {
                    return row * 4 + col;
                }
                break;
            case 'left':
                next_step = -1;
                col_or_row_arr = [1, 2, 3];
                isBoarder = (value) => {
                    return value % 4 == 0;
                }
                calculatePos = (col, row) => {
                    return col + row * 4;
                }
                break;
            case 'right':
                next_step = 1;
                col_or_row_arr = [2, 1, 0];
                isBoarder = (value) => {
                    return value % 4 == 3;
                }
                calculatePos = (col, row) => {
                    return col + row * 4;
                }
                break;
        }
        //按行或按列遍历
        col_or_row_arr.forEach((value) => {
            for(let i = 0; i < 4; ++i){
                let handled_grid = board_grids[calculatePos(value, i)];
                if(handled_grid.length > 0){ //该网格存在数字
                    let handled_number_grid = handled_grid[0],
                        next_pos = calculatePos(value, i) + next_step,
                        next_grid = board_grids[next_pos];
                    while(next_grid.length < 1 && !isBoarder(next_pos)){
                        next_pos += next_step;
                        next_grid = board_grids[next_pos];
                    }
                    if(next_grid.length > 0){ //下一格存在数字
                        let next_number_grid = next_grid[0];
                        if(next_grid.length == 1 && next_number_grid.power == handled_number_grid.power){
                            board_grids[calculatePos(value, i)] = [];
                            next_grid.push(handled_number_grid);
                            ++changed_num;
                        }
                        else{
                            next_pos -= next_step;
                            next_grid = board_grids[next_pos];
                            if(next_pos != calculatePos(value, i)){
                                board_grids[calculatePos(value, i)] = [];
                                next_grid.push(handled_number_grid);
                                ++changed_num;
                            }
                        }
                    }
                    else{ //到达边界
                        board_grids[calculatePos(value, i)] = [];
                        next_grid.push(handled_number_grid);
                        ++changed_num;
                    }
                }
            }
        });
        if(test_mode){
            return changed_num;
        }
        else{
            if(changed_num > 0){
                let new_number_grids = this.rejectBoardGrids2NumberGrids(board_grids);
                this.setState({
                    number_grids: new_number_grids
                });
                setTimeout(this.mergeAll.bind(this), 200);
            }
        }
    }
    mergeAll(){
        let number_grids = this.state.number_grids.slice();
        let step = this.state.step;
        let score = this.state.score;

        let board_grids = this.rejectNumberGrids2BoardGrids(number_grids);
        //遍历界面面板，对面板包含两个数字的网格进行合并
        board_grids.forEach((grid)=>{
            if(grid.length == 2){
                score.current += Math.pow(2, grid[0].power);
                score.max = Math.max(score.max, score.current);
                ++(grid[0].power);
                grid.length = 1;
            }
        });
        let new_number_grids = this.rejectBoardGrids2NumberGrids(board_grids);
        //生成新的数字
        new_number_grids.push({
            id: step++,
            grid_id: this.getRandomEmptyGrid(number_grids),
            power: this.getRandomPower(),
            waiting_merge: false
        });
        this.setState({
            number_grids: new_number_grids,
            step: step,
            score: score
        });

        //测试新数字生成后，是否有可行的移动方式，若没有，则游戏结束
        let TEST_MODE = true;
        if(!this.doCommand('up', TEST_MODE) && !this.doCommand('down', TEST_MODE)
            && !this.doCommand('left', TEST_MODE) && !this.doCommand('right', TEST_MODE)){
            this.setState({
                is_gameover: true
            })
        }
    }
    left(){
        this.doCommand('left');
    }
    up(){
        this.doCommand('up');
    }
    right(){
        this.doCommand('right');
    }
    down(){
        this.doCommand('down');
    }
    handleKeyPress(e){
        //计算事件发生的时间差，防止事件重复发生
        if(this.last_keyevent_time){
            if(new Date() - this.last_keyevent_time < 200) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }
        this.last_keyevent_time = new Date();
        switch(e.keyCode){
            case 37:
                this.left();
                break;
            case 38:
                this.up();
                break;
            case 39:
                this.right();
                break;
            case 40:
                this.down();
                break;
            default:
                return;
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    handleTouchStart(e){
        //排除多个手指触控情况
        if(e.targetTouches.length == 1){
            this.touch.x = e.targetTouches[0].pageX;
            this.touch.y = e.targetTouches[0].pageY;
            this.touch.active = true;
        }
        //e.stopPropagation();
        //e.preventDefault();
    }
    handleTouchMove(e){
        if(this.touch.active){
            //计算动作方向
            let dirtaX = e.targetTouches[0].pageX - this.touch.x,
                dirtaY = e.targetTouches[0].pageY - this.touch.y,
                dirtaXY = Math.abs(dirtaX) - Math.abs(dirtaY);
            if(dirtaXY > 10){
                if(dirtaX > 20) {
                    this.right();
                    this.touch.active = false;
                }

                else if(dirtaX < -20) {
                    this.left();
                    this.touch.active = false;
                }
            }
            else if(dirtaXY < -10){
                if(dirtaY > 20) {
                    this.down();
                    this.touch.active = false;
                }
                else if(dirtaY < -20) {
                    this.up();
                    this.touch.active = false;
                }
            }
        }
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    render() {
        return (
            <div className="index" ref="game_component"
                    onKeyDown={this.handleKeyPress.bind(this)}
                    onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchMove={this.handleTouchMove.bind(this)}
                    tabIndex="1"
                    >
                <Header newGame={this.newGame.bind(this)} score={this.state.score}/>
                <GameBoard number_grids={this.state.number_grids}
                           game_time={this.state.game_time}
                           game_over={this.state.is_gameover}
                           game_score={this.state.score}
                           newGame={this.newGame.bind(this)}
                />
            </div>
        );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
