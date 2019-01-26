class Enemy{
	constructor(x,y,width,height,speed,frames){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = frames[0];
		this.frames = frames;
		this.moving = false;
		this.angle = 0;
		this.speed = speed;
		this.direction = {x:1,y:1};
		this.attackTime = 0;
	}
	dist(x1,y1,x2,y2){
		return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	}
	animate(time){
		if(this.moving){
			if(time % 20 == 0){
				if(this.img == this.frames[1]){
					this.img = this.frames[2];
				} else {
					this.img = this.frames[1];
				}
			}
		} else {
			this.img = this.frames[0];
		}
	}
	setDirection(you, collide){
		let pos = you;
		let x = pos.x;
		let y = pos.y;
		x -= this.x;
		y -= this.y;
		let xPos = x > 0;
		let yPos = y > 0;
		let theta = Math.atan(Math.abs(y)/Math.abs(x));
		if(xPos && !yPos) theta = Math.PI/2 * 3 + (Math.PI/2 - theta);
		if(!xPos && !yPos) theta = Math.PI/2 * 2 + (theta);
		if(!xPos && yPos) theta = Math.PI/2 + (Math.PI/2 - theta);
		this.direction.x = Math.cos(theta);
		this.direction.y = Math.sin(theta);	
		this.angle = theta;
	}
	move(collectibles,you,width,height){
		/*if(this.attackTime > game.scene.time) return;
		if(this.attackTime === game.scene.time && this.activeHit)
			this.activeHit.active = false;
		if(this.dist(this.x,this.y,you.x,you.y) <= this.width){
			this.attack(game.scene.time,game.scene.hitFields);
			return;
		}*/
		this.moving = true;
		this.x += this.speed * this.direction.x;
		this.y += this.speed * this.direction.y;
		/*obstacles.forEach(obstacle=>{
			if(game.scene.collide(obstacle,this)){
				game.scene.backOffCollide(obstacle,this);
			}
		});*/
		if(this.x < 0) this.x = 0;
		if(this.y < 0) this.y = 0;
		if(this.x + this.width > width) this.x = width - this.width;
		if(this.y + this.height > height) this.y = height - this.height;
	}

}
