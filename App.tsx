import { MutableRefObject, Ref, useRef, useState } from 'react'

import './App.css'
import {draw} from "./process_draws"; 
import React from 'react'
import { draw_command } from './draw_commands';
import game from './Game';
import { dist } from './lines';

let t=0;
let game_obj : game = new game([-1/10, 500]); 
let timedown = 0; 

let swing_sword = 0; 
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
        c.clearRect(0,0,2000,2000);
        let lst : draw_command[]=[{type:"drawText", "x" : 100, "y":100, "text_":"You got hit by an enemy, you lose! Click to restart", "color":"red", "size":20}];
        draw(lst, c); 
        return;
      }
      game_obj.tick(); 
      let t = Date.now();
      c.clearRect(0,0,2000,2000);
      let floor_size = 50; 
      let speed_param = 3;
      let offset = speed_param *game_obj.t%floor_size; 
      let lst : draw_command[] = []; 
      //floor
      for(let i=0; i<30; i++){
        let x = floor_size*i - 10- offset;
        let y = 500 - x/10; 
        let rectangle : draw_command = {"type" : "drawRectangle", "tlx" : x, "tly" : y, "brx" : x+floor_size, "bry" : 9999, "color":"blue", "fill":true}; 
        lst.push(rectangle);
      }
      // player
      lst.push({type:"drawCircle", "x":20, "y":game_obj.y, "r":10, "fill":true, "color":"black"});
      //sword
      if(swing_sword >t - 100){
        lst.push({"type":"drawRectangle", "tlx":20, "tly":game_obj.y - 15,"brx":120,"bry":game_obj.y + 15, "color":"purple", "fill":true});
        game_obj.sword(20, game_obj.y, 100, 30); 
      }
      //enemies
      for(let item of game_obj.enemies){
        lst.push({type:"drawCircle", "x":item[0], "y":item[1], "r":10, "fill":true, "color":"red"});  
        if(dist([20, game_obj.y ], item) < 20){
          game_obj.end = true; 
          break;
        }
      }
      // boulders
      for(let item of game_obj.boulders){
        let [x,y] = item[0];
        lst.push({type:"drawCircle", "x":x, "y":y, "r":10, "fill":true, "color":"green"});  
        if(dist([20, game_obj.y ], item[0]) < 20){
          game_obj.end = true; 
          break;
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
      game_obj = new game([-1/10, 500]); 
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
