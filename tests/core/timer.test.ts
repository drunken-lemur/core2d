import { Timer, Second } from "../../src/core";

it("constructor", () => {
  const timer = new Timer(console.log);

  expect(timer.passedTime).toBe(0);
  expect(timer.passedFrames).toBe(0);
});

// it("reset", () => {
//   const timer = new Timer(console.log);

//   timer.reset();
// });

it("start", () => {
  const timer = new Timer(console.log);

  timer.start();

  setTimeout(timer.stop, Second * 5);
});

// it("pause", () => {
//   const timer = new Timer(console.log);

//   timer.pause();
// });

// it("stop", () => {
//   const timer = new Timer(console.log);

//   timer.stop();
// });

/*

Console was cleared
reset 
reset 
start 
loop 
Timer {fpsLimit: 1, isRunning: true, passedTime_: 0.07499999999999929, passedFrames_: 1, fps_: 13333.33333333346â¦}
loop 
Timer {fpsLimit: 1, isRunning: true, passedTime_: 0.26500099999993765, passedFrames_: 2, fps_: 5263.130194053318â¦}
loop 
Timer {fpsLimit: 1, isRunning: true, passedTime_: 0.5750020000002216, passedFrames_: 3, fps_: 3225.796045816252â¦}
loop 
Timer {fpsLimit: 1, isRunning: true, passedTime_: 0.8700030000001782, passedFrames_: 4, fps_: 3389.8190175631516â¦}
loop 
Timer {fpsLimit: 1, isRunning: true, passedTime_: 1.16500399999968, passedFrames_: 5, fps_: 3389.819017568377â¦}
stop 
pause 
reset 
â

*/
