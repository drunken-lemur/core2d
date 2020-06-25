import { Sprite } from "core";

import { PlayerState } from "../state";
import { blockingLeftSprite, blockingRightSprite } from "./blocking";
import { greetingLeftSprite, greetingRightSprite } from "./greeting";
import { walkingLeftSprite, walkingRightSprite } from "./walking";

const states: Record<PlayerState, Sprite | undefined> = {
  [PlayerState.StayingLeft]: undefined,
  [PlayerState.StayingRight]: undefined,
  [PlayerState.GreetingLeft]: greetingLeftSprite,
  [PlayerState.GreetingRight]: greetingRightSprite,
  [PlayerState.BlockingLeft]: blockingLeftSprite,
  [PlayerState.BlockingRight]: blockingRightSprite,
  [PlayerState.WalkingLeft]: walkingLeftSprite,
  [PlayerState.WalkingRight]: walkingRightSprite,
  [PlayerState.ShootingLeft]: undefined,
  [PlayerState.ShootingRight]: undefined,
  [PlayerState.DuckingLeft]: undefined,
  [PlayerState.DuckingRight]: undefined,
  [PlayerState.DuckingShootLeft]: undefined,
  [PlayerState.DuckingShootRight]: undefined,
  [PlayerState.JumpingLeft]: undefined,
  [PlayerState.JumpingRight]: undefined,
  [PlayerState.JumpingBlockingLeft]: undefined,
  [PlayerState.JumpingBlockingRight]: undefined,
  [PlayerState.JumpingShootingLeft]: undefined,
  [PlayerState.JumpingShootingRight]: undefined,
  [PlayerState.HookingLeft]: undefined,
  [PlayerState.HookingRight]: undefined,
  [PlayerState.HookingShootingLeft]: undefined,
  [PlayerState.HookingShootingRight]: undefined,
  [PlayerState.RestingLeft]: undefined,
  [PlayerState.RestingRight]: undefined,
  [PlayerState.RestingLeft]: undefined,
  [PlayerState.RestingRight]: undefined,
  [PlayerState.DieingLeft]: undefined,
  [PlayerState.DieingRight]: undefined
};

export const getSpriteByState = (state: PlayerState) => states[state];
