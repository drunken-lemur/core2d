import { Direction, Sprite } from "core";

import { PlayerState } from "../state";

import { getBlockingSprite } from "./blocking";
import { getDieingSprite } from "./dieing";
import { getDuckingSprite } from "./ducking";
import { getDuckingShootingSprite } from "./duckingShooting";
import { getFlingSprite } from "./fling";
import { getGreetingSprite } from "./greeting";
import {} from "./hooking";
import {} from "./jumping";
import {} from "./jumpingShooting";
import {} from "./jumpingBlocking";
import {} from "./resting";
import { getRidingSprite } from "./riding";
import {} from "./shooting";
import { getStayingSprite } from "./staying";
import { getWalkingSprite } from "./walking";
import {} from "./wellDone";

const states: Record<
  PlayerState,
  ((direction: Direction) => Sprite) | undefined
> = {
  [PlayerState.Blocking]: getBlockingSprite,
  [PlayerState.Dieing]: getDieingSprite,
  [PlayerState.Ducking]: getDuckingSprite,
  [PlayerState.DuckingShooting]: getDuckingShootingSprite,
  [PlayerState.Fling]: getFlingSprite,
  [PlayerState.Greeting]: getGreetingSprite,
  [PlayerState.Hooking]: undefined,
  [PlayerState.HookingShooting]: undefined,
  [PlayerState.Jumping]: undefined,
  [PlayerState.JumpingBlocking]: undefined,
  [PlayerState.JumpingShooting]: undefined,
  [PlayerState.Resting]: undefined,
  [PlayerState.Riding]: getRidingSprite,
  [PlayerState.Shooting]: undefined,
  [PlayerState.Staying]: getStayingSprite,
  [PlayerState.Walking]: getWalkingSprite
};

export const getSpriteByState = (state: PlayerState, direction: Direction) =>
  states[state]!(direction);
