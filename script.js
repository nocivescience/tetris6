const gameClock=1000;
const blockSideLength=30;
const rows=20;
const columns=30;
const scoreWorth=10;
var cuenta=0;

const shapes=[
    [],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
    ],[
        [2,0,0],
        [2,2,2],
        [0,0,0],
    ],[
        [0,0,3],
        [3,3,3],
        [0,0,0],
    ],[
        [4,4],
        [4,4],
    ],[
        [0,5,5],
        [5,5,0],
        [0,0,0],
    ],[
        [6,6,0],
        [0,6,6],
        [0,0,0],
    ],[
        [0,7,0],
        [7,7,7],
        [0,0,0],
    ]
]
const colors=[
    '#000',
    '#00ccff',
    '#ff2121',
    '#c439ff',
    '#8fff39',
    '#ffca39',
    '#21c0ff',
    '#6655ff',
];
class Piece{
    constructor(shape,ctx){
        this.shape=shape;
        this.ctx=ctx;
        this.x=Math.floor(columns/2);
        this.y=0;
    }
    renderPiece(){
        this.shape.forEach((row,i)=>{
            row.forEach((cell,j)=>{
                if(cell>0){
                    this.ctx.fillStyle=colors[cell];
                    this.ctx.fillRect(this.x+j,this.y+i,1,1);
                    // this.ctx.strokeStyle='#000';
                    // this.ctx.strokeRect(this.x+j,this.y+i,1,1);
                    // this.ctx.fill();
                    // this.ctx.stroke();
                }
            })
        })
    }
}
class GameModel{
    constructor(ctx){
        this.ctx=ctx;
        this.fallingPiece=null; //comeinza con null
        this.grid=this.makeStartingGrid();
    }
    makeStartingGrid(){
        let grid=[];
        for(let i=0;i<rows;i++){
            grid.push([]);
            for(let j=0;j<columns;j++){
                grid[grid.length-1].push(0);
            }
        }
        return grid;
    };
    collision(x,y,candidate=null){
        const shape=this.fallingPiece.shape;
        const n=shape.length;
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                if(shape[i][j]>0){
                    let p=x+j;
                    let q=y+i;
                    if(p>=0 && p<columns && q<rows ){
                        if(this.grid[q][p]>0){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        }
        return false;
    }
    renderGameState(){
        for(let i=0;i<this.grid.length;i++){
            for(let j=0;j<this.grid[i].length;j++){
                let cell=this.grid[i][j];
                this.ctx.fillStyle=colors[cell];
                this.ctx.fillRect(j,i,1,1);
            }
        }
        console.log(this.grid);
        if(this.fallingPiece!==null){
            this.fallingPiece.renderPiece();
        }
    };
    moveDown(){
        if(this.fallingPiece===null){
            this.renderGameState();
            return;
        }else if(this.collision(this.fallingPiece.x,this.fallingPiece.y+1)){
            const shape=this.fallingPiece.shape;
            const x=this.fallingPiece.x;
            const y=this.fallingPiece.y;
            shape.forEach((row,i)=>{
                row.forEach((cell,j)=>{
                    let p=x+j;
                    let q=y+i;
                    if(p>=0 && p<columns && q<rows && cell>0){
                        this.grid[q][p]=shape[i][j];
                    }
                })
            })
            if(this.fallingPiece.y===0){
                alert("Game Over");
                this.grid=this.makeStartingGrid();
            }
            this.fallingPiece.y=null;
        }else{
            this.fallingPiece.y++;
        }
        this.renderGameState();
    }
}
let canvasElement = document.getElementById("game-canvas");
let ctx = canvasElement.getContext("2d");
ctx.scale(blockSideLength,blockSideLength);
const model=new GameModel(ctx)
setInterval(()=>{
    newGameState()
},gameClock);
let newGameState=()=>{
    fullSend();
    if(model.fallingPiece===null){
        const random=Math.floor(Math.random()*shapes.length);
        const newPiece=new Piece(shapes[4],ctx);
        model.fallingPiece= newPiece;
        model.moveDown();
    }else{
        model.moveDown();
    }
};
const fullSend=()=>{
    const allFilled=(row)=>{
        for(let x of row){
            if(x===0){
                return false;
            }
        }
        return true;
    }
    for(let i=0;i<model.grid.length;i++){
        if(allFilled(model.grid[i])){
            model.grid.splice(i,1);
            model.grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
    }
};