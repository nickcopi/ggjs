let game;
class Game{
	constructor(width,height,canvas){
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.scene = new Scene(width,height,canvas);
		this.keySettings = {
			up: [87,38],
			left: [37,65],
			right: [68,39],
			down: [83,40],
			select: [32]
		}
		this.sprites = {
			bgDay: this.newImage('Assets/bgDay.png')
			
		}
	}
	newImage(src){
		let img = new Image();
		img.src = src;
		return img;
	}
}

class Scene{
	constructor(width,height,canvas){
		this.width = width;
		this.height = height;
		this.initCanvas(canvas);
		this.interval = setInterval(()=>{
			this.update();
			this.render();
		}, 1000/60);
		this.keys = [];
		this.you = new You(10,10,50,50);
	}
	initCanvas(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.canvas.height = 720;
		this.canvas.width = 1280;
	}
	update(){
		this.handleInput();
		this.handleBounds();
	}
	cameraOffset(obj){
		let adjustedX = (obj.x - (this.you.x)) + canvas.width/2;
		let adjustedY = (obj.y - (this.you.y)) + canvas.height/2;
		let oWidth = obj.width === undefined ? 0 : obj.width;
		let oHeight = obj.height === undefined ? 0 : obj.height;
		if(adjustedX + oWidth < 0 || adjustedX > canvas.width || adjustedY > canvas.height || adjustedY + oHeight < 0)
			return;
		return{
			x:adjustedX,
			y:adjustedY
		};
	}
	render(){
		let canvas = this.canvas;
		let ctx = this.ctx;
		ctx.clearRect(0,0,canvas.width,canvas.height);

		/*Draw bg*/
		let adjusted = this.cameraOffset({x:0,y:0,width:this.width, height: this.height});
		if(adjusted) ctx.drawImage(game.sprites.bgDay,adjusted.x,adjusted.y,this.width,this.height);

		/*Draw you*/
		ctx.fillRect(canvas.width/2,canvas.height/2,this.you.width,this.you.height);
		
	}
	handleInput(){
		let moveUp = false;
		let moveDown = false;
		let moveLeft = false;
		let moveRight = false;
		game.keySettings.up.forEach(key=>{
			if(this.keys[key]){
				moveUp = true;		
			}
		});
		game.keySettings.down.forEach(key=>{
			if(this.keys[key]){
				moveDown = true;		
			}
		});
		game.keySettings.left.forEach(key=>{
			if(this.keys[key]){
				moveLeft = true;		
			}
		});
		game.keySettings.right.forEach(key=>{
			if(this.keys[key]){
				moveRight = true;		
			}
		});
		if(moveUp)
			this.you.y -= this.you.speed;
		if(moveDown)
			this.you.y += this.you.speed;
		if(moveLeft)
			this.you.x -= this.you.speed;
		if(moveRight)
			this.you.x += this.you.speed;
		

	}



}
class Background{
	constructor(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

window.addEventListener('load',()=>{
	game = new Game(2970,2295,document.getElementById('canvas'));
});
window.addEventListener('keydown',(e)=>{
	game.scene.keys[e.keyCode] = true;
});
window.addEventListener('keyup',(e)=>{
	game.scene.keys[e.keyCode] = false;
});
