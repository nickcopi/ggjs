class MusicManager {
	constructor() {
		this.menu = new Music('./Assets/song1a.wav');
		this.menu.loop(true);
		this.menu.volume = 0.7;
		this.day = new Music('./Assets/day.wav');
		this.day.loop(true);
		this.day.volume = 0.7;
		this.night = new Music('./Assets/night.wav');
		this.night.loop(true);
		this.night.volume = 0.7;
	}
}
