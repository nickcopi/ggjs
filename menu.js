class Menu{
	constructor(width,height,canvas,sprites){
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.initCanvas(canvas);
		this.sprites = sprites;
		this.keys = [];
		this.time = 0;
		this.index = 0;
		this.lastMove = 0;
		this.interval = setInterval(()=>{
			this.update();
			this.render();
		});
	}
	initCanvas(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.canvas.height = 720;
		this.canvas.width = 1280;
		this.canvas.style.width = '1280px';
		this.canvas.style.height = '720px';
		this.canvas.addEventListener('blur',()=>{
			this.keys = [];
		});
	}
	update(){
		this.handleInput();
		this.time++;
	}
	render(){
		let canvas = this.canvas;
		let ctx = this.ctx;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		let img = game.sprites.menuBg;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		let drawWidth = canvas.width;
		let drawHeight = canvas.width/img.width * img.height;
		ctx.drawImage(img,0,0,drawWidth,drawHeight);
		ctx.drawImage(game.sprites.menuButtons,980,350,209*1.3,232*1.3);
		ctx.drawImage(game.sprites.title, 0,60,game.sprites.title.width * 0.5,game.sprites.title.height * 0.5);
		let offset = 360;
		let distance = 100;
		ctx.drawImage(game.sprites.titleMarker,930,offset + distance * this.index,game.sprites.titleMarker.width * 0.2,game.sprites.titleMarker.height * 0.2);
	}
	move(dir){
		if(this.lastMove > this.time) return;
		this.index+= dir;
		if(this.index < 0) this.index = 2;
		if(this.index > 2) this.index = 0;
		this.lastMove = this.time + 30;

	}
	select(){
		soundFxManager.select.play();
		switch(this.index){
			case 0:
				clearInterval(this.interval);
				game.scene = new Scene(this.width,this.height,this.canvas,game.sprites);
			break;
		}
	}
	handleInput(){
		game.keySettings.up.forEach(key=>{
			if(this.keys[key]){
				this.move(-1);
			}
		});
		game.keySettings.down.forEach(key=>{
			if(this.keys[key]){
				this.move(1);
			}
		});
		game.keySettings.select.forEach(key=>{
			if(this.keys[key]){
				this.select();
			}
		});
		game.keySettings.drop.forEach(key=>{
			if(this.keys[key]){
				this.select();
			}
		});
	}

}
