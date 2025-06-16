import OST from "../assets/ost/ost.mp3";
import Splash from "../assets/sfx/splash.mp3";
import Boom from "../assets/sfx/boom.mp3";

class Sound {
  playBackgroundMusic() {
    const backgroundMusic = new Audio(OST);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.15;
    backgroundMusic.play();
  }

  playSplashSfx() {
    const splashSfx = new Audio(Splash);
    splashSfx.play();
  }

  playBoomSfx() {
    const boomSfx = new Audio(Boom);
    boomSfx.play();
  }
}

export { Sound };
