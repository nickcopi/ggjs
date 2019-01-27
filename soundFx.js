class SoundFx {
	constructor(src) {
		this.sound = new Audio(src);
		this.sound.setAttribute('preload', 'auto');
	}

	play() {
		this.sound.play();
	}

	stop() {
		this.sound.stop();
	}

	loop(bool) {
		this.sound.loop = bool;
	}
}
