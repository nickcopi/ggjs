class ItemManager{
	constructor(daySprites,nightSprites){
		this.rock1 = {
			health: 10,
			width: 57,
			height: 52,
			daySprite:daySprites.rock1,
			nightSprite:nightSprites.rock1
		}
		this.rock2 = {
			health: 10,
			width: 66,
			height: 68,
			daySprite:daySprites.rock2,
			nightSprite:nightSprites.rock2
		}
		this.items = [this.rock1, this.rock2];
	}
	placeRandomItems(count,collectibles,sprites,width,height){
		for(let i = 0; i < count; i++){
			let item = this.items[Math.floor(Math.random()*this.items.length)];
			collectibles.push(new Collectable(Math.floor(Math.random()*width-item.width),Math.floor(Math.random()*height-item.height),item.width,item.height,item.daySprite,item.health));
		}
	}


}
