import { Sprite } from "core";

import { PlayerState } from "../state";
import { blockingLeftSprite, blockingRightSprite } from "./blocking";
import { dieingLeftSprite, dieingRightSprite } from "./dieing";
import { greetingLeftSprite, greetingRightSprite } from "./greeting";
import { stayingLeftSprite, stayingRightSprite } from "./staying";
import { walkingLeftSprite, walkingRightSprite } from "./walking";

const states: Record<PlayerState, Sprite | undefined> = {
  [PlayerState.BlockingLeft]: blockingLeftSprite,
  [PlayerState.BlockingRight]: blockingRightSprite,
  [PlayerState.DieingLeft]: dieingLeftSprite,
  [PlayerState.DieingRight]: dieingRightSprite,
  [PlayerState.DuckingLeft]: undefined,
  [PlayerState.DuckingRight]: undefined,
  [PlayerState.DuckingShootLeft]: undefined,
  [PlayerState.DuckingShootRight]: undefined,
  [PlayerState.GreetingLeft]: greetingLeftSprite,
  [PlayerState.GreetingRight]: greetingRightSprite,
  [PlayerState.HookingLeft]: undefined,
  [PlayerState.HookingRight]: undefined,
  [PlayerState.HookingShootingLeft]: undefined,
  [PlayerState.HookingShootingRight]: undefined,
  [PlayerState.JumpingLeft]: undefined,
  [PlayerState.JumpingRight]: undefined,
  [PlayerState.JumpingBlockingLeft]: undefined,
  [PlayerState.JumpingBlockingRight]: undefined,
  [PlayerState.JumpingShootingLeft]: undefined,
  [PlayerState.JumpingShootingRight]: undefined,
  [PlayerState.RestingLeft]: undefined,
  [PlayerState.RestingRight]: undefined,
  [PlayerState.ShootingLeft]: undefined,
  [PlayerState.ShootingRight]: undefined,
  [PlayerState.StayingLeft]: stayingLeftSprite,
  [PlayerState.StayingRight]: stayingRightSprite,
  [PlayerState.WalkingLeft]: walkingLeftSprite,
  [PlayerState.WalkingRight]: walkingRightSprite,
};

export const getSpriteByState = (state: PlayerState) => states[state];
