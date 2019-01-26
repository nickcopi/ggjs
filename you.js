class You{
	constructor(x,y,width,height,frames){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = 5;
		this.angle = 0;
		this.frames = frames;
		this.img = frames[0];
		this.moving = false;
		this.inventory = [];
		this.MAX_INVENT = 5;
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
}
