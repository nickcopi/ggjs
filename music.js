class Music {
	constructor(src) {
		this.music = new Audio(src);
	}

	play() {
		this.music.play();
	}

	stop() {
		this.music.stop();
	}

	loop(bool) {
		this.music.loop = bool;
	}
}
