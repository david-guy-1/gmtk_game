import { MutableRefObject, Ref, useRef, useState } from 'react'

import './App.css'
import {draw} from "./process_draws"; 
import React from 'react'
import { draw_command } from './draw_commands';
import game from './Game';
import { dist } from './lines';

let t=0;
let game_obj : game = new game(); 
let timedown = 0; 
function App() {
  const [count, setCount] = useState(0)
  const displayCanvas : MutableRefObject<HTMLCanvasElement | null> = useRef(null);  
  setInterval(function(){
    if(game_obj.end){
      return; 
    }

    if(displayCanvas.current){
      let c = displayCanvas.current.getContext("2d");
      if(!c){
        return; 
      } 
      game_obj.tick(); 
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
      let player_y = 500 - game_obj.y;
      lst.push({type:"drawCircle", "x":20, "y":player_y, "r":10, "fill":true, "color":"black"});
      //enemies
      for(let item of game_obj.enemies){
        lst.push({type:"drawCircle", "x":item[0], "y":item[1], "r":10, "fill":true, "color":"red"});  
        if(dist([20, player_y ], item) < 20){
          game_obj.end = true; 
          lst=[{type:"drawText", "x" : 100, "y":100, "text_":"You got hit by an enemy, you lose! Click to restart", "color":"red", "size":20}];
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
      game_obj = new game(); 
    }
    let h = Date.now() - timedown;
    console.log(h); 
    if(h > 400) { 
      h  = 400
    }; 
    game_obj.jump(h/30 + 20)
  })
  return (
    <>
    Click to jump, avoid enemies
      <canvas ref={displayCanvas} width={800} height={600} style={{border:"1px solid black"}}></canvas>
    </>
  )
}

export default App
