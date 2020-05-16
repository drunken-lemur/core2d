// - - - - - Variant 1 - - - - -

// const times = [];
// let fps;

// const refreshLoop = () => {
//   window.requestAnimationFrame(() => {
//     const now = performance.now();
//     while (times.length > 0 && times[0] <= now - 1000) {
//       times.shift();
//     }
//     times.push(now);
//     fps = times.length;
//     refreshLoop();
//   });
// };

// refreshLoop();

// - - - - - Variant 2 - - - - -

// type FC = ((timeStart: number) => void) & {
//   counter?: number;
//   fps?: number;
// };

// let frameCount: FC = (timeStart: number) => {
//   let now = performance.now();
//   let duration = now - timeStart;

//   if (duration < 100) {
//     frameCount.counter++;
//   } else {
//     frameCount.fps = 10 * frameCount.counter;
//     frameCount.counter = 0;
//     timeStart = now;
//     console.log(frameCount.fps);
//   }
//   requestAnimationFrame(() => frameCount(timeStart));
// };

// frameCount.counter = 0;
// frameCount.fps = 0;

// frameCount(performance.now());

// - - - - - Variant 3 - - - - -

// class FPS {
//   static max = 60;
//   private cursor: number;
//   private measures: number[];

//   constructor() {
//     this.cursor = FPS.max;
//     this.measures = Array(FPS.max + 2)
//       .join("0")
//       .split("")
//       .map(Number);

//     this.tick();
//   }

//   // @ts-ignore
//   get cursor_next() {
//     return (this.cursor + 1) % (FPS.max + 1);
//   }

//   tick() {
//     this.cursor = this.cursor_next;
//     this.measures[this.cursor] = Date.now();
//     requestAnimationFrame(() => this.tick());
//   }

//   // @ts-ignore
//   get value() {
//     const time = this.measures[this.cursor] - this.measures[this.cursor_next];
//     return Math.floor((FPS.max * 1000) / time);
//   }
// }

// const fps = new FPS();
// let count = 1;

// setInterval(() => {
//   if (fps.value === 60) count += 1;

//   document.body.innerText = fps.value + "FPS" + count;

//   for (let i = 0; i < count; ++i) {
//     document.body.innerText +=
//       " " +
//       Date.now()
//         .toString(16)
//         .toUpperCase();
//   }
// });

// - - - - - Variant 4 - - - - -

// @ts-ignore
const frameCount = (fastTimeStart?: number, preciseTimeStart?: number) => {
  let now = performance.now();

  let fastDuration = now - (fastTimeStart || frameCount.startTime);
  let preciseDuration = now - (preciseTimeStart || frameCount.startTime);

  if (fastDuration < 100) {
    frameCount.fastCounter++;
  } else {
    frameCount.fastFPS = frameCount.fastCounter * 10;
    frameCount.fastCounter = 0;
    fastTimeStart = now;
    console.log(frameCount.fastFPS);
  }

  if (preciseDuration < 1000) {
    frameCount.preciseCounter++;
  } else {
    frameCount.preciseFPS = frameCount.preciseCounter;
    frameCount.preciseCounter = 0;
    preciseTimeStart = now;
    console.log(frameCount.preciseFPS);
  }
  requestAnimationFrame(() => frameCount(fastTimeStart, preciseTimeStart));
};

frameCount.fastCounter = 0;
frameCount.fastFPS = 0;
frameCount.preciseCounter = 0;
frameCount.preciseFPS = 0;
frameCount.startTime = performance.now();

frameCount();
