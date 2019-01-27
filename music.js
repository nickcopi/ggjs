class Music {
	constructor(src) {
		this.music = new Audio(src);
	}

	play() {
		this.music.play();
	}

	stop() {
		this.music.pause();
		this.music.currenTime = 0;
	}

	loop(bool) {
		this.music.loop = bool;
	}
}
