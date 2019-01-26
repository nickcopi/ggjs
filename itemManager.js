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
	}
	placeRandomItems(count,collectibles,sprites,width,height){
		for(let i = 0; i < count; i++){
			collectibles.push(new Collectable(Math.floor(Math.random()*width),Math.floor(Math.random()*height),57,53,sprites.dayItems.rock1,3));
		}
	}


}
