class Sprite {
  constructor(options) {
    this.ctx = options.ctx;

    this.image = options.image;

    this.frameIndex = 0;
    this.tickCount = 0;
    this.speed = options.ticksPerFrame || 0;
    this.frames = options.numberOfFrames || 1;

    this.width = options.width;
    this.height = options.height;

    this.start();
  }

  update() {
    this.tickCount++;

    if (this.tickCount > this.speed) {
      this.tickCount = 0;
      if (this.frameIndex < this.frames - 1) {
        this.frameIndex++;
      } else {
        this.frameIndex = 0;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width / this.frames, this.height);
    this.ctx.drawImage(
      this.image,
      (this.frameIndex * this.width) / this.frames,
      0,
      this.width / this.frames,
      this.height,
      0,
      0,
      this.width / this.frames,
      this.height
    );
  }

  start() {
    let loop = () => {
      this.update();
      this.render();

      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
  }
}

let canvas = document.getElementById("canvas");
canvas.width = 100;
canvas.height = 100;

let coinImage = new Image();
coinImage.src =
  "https://www.cat-in-web.ru/wp-content/uploads/coin-sprite-animation.png";

let sprite = new Sprite({
  ctx: canvas.getContext("2d"),
  image: coinImage,
  width: 1000,
  height: 100,
  numberOfFrames: 10,
  ticksPerFrame: 4
});
