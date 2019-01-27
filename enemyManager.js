class EnemyManager{
	constructor(sprites){
		this.wolf = {
			frames:sprites.wolf,
			width:224,
			height:224,
			speed: 6,
		}
		this.zombie = {
			frames:sprites.zombie,
			width:130,
			height:130,
			speed: 3,
		}
		this.ghoul = {
			frames:sprites.ghoul,
			width:130,
			height:130,
			speed: 4,
		}
		this.enemies = [this.wolf,this.zombie,this.ghoul];
	}
	addEnemies(enemies,count,width,height){
		for(let i = 0; i < count; i++){
			let enemy = this.enemies[Math.floor(Math.random()*this.enemies.length)];
			let x;
			let y;
			if(Math.random() > 0.5){
				x = Math.random()>0.5?-300:height + 300;
				y = Math.floor(Math.random()*height);
			} else{
				x = Math.floor(Math.random()*width);
				y = Math.random()>0.5?-300:width + 300;

			}
			enemies.push(new Enemy(x,y,enemy.width,enemy.height,enemy.speed,enemy.frames));
		}
	}


}
