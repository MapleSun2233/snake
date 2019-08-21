// 定义蛇类
class Snake_body{
    constructor(previousObj,top=null,left=null){
        this.previousObj = previousObj;
        this.obj = document.createElement('span');
        this.obj.className = 'snake_body';
        this.left = left || this.previousObj.left;
        this.top = top || this.previousObj.top;
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
    }
    nextPosition(){
        this.left = this.previousObj.left;
        this.top = this.previousObj.top;
    }
    move(){
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
    }
    removeSelf(){
        this.obj.remove();
    }
}
class Snake_head{
    constructor(top,left){
        this.obj = document.createElement('span');
        this.obj.className = 'snake_head';
        this.left = left;
        this.top = top;
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
        this.direction = 'right';
    }
    nextPosition(){
        switch (this.direction) {
            case "right":
                this.left  = this.left + 20;
                break;
            case "left":
                this.left  = this.left - 20;
                break;
            case "top":
                this.top  = this.top - 20;
                break;
            case "bottom":
                this.top  = this.top + 20;
                break;
        }
    }
    move(){
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
    }
    removeSelf(){
        this.obj.remove();
    }
}
// 定义食物类
class Food{
    constructor(){
        this.left = Math.round(Math.random()*980);
        this.top = Math.round(Math.random()*680);
        this.obj = document.createElement('span');
        this.obj.className = 'food';
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
    }
    moveFood(){
        this.left = Math.round(Math.random()*980);
        this.top = Math.round(Math.random()*680);
        this.obj.style.left = this.left+'px';
        this.obj.style.top = this.top+'px';
    }
    removeFood(){
        this.obj.remove();
    }
    eatFood(){
        this.moveFood();
        game_score.innerText = parseInt(game_score.innerText)  + 1;
        snakeArr.push(new Snake_body(snakeArr[snakeArr.length-1]));
        game_box.appendChild(snakeArr[snakeArr.length-1].obj);
    }
}

// 定义全局变量
let snakeArr = new Array();
let food  = null;
let game_box = document.querySelector('#game_box');
let game_score = document.querySelector('#game_score span');
let game_start = document.querySelector('#game_start');
let game_over = document.querySelector('#game_over');
let restart = document.querySelector('#game_over button');
let snakeMoveTimer = null;

// 按钮绑定
game_start.addEventListener('click',startGame,false);
restart.addEventListener('click',function(){
    game_start.click();
},false);

init();
// 初始化
function init(){
    game_score.innerText = 0;
    snakeMoveTimer && clearInterval(snakeMoveTimer);
    if(snakeArr.length){
        for(let i in snakeArr)
            snakeArr[i].removeSelf();
    }
    snakeArr.length = 0;
    if(food){
        food.removeFood();
        food = null;
    }
}
// 开始游戏
function startGame(){
    game_start.style.display = 'none';
    game_over.style.display = 'none';
    // 添加食物
    food = new Food();
    game_box.appendChild(food.obj);
    // 添加蛇头
    snakeArr.push(new Snake_head(500,60));
    game_box.appendChild(snakeArr[0].obj);
    // 添加蛇身
    snakeArr.push(new Snake_body(snakeArr[0],500,40));
    game_box.appendChild(snakeArr[1].obj);
    // 添加蛇身
    snakeArr.push(new Snake_body(snakeArr[1],500,20));
    game_box.appendChild(snakeArr[2].obj);
    // 添加发动机
    addEventListener('keydown',changeDirection,false);
    snakeMoveTimer = setInterval(function(){
        for(let i = snakeArr.length-1 ; i >= 0 ; i--){
            // 获取下个位置的坐标
            snakeArr[i].nextPosition();
            // 执行坐标
            snakeArr[i].move();
        }
        crash();
    },100);
}
// 改变方向
function changeDirection(event){
    switch(event.which){
        case 38:
            if(snakeArr[0].direction != 'bottom')
                snakeArr[0].direction = 'top';
            break;
        case 40:
            if(snakeArr[0].direction != 'top')
                snakeArr[0].direction = 'bottom';
            break;
        case 37:
            if(snakeArr[0].direction != 'right')
                snakeArr[0].direction = 'left';
            break;
        case 39:
            if(snakeArr[0].direction != 'left')
                snakeArr[0].direction = 'right';
            break;
    }
}
// 碰撞检测
function crash(){
    let head = snakeArr[0];
    if(head.left < 0 || head.left > 980 || head.top < 0 || head.top > 680)
        gameOver();
    else if((head.left > food.left-20 && head.left < food.left +20) && (head.top > food.top-20 && head.top < food.top +20))
        food.eatFood();
    // 咬自己
    for(let i = 1 ; i < snakeArr.length ; i++)
        if((head.left > snakeArr[i].left-20 && head.left < snakeArr[i].left +20) && (head.top > snakeArr[i].top-20 && head.top < snakeArr[i].top +20))
            gameOver();
}
// 游戏结束
function gameOver(){
    removeEventListener('keydown',changeDirection,false);
    game_over.style.display = 'block';
    init();
}