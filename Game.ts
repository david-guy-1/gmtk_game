type point=[number, number]; 

class game {
    y:number = 100;
    t:number = 0;
    v:number = 0;
    enemies : point[]  = []; 
    boulders : [point, point][] = []; 
    win : boolean = false; 
    end : boolean = false; 
    ground_line : point;
    constructor(ground_line : point){
        this.ground_line = ground_line; 
    }
    jump(v : number){
        if(this.y == this.ground_line[1]){
            this.v = v;
        }
    }
    tick(){
        this.t ++; 
        this.v += 1;
        this.y += this.v;
        if(this.y > this.ground_line[1]){
            this.y = this.ground_line[1];
            this.v = 0;
        }
        // spawn enemies
        if(Math.random() < 0.01 || this.t%60 == 1 || this.t%60 == 5){
            this.enemies.push([1000, Math.random() * 600]); 
        }
        if(this.t % 60 == 30){
            this.boulders.push([[800, Math.random() * 300], [-5, 10]])
        }
        // move enemies
        for(let item of this.enemies){
            item[0] -=10; 
        }
        // move boulders
        for(let [p,v] of this.boulders){
            p[0] += v[0];
            p[1] += v[1];
            v[1] += 1; 
            let ground_ht = p[0] * this.ground_line[0] + this.ground_line[1]; 
            if(p[1] > ground_ht){
                p[1] = ground_ht;
                v[1] = -0.8*v[1]; 
            }
        }
        // clear enemies and boulders
        this.enemies = this.enemies.filter(x => x[0] > 0);
        this.boulders = this.boulders.filter(x => x[0][0] > 0);
        
    }
    sword(x : number, y : number, length : number, width : number){
        this.enemies = this.enemies.filter(([ex,ey]) =>!((ex >= x && ex <= x+length) && Math.abs(y- ey) <= width) )
    }
}
export default game;