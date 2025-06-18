import OST from "../assets/ost/ost.mp3";
import Splash from "../assets/sfx/splash.mp3";
import Boom from "../assets/sfx/boom.mp3";

const backgroundMusic = new Audio(OST);

class Sound {
  playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.15;
    backgroundMusic.play();
  }

  pauseBackgroundMusic() {
    backgroundMusic.pause();
  }

  playSplashSfx() {
    const splashSfx = new Audio(Splash);
    splashSfx.volume = 0.5;
    splashSfx.play();
  }

  playBoomSfx() {
    const boomSfx = new Audio(Boom);
    boomSfx.volume = 0.5;
    boomSfx.play();
  }
}

export { Sound };
