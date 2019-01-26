class EnemyManager{
	constructor(sprites){
		this.wolf = {
			frames:sprites.wolf,
			width:224,
			height:224,
			speed: 6,
		}
	}
	addEnemy(enemies){
		enemies.push(new Enemy(10,10,this.wolf.width,this.wolf.height,this.wolf.speed,this.wolf.frames));
	}
	static types = {
		WOLF:1,
		GHOUL:2,
		ZOMBIE:3
	}


}