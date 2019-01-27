let game;
const spriteManager = new SpriteManager();
const soundFxManager = new SoundFxManager();
const musicManager = new MusicManager();

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
		this.sprites = spriteManager.sprites;
		this.scene = new Menu(width,height,canvas,this.sprites);
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
		this.NIGHT_LENGTH = 20*60;
		this.DAY_LENGTH = 60*60;
		this.keys = [];
		this.collectibles = [];
		this.enemies = [];
		this.itemManager = new ItemManager(sprites.dayItems,sprites.dayItems);
		this.itemManager.placeRandomItems(10,this.collectibles,sprites,width,height);
		this.enemyManager = new EnemyManager(sprites.enemies);
		this.time = 0;
		this.nightTime = 0;
		this.dayTime = 0;
		this.days = 1;
		this.night = false;
		this.gameOver = false;
		this.transitioning = false;
		this.you = new You(1450,1100,150,104,sprites.youNight,sprites.youDay);
		//this.becomeNight();
	}
	becomeNight(){
		this.canvas.style.width = this.canvas.width + "px";
		this.canvas.style.height = this.canvas.height + "px";
		this.canvas.width *= 2;
		this.canvas.height *= 2;
		this.you.width = 85;
		this.you.height = 83;
		this.night = true;
		this.enemyManager.addEnemies(this.enemies,Math.floor(this.days/2) + 3,this.width,this.height);
		this.nightTime = 0;
		this.transTime = 0;
		this.transitioning = true;
	}
	becomeDay(){
		this.canvas.style.width = this.canvas.width/2 + "px";
		this.canvas.style.height = this.canvas.height/2 + "px";
		this.canvas.width /= 2;
		this.canvas.height /= 2;
		this.you.height = 104;
		this.you.width = 150;
		this.night = false;
		this.enemies = [];
		this.itemManager.placeRandomItems(5+Math.floor(this.days/2),this.collectibles,game.scene.sprites,this.width,this.height);
		this.days++;
		this.dayTime = 0;
		this.transTime = 0;
		this.transitioning = true;
	}
	/*
	transition(){
		if(this.night){
			this.transitionScaleWidth -= this.transitionScaleWidth/60;
			this.transitionScaleHeight -= this.transitionScaleHeight/60;
			this.canvas.style.width = this.transitionScaleWidth + 'px';
			this.canvas.style.height = this.transitionScaleHeight + 'px';
			console.log(Math.round(this.transitionScaleWidth) , Math.round(this.canvas.width/2));
			if(Math.round(this.transitionScaleWidth) === Math.round(this.canvas.width/2)){
				this.transitioning = false;
			}
		} else {
			if(this.canvas.style.width.split('px')[0] === this.canvas.width){
				this.transitioning = false;
			}
		}
		
	}*/
	initCanvas(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.canvas.height = 720;
		this.canvas.width = 1280;
		this.transitionScaleWidth = this.canvas.width;
		this.transitionScaleHeight = this.canvas.height;
		this.canvas.style.width = '1280px';
		this.canvas.style.height = '720px';
		this.canvas.addEventListener('blur',()=>{
			this.keys = [];
		});
	}
	update(){
		if(this.transitioning){
			return;
		}
		this.handleInput();
		this.handleBounds();
		this.handleEnemies();
		this.handleCollectibles();
		this.you.animate(this.time,this.night);
		this.handleDeadYou();
		this.handleTime();
		this.time++;
		if(this.night) this.nightTime++;
		else this.dayTime++;
	}
	collide(o1,o2){
		return (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y) && o1 !== o2;
	}
	handleTime(){
		if(this.night){
			if(this.nightTime >= this.NIGHT_LENGTH) this.becomeDay();
		} else {
			if (this.DAY_LENGTH - this.dayTime === 15 * 60) {
				soundFxManager.bellToll.play();
			}
			if(this.dayTime >= this.DAY_LENGTH) this.becomeNight();
		}
	}
	handleDeadYou(){
		this.enemies.forEach(enemy=>{
			if(this.collide(enemy,this.you)){
				this.gameOver = true;
				this.transitioning = true;
				this.transTime = 0;
			}
		});
	}
	handleCollectibles(){
		this.collectibles = this.collectibles.filter(col=>{
			if(col.health < 0)
				return false;
			return true;
		});
	}
	handleBounds(){
		if(this.you.x < 1) this.you.x = 1;
		if(this.you.y < 1) this.you.y = 1;
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
		if(this.transitioning){
			if(!this.transTime){
				let img;
				if(this.gameOver)
					img = game.sprites.endScreen;
				else if(this.night)
					img = game.sprites.dayToNight;
				else
					img = game.sprites.nightToDay;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				let drawHeight = canvas.height;
				let drawWidth = canvas.height/img.height * img.width;
				ctx.drawImage(img,canvas.width/2 - drawWidth/2,0,drawWidth,drawHeight);
				if(this.gameOver){
					soundFxManager.youLose.play();
					ctx.fillStyle = 'white';
					ctx.font = '100px Arial';
					ctx.fillText(this.days,1300,840);

				}
			}
			this.transTime++;
			if(this.transTime > (this.gameOver?60*3:60*5)){
				this.transitioning = false;
				if(this.gameOver){
					clearInterval(this.interval);
					game.scene = new Menu(this.width,this.height,canvas,game.scene.sprites);
				}
			}
			return;
		}
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		/*Draw trees*/
		if(this.night){

		} else {
			/*
			let width = game.sprites.dayTree.width * 0.1;
			let height = game.sprites.dayTree.height * 0.1;
			for(let x = 0-canvas.width/2; x < this.width+canvas.width/2;x+=width/2){
				for(let y = 0-canvas.width/2; y < 0;y+=height/2){
					let adjusted = this.cameraOffset({x:x,y:y,width:width,height:height});
					if(adjusted) ctx.drawImage(game.sprites.dayTree,adjusted.x,adjusted.y,width,height);
				}
			}
			*/

		}

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
				let angleBonus = 0;
				if(enemy.frames === this.enemyManager.wolf.frames)
					angleBonus = Math.PI/2;
				if(enemy.frames === this.enemyManager.zombie.frames)
					angleBonus = 3*Math.PI/2;
				if(enemy.frames === this.enemyManager.ghoul.frames)
					angleBonus = 3*Math.PI/2;
				ctx.translate(adjusted.x+enemy.width/2,adjusted.y+enemy.height/2);
				ctx.rotate(enemy.angle + angleBonus);
				ctx.drawImage(enemy.img, -(enemy.width/2),-(enemy.height/2),enemy.width, enemy.height);
				ctx.restore();
			}
		});

		/*Draw timer*/
		if(this.night){
			ctx.fillStyle = 'rgb(98,211,225)';//moon
			ctx.fillRect(canvas.width/2 - 274 + this.you.width/2 + 68,60, 384,70)
			ctx.fillStyle = 'rgb(246,200,118)';//sun
			let percent = this.nightTime/this.NIGHT_LENGTH;
			let startX = canvas.width/2 - 274 + this.you.width/2 + 68; 
			let width = 384 * percent;
			let x = (startX + 384) - width;
			ctx.fillRect(x,60, width,70)
			ctx.drawImage(game.sprites.timerDark,canvas.width/2 - 274 + this.you.width/2,10,274*2,82*2);
		} else {
			ctx.fillStyle = 'rgb(246,200,118)';//sun
			ctx.fillRect(canvas.width/2 - 274/2 + this.you.width/2 + 46,35, 193,35)
			ctx.fillStyle = 'rgb(98,211,225)';//moon
			let percent = this.dayTime/this.DAY_LENGTH;
			let startX = canvas.width/2 - 274/2 + this.you.width/2 + 46; 
			let width = 193 * percent;
			let x = (startX + 193) - width;
			ctx.fillRect(x,35, width,35)
			ctx.drawImage(game.sprites.timerDay,canvas.width/2 - 274/2 + this.you.width/2,10,274,82);
		}
		/*Draw day*/
		let text = `Day: ${this.days}`;
		ctx.fillStyle = 'black';
		if(this.night){
			ctx.font = '60px Arial';
			ctx.fillText(text,canvas.width/2 + this.you.width/2 - ctx.measureText(text).width/2,220);
		} else {
			ctx.font = '30px Arial';
			ctx.fillText(text,canvas.width/2 + this.you.width/2 - ctx.measureText(text).width/2,110);
		}


		/*Draw inventory*/
		if(!this.night){
			ctx.drawImage(game.sprites.inventory, canvas.width/2 - 280/2 + this.you.width/2, canvas.height - 74 - 10,280,74);
			let offset = canvas.width/2 - 280/2 + this.you.width/2 + 13;
			let distance = 55;
			let slotWidth = 36;
			this.you.inventory.forEach((item,i)=>{
				let drawWidth;
				let drawHeight;
				if(item.width > item.height){
					drawWidth = slotWidth;
					drawHeight = slotWidth/item.width * item.height;
				} else {
					drawHeight = slotWidth;
					drawWidth = slotWidth/item.height * item.width;

				}
				ctx.drawImage(item.img,offset + i * distance,canvas.height - 73, drawWidth, drawHeight);

			});
		}

		if(this.night){
			ctx.globalAlpha = 0.3;
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.globalAlpha = 1;
		}
	}
	doPickup(){
		if(this.you.inventory.length >= this.you.MAX_INVENT){
			soundFxManager.oops.play();
			return;
		}
		this.collectibles = this.collectibles.filter(col=>{
			if(!this.collide(this.you,col)) return true;
			if(this.you.inventory.length < this.you.MAX_INVENT){
				this.you.inventory.push(col);
				soundFxManager.snap.play();
				return false;
			}
			return true;
		});
	}
	handleInput(){
		if(this.night) return;
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
	window.addEventListener('keydown',(e)=>{
		game.scene.keys[e.keyCode] = true;
	});
	window.addEventListener('keyup',(e)=>{
		game.scene.keys[e.keyCode] = false;
	});
});
/*
let makeTrees = ()=>{
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	let width = spriteManager.sprites.dayTree.width * 0.1;
	let height = spriteManager.sprites.dayTree.height * 0.1;
	for(let x = -2000; x < 5000;x+=width/2){
		for(let y = -1500; y < 4000;y+=height/2){
			ctx.drawImage(spriteManager.sprites.dayTree,0,0,width,height);
		}
	}
	spriteManager.sprites.dayTrees = new Image();
	spriteManager.sprites.dayTrees.src = canvas.toDataURL();

}
*/
