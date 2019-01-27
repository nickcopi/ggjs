class SpriteManager{
	constructor(){
		this.sprites = {
			bgDay: this.newImage('Assets/bgDay.png'),
			bgNight: this.newImage('Assets/bgNight.png'),
			youNight: [this.newImage('Assets/youNightStill.png'), this.newImage('Assets/youNightWalk1.png'), this.newImage('Assets/youNightWalk2.png'), this.newImage('Assets/youNightCower.png')],
			youDay:[this.newImage('Assets/youDayStill.png'),this.newImage('Assets/youDayWalk1.png'),this.newImage('Assets/youDayWalk2.png')],
			dayItems:{
				rock1: this.newImage('Assets/rock.png'),
				rock2: this.newImage('Assets/1rock2.png'),
				pipe: this.newImage('Assets/2pipe.png'),
				table: this.newImage('Assets/3table.png'),
				log: this.newImage('Assets/3log.png'),
				trashbin: this.newImage('Assets/2trashbin.png')
			},
			enemies:{
				wolf:[this.newImage('Assets/wolfStill.png'),this.newImage('Assets/wolfWalk1.png'),this.newImage('Assets/wolfWalk2.png')],
				zombie:[this.newImage('Assets/zombieStill.png'),this.newImage('Assets/zombieWalk1.png'),this.newImage('Assets/zombieWalk2.png')],
				ghoul:[this.newImage('Assets/ghoulStill.png'),this.newImage('Assets/ghoulWalk1.png'),this.newImage('Assets/ghoulWalk2.png')],
			},
			timerDark: this.newImage('Assets/timerDark.png'),
			timerDay: this.newImage('Assets/timerDay.png'),
			inventory: this.newImage('Assets/inventory.png'),
			dayToNight: this.newImage('Assets/dayToNight.png'),
			nightToDay: this.newImage('Assets/nightToDay.png'),
			menuBg: this.newImage('Assets/menuBg.png'),
			menuButtons: this.newImage('Assets/menuButtons.png'),
			title: this.newImage('Assets/title.png'),
			titleMarker: this.newImage('Assets/titleMarker.png'),
			dayTree: this.newImage('Assets/dayTree.png'),
			endScreen: this.newImage('Assets/endScreen.jpg'),



		}

	}
	newImage(src){
		let img = new Image();
		img.src = src;
		return img;
	}
}
