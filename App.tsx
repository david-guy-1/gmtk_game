import { MutableRefObject, Ref, useRef, useState } from 'react'

import './App.css'
import {draw} from "./process_draws"; 
import React from 'react'
import { draw_command } from './draw_commands';
import game from './Game';
import { dist } from './lines';



function make_game(level : number):game{
  let game_obj : game = new game([-1/10, 500], 10, 3000 + 500*level); 
  game_obj.boulder_spawn = level * 0.005; 
  game_obj.enemy_spawn = level * 0.01; 
  if(level == 1){
    game_obj.boulder_spawn = -1;
    game_obj.length= 1000;
  }
  return game_obj
}

let level = 2; 
let game_obj : game = make_game(level);
let timedown = 0; 
let swing_sword = 0;
let invuln = 0;

function App() {
  const [count, setCount] = useState(0)
  const displayCanvas : MutableRefObject<HTMLCanvasElement | null> = useRef(null);  
  setInterval(function(){
    if(displayCanvas.current){
      let c = displayCanvas.current.getContext("2d");
      if(!c){
        return; 
      } 
      // ended?
      if(game_obj.end){
        if(game_obj.hp == 0){
          c.clearRect(0,0,2000,2000);
          let lst : draw_command[]=[{type:"drawText", "x" : 100, "y":100, "text_":"You got hit by an enemy, you lose! Click to restart", "color":"red", "size":20}];
          draw(lst, c); 
        } else {
          c.clearRect(0,0,2000,2000);
          let lst : draw_command[]=[{type:"drawText", "x" : 100, "y":100, "text_":"You Win!", "color":"red", "size":20}];
          draw(lst, c);           
        }
        return;
      }
      game_obj.tick(); 
      let t = Date.now();
      c.clearRect(0,0,2000,2000);
      let floor_size = 50; 
      let speed_param = 3;
      let player_x =speed_param *game_obj.t; 
      let lst : draw_command[] = []; 
      //floor
      for(let i=-10; i<30; i++){
        let tile_x = floor_size*(Math.floor( player_x / floor_size) + i);
        let y = 500 - (tile_x-player_x)/10; 
        let rectangle : draw_command = {"type" : "drawRectangle", "tlx" : tile_x-player_x, "tly" : y, "brx" : tile_x +floor_size - player_x, "bry" : 9999, "color":"blue", "fill":true}; 
        lst.push(rectangle);
        // ending
        if(tile_x > game_obj.length){
           lst.push({"type" : "drawRectangle", "tlx" : tile_x-player_x, "tly" : 0, "brx" : 9999, "bry" : 9999, "color":"blue", "fill":true});
           lst.push({type:"drawRectangle", tlx : tile_x - player_x, tly : 0, brx : tile_x+ floor_size + 100 - player_x, bry : y, color:"green", fill:true});
           if(i == 0){
            game_obj.end = true;
           }
           break;
        }
      }
      // player
      lst.push({type:"drawCircle", "x":20, "y":game_obj.y, "r":10, "fill":true, "color":"black"});
      lst.push({type:"drawRectangle", tlx : 0, brx : player_x / game_obj.length * 800, tly :0, bry : 25, color:"black", fill:true})
      lst.push({type:"drawText", x : 5, y : 20, text_: game_obj.hp + " hp", color:"red"});
      
      //sword
      if(swing_sword >t - 100){
        lst.push({"type":"drawRectangle", "tlx":20, "tly":game_obj.y - 15,"brx":120,"bry":game_obj.y + 15, "color":"purple", "fill":true});
        game_obj.sword(20, game_obj.y, 100, 30); 
      }
      //enemies
      for(let item of game_obj.enemies){
        lst.push({type:"drawCircle", "x":item[0], "y":item[1], "r":10, "fill":true, "color":"red"});  
        
      }
      // boulders
      for(let item of game_obj.boulders){
        let [x,y] = item[0];
        lst.push({type:"drawCircle", "x":x, "y":y, "r":10, "fill":true, "color":"green"});  

      }

      //check collisions

      if(invuln < Date.now() - game_obj.grace_period){
        for(let item of game_obj.enemies){
          if(dist([20, game_obj.y ], item) < 20){
            game_obj.hit();
            invuln = Date.now(); 
          }
        }
        for(let item of game_obj.boulders){
          if(dist([20, game_obj.y ], item[0]) < 20){
            game_obj.hit();
            invuln = Date.now(); 
          }
        }
      }
      draw(lst, c); 
    }

  },30)

  document.addEventListener("mousedown", function(){
    timedown = Date.now(); 
    console.log(timedown);
  })
  document.addEventListener("mouseup", function(){
    if(game_obj.end){
      if(game_obj.hp == 0){
        level = 1;
      }else{
        level++;
      }
      game_obj = make_game(level); 
    }
    let h = Date.now() - timedown;
    console.log(h); 
    if(h > 400) { 
      h  = 400
    }; 
    game_obj.jump(-(h/30 + 20))
  })

  document.addEventListener("keydown", function(e){
    console.log(e.key);
    if(game_obj.end){
      return; 
    }    
    let t = Date.now(); 
    if(e.code =="Space" && t > swing_sword + 1000 ){
      swing_sword = t; 
      
    }
  })


  return (
    <>
    Click to jump, avoid enemies
      <canvas ref={displayCanvas} width={800} height={600} style={{border:"1px solid black"}}></canvas>
    </>
  )
}

export default App
