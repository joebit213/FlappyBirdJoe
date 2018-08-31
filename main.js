
//canvas config
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d')

//testing
//ctx.fillRect(0,0,50,50)

//Variables globales
var pipes = []
var interval;
var frames = 0;
var images = {
  bg:'https://raw.githubusercontent.com/ironhack-labs/lab-canvas-flappybirds/master/starter_code/images/bg.png',
  flapy :'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/flappy.png?raw=true',
  pipe1: 'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_bottom.png?raw=true',
  pipe2: 'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_top.png?raw=true'
}

//clases
class Board{
  constructor(){
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image ()
      //this.image = document.createElement('img')
    this.image.src = images.bg
    this.image.onload = () =>{ //tambien se puede usar bind this.image.onload = () =>{}
      this.draw()
    }
    this.music = new Audio()
    this.music.src = "http://66.90.93.122/ost/super-mario-bros/zawombix/01%20-%20Super%20Mario%20Bros.mp3"
  }
  draw(){
    this.x--
    if(this.x < -canvas.width) this.x = 0;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height)

    ctx.font = '50px Avenir'
    ctx.fillText(Math.floor(frames / 60),100,100)
  }
}//clase board termina

class Flappy{
  constructor(){
    this.x = 100
    this.y = 150
    this.width = 40
    this.height = 30
    this.image = new Image ()
    this.image.src = images.flapy
    this.image.onload = () =>{
      this.draw()
    }
    this.gravity = 3
    this.crash = new Audio()
    this.crash.src = "http://66.90.93.122/ost/super-mario-bros/dywwpbka/15%20-%201-Down.mp3"
  }
  draw(){
  if(this.y < canvas.height - 40) this.y += this.gravity
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
  }
  crashWidth(item){
    var crash = (this.x < item.x + item.width) &&
           (this.x + this.width > item.x) &&
           (this.y < item.y + item.height) &&
           (this.y + this.height > item.y);
           if (crash) this.crash.play()
           return crash;
  }
}//termina clase flapy

class Pipe {
  constructor(y, height, pipeName='pipe2'){ //se ejecuta si no llega
    this.x = canvas.width -50
    this.y = y ? y : 0 //si se asigna y si no usa 0
    this.width = 50
    this.height = height || 100 // si no tines height usa 100
    this.image = new Image ()
    this.image.src = images[pipeName]
    this.image.onload = () =>{
      this.draw()
    }
    }
    draw(){
      this.x-=2
      ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
  }

}


//instancias
var board = new Board()
var flappy = new Flappy()

//funciones principales
function update(){
  frames++
  ctx.clearRect(0,0,canvas.width,canvas.height)
  board.draw()
  flappy.draw()
  //pipe
  generatePipes()
  drawPipes()
  checkCollitions()
}

function start(){
  if(interval) return
  pipes = []
  frames = 0
  interval = setInterval(update,1000/60)
}

function gameOver(){
  clearInterval(interval)
  ctx.font = ('90px Avenir')
  ctx.fillText('Game Over', 50 ,250)
  interval=null
  board.music.pause()

}

//funciones auxiliares
function generatePipes(){
  if(frames % 120 === 0){
  //new Pipe(y,alto, "pipe1")
      //1.- generar el tubo de arriba
      var y = 0;
      var alto = Math.floor(Math.random() * 400) + 20
      var topPipe = new Pipe(y,alto, 'pipe2')
      //2.- establecer el espacio donde pasa flappy
      var window = 150
      var alto2 = canvas.height - (window + alto)
      //3.- generar el tubo de abajo
      var bottomPipe = new Pipe(canvas.height - alto2,alto2,'pipe1')
      //4.- donde jodido pongo los tubos ??????
      pipes.push(topPipe)
      pipes.push(bottomPipe)
  }//if
}

function drawPipes(){
  pipes.forEach(function(pipe){
    pipe.draw()
  })
}

function checkCollitions(){
  pipes.forEach(function(pipe){
    if(flappy.crashWidth(pipe)){
      gameOver()
    }
  })
}

//los observadores
  addEventListener('keydown',function(e){
    if(e.keyCode === 32 && flappy.y > 30){
      flappy.y -= 60
    }
    if(e.keyCode === 27){
      start()
    }
    if(e.key = 'Enter'){
      start()
      board.music.play()
    }
  })

  addEventListener('touchstart', function (e) {
    if(e.touches === [0] && flappy.y > 30){
      flappy.y -= 60
      start()
      board.music.play()
    }
    /*if(e.touch === [0]){
      start()
    }
    if(e.touch = [0]){
      start()
      board.music.play()
    }*/
    })
    

  
