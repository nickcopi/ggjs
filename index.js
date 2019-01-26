let game;
class Game{
	constructor(width,height,canvas){
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.keySettings = {
			up: [87,38],
			left: [37,65],
			right: [68,39],
			down: [83,40],
			select: [32],
			drop: [13]
		}
		this.sprites = {
			bgDay: this.newImage('Assets/bgDay.png'),
			bgNight: this.newImage('Assets/bgNight.png'),
			youNight: [this.newImage('Assets/youNightStill.png'), this.newImage('Assets/youNightWalk1.png'), this.newImage('Assets/youNightWalk2.png')],
			dayItems:{
				rock1: this.newImage('Assets/rock.png'),
				rock2: this.newImage('Assets/1rock2.png')
			},
			enemies:{
				wolf:[this.newImage('Assets/wolfStill.png'),this.newImage('Assets/wolfWalk1.png'),this.newImage('Assets/wolfWalk2.png')],
			}

		}
		this.scene = new Scene(width,height,canvas,this.sprites);
	}
	newImage(src){
		let img = new Image();
		img.src = src;
		return img;
	}
}

class Scene{
	constructor(width,height,canvas,sprites){
		this.width = width;
		this.height = height;
		this.initCanvas(canvas);
		this.interval = setInterval(()=>{
			this.update();
			this.render();
		}, 1000/60);
		this.keys = [];
		this.collectibles = [];
		this.enemies = [];
		this.itemManager = new ItemManager(sprites.dayItems,sprites.dayItems);
		this.itemManager.placeRandomItems(10,this.collectibles,sprites,width,height);
		this.enemyManager = new EnemyManager(sprites.enemies);
		this.enemyManager.addEnemy(this.enemies);
		this.time = 0;
		this.night = false;
		this.becomeNight();
		this.you = new You(1450,1100,150,150,sprites.youNight);
	}
	becomeNight(){
		this.canvas.style.width = this.canvas.width + "px";
		this.canvas.style.height = this.canvas.height + "px";
		this.canvas.width *= 2;
		this.canvas.height *= 2;
		this.night = true;
	}
	becomeDay(){
		this.canvas.style.width = this.canvas.width/2 + "px";
		this.canvas.style.height = this.canvas.height/2 + "px";
		this.canvas.width /= 2;
		this.canvas.height /= 2;
		this.night = false;
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
		this.handleEnemies();
		this.handleCollectibles();
		this.you.animate(this.time);
		this.time++;
	}
	collide(o1,o2){
		return (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y) && o1 !== o2;
	}
	handleCollectibles(){
		this.collectibles = this.collectibles.filter(col=>{
			if(col.health < 0)
				return false;
			return true;
		});
	}
	handleBounds(){
		if(this.you.x < 0) this.you.x = 0;
		if(this.you.y < 0) this.you.y = 0;
		if(this.you.x + this.you.width > this.width) this.you.x = this.width - this.you.width;
		if(this.you.y + this.you.height > this.height) this.you.y = this.height - this.you.height;
	}
	handleEnemies(){
		this.enemies.forEach(enemy=>{
			enemy.setDirection(this.you,this.collide);
			enemy.move(this.collectibles,this.you,this.width,this.height);
			enemy.animate(this.time);
		});
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
		let you = this.you;
		ctx.clearRect(0,0,canvas.width,canvas.height);

		/*Draw bg*/
		let adjusted = this.cameraOffset({x:0,y:0,width:this.width, height: this.height});
		if(adjusted) ctx.drawImage(this.night?game.sprites.bgNight:game.sprites.bgDay,adjusted.x,adjusted.y,this.width,this.height);

		/*Draw items on map*/
		this.collectibles.forEach(col=>{
			let adjusted = this.cameraOffset(col);
			if(adjusted) ctx.drawImage(col.img, adjusted.x,adjusted.y, col.width, col.height);
		});
		

		/*Draw you*/
		ctx.save();
		ctx.translate(canvas.width/2 + (you.width/2),canvas.height/2 + (you.height/2));
		ctx.rotate(you.angle);
		ctx.drawImage(you.img, you.width/-2,you.height/-2,you.width,you.height);
		ctx.restore();

		/*Draw enemies*/
		this.enemies.forEach(enemy=>{
			let adjusted = this.cameraOffset(enemy);
			if(adjusted){
				ctx.save();
				if(enemy.attackTime > game.scene.time){
					let difference = enemy.attackTime - game.scene.time;
					let offset = difference - enemy.attackSpeed;
					adjusted.x += enemy.direction.x * offset;
					adjusted.y += enemy.direction.y * offset;
				}
				ctx.translate(adjusted.x+enemy.width/2,adjusted.y+enemy.height/2);
				ctx.rotate(enemy.angle + Math.PI/2);
				ctx.drawImage(enemy.img, -(enemy.width/2),-(enemy.height/2),enemy.width, enemy.height);
				ctx.restore();
			}
		});

		if(this.night){
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.globalAlpha = 1;
		}
	}
	doPickup(){
		if(this.you.inventory.length >= this.you.MAX_INVENT)
			return;
		this.collectibles = this.collectibles.filter(col=>{
			if(!this.collide(this.you,col)) return true;
			if(this.you.inventory.length < this.you.MAX_INVENT){
				this.you.inventory.push(col);
				return false;
			}
			return true;
		});
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
		game.keySettings.select.forEach(key=>{
			if(this.keys[key]){
				this.doPickup();
			}
		});
		game.keySettings.drop.forEach(key=>{
			if(this.keys[key]){
				this.you.doDrop(this.collectibles,this.time);
			}
		});
		let moved = false;
		if(moveUp)
			this.you.y -= this.you.speed;
		if(moveDown)
			this.you.y += this.you.speed;
		if(moveLeft)
			this.you.x -= this.you.speed;
		if(moveRight)
			this.you.x += this.you.speed;
		if(moveUp && moveRight){
			this.you.angle = 5*Math.PI/4;
			moved = true;
		}
		else if(moveUp && moveLeft){
			this.you.angle = 3*(Math.PI/4);
			moved = true;
		}
		else if(moveDown && moveLeft){
			this.you.angle = 1*(Math.PI/4);
			moved = true;
		}
		else if(moveDown && moveRight){
			this.you.angle = 7*(Math.PI/4);
			moved = true;
		}
		else if(moveDown){
			this.you.angle = 0;
			moved = true;
		}
		else if(moveUp){
			this.you.angle = Math.PI;
			moved = true;
		}
		else if(moveLeft){
			this.you.angle = Math.PI/2;
			moved = true;
		}
		else if(moveRight){
			this.you.angle = 3*Math.PI/2;
			moved = true;
		}
		this.you.moving = moved;
		

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
