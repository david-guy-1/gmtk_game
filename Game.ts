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
    hp : number; 
    length : number;
    grace_period : number = 500; 
    boulder_spawn : number= 0 ;
    enemy_spawn :number = 0 ;
    constructor(ground_line : point, hp : number, length : number){
        this.ground_line = ground_line; 
        this.hp = hp;
        this.length = length; 
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
        if(Math.random() <this.enemy_spawn || this.t%60 == 1 || this.t%60 == 5){
            if(this.enemy_spawn != -1){
                this.enemies.push([1000, Math.random() * 600]); 
            }
        }
        if(this.t % 60 == 30 || Math.random() < this.boulder_spawn){
            if(this.boulder_spawn != -1){
                this.boulders.push([[800, Math.random() * 300], [-5, 10]])
            }
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
    hit(d : number = 1){
        this.hp -= d;
        if(this.hp <= 0){
            this.hp = 0;
            this.end = true;
        }
    }
}
export default game;