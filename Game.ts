type point=[number, number]; 

class game {
    y:number = 100;
    t:number = 0;
    v:number = 0;
    enemies : point[]  = []; 
    win : boolean = false; 
    end : boolean = false; 
    constructor(){
    }
    jump(v : number){
        if(this.y == 0){
            this.v = v;
        }
    }
    tick(){
        this.t ++; 
        this.v -= 1;
        this.y += this.v;
        if(this.y < 0){
            this.y = 0;
            this.v = 0;
        }
        // spawn enemies
        if(Math.random() < 0.01 || this.t%60 == 1 || this.t%60 == 5){
            this.enemies.push([1000, Math.random() * 600]); 
        }
        for(let item of this.enemies){
            item[0] -=10; 
        }
        this.enemies = this.enemies.filter(x => x[0] > 0);
        
    }
}
export default game;