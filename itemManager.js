class ItemManager{
	constructor(daySprites,nightSprites){
		this.rock1 = {
			health: 5,
			width: 57,
			height: 52,
			daySprite:daySprites.rock1,
			nightSprite:nightSprites.rock1
		}
		this.rock2 = {
			health: 5,
			width: 66,
			height: 68,
			daySprite:daySprites.rock2,
			nightSprite:nightSprites.rock2
		}
		this.pipe = {
			health: 10,
			width: 134,
			height: 66,
			daySprite:daySprites.pipe,
			nightSprite:nightSprites.pipe
		}
		this.table = {
			health: 15,
			width: 146,
			height: 364,
			daySprite:daySprites.table,
			nightSprite:nightSprites.table
		}
		this.log = {
			health: 15,
			width: 311,
			height: 116,
			daySprite:daySprites.log,
			nightSprite:nightSprites.log
		}
		this.trashbin = {
			health: 10,
			width: 139,
			height: 73,
			daySprite:daySprites.trashbin,
			nightSprite:nightSprites.trashbin
		}
		
		this.items = [this.rock1, this.rock2, this.pipe ,this.table, this.log, this.trashbin];
	}
	placeRandomItems(count,collectibles,sprites,width,height){
		for(let i = 0; i < count; i++){
			let item = this.items[Math.floor(Math.random()*this.items.length)];
			collectibles.push(new Collectable(Math.floor(Math.random()*(width-item.width)),Math.floor(Math.random()*(height-item.height)),item.width,item.height,item.daySprite,item.health));
		}
	}


}
