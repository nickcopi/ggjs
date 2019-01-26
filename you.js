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
		this.inventIndex = 0;
		this.placeCoolDown = 0;
	}
	doDrop(collectibles,time){
		if(this.placeCoolDown > time) return;
		if(!this.inventory.length) return;
		let item = this.inventory[this.inventIndex];
		if(!item) return;
		item.x = this.x;
		item.y = this.y;
		this.inventory.splice(this.inventIndex,1);
		collectibles.push(item);
		this.placeCoolDown = time + 60;
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
