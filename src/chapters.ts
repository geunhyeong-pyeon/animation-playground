import type { ComponentType } from "react";
import transitionDoc from "../docs/01-transition-vs-animation.md?raw";
import easingDoc from "../docs/02-easing.md?raw";
import transformDoc from "../docs/03-transform-and-performance.md?raw";
import keyframesDoc from "../docs/04-keyframes.md?raw";
import waapiDoc from "../docs/05-web-animations-api.md?raw";
import reactTimingDoc from "../docs/06-react-timing.md?raw";
import flipDoc from "../docs/07-flip.md?raw";
import accessibilityDoc from "../docs/08-accessibility.md?raw";
import { TransitionDemo } from "./demos/TransitionDemo";
import { EasingDemo } from "./demos/EasingDemo";
import { TransformDemo } from "./demos/TransformDemo";
import { KeyframesDemo } from "./demos/KeyframesDemo";
import { WaapiDemo } from "./demos/WaapiDemo";
import { ReactTimingDemo } from "./demos/ReactTimingDemo";
import { FlipDemo } from "./demos/FlipDemo";
import { ReducedMotionDemo } from "./demos/ReducedMotionDemo";

export interface Chapter {
  id: string;
  title: string;
  doc: string;
  Demo: ComponentType;
}

export const CHAPTERS: Chapter[] = [
  { id: "transition", title: "1. transition vs animation", doc: transitionDoc, Demo: TransitionDemo },
  { id: "easing", title: "2. Easing", doc: easingDoc, Demo: EasingDemo },
  { id: "transform", title: "3. transform과 성능", doc: transformDoc, Demo: TransformDemo },
  { id: "keyframes", title: "4. @keyframes 패턴", doc: keyframesDoc, Demo: KeyframesDemo },
  { id: "waapi", title: "5. Web Animations API", doc: waapiDoc, Demo: WaapiDemo },
  { id: "react-timing", title: "6. React 타이밍", doc: reactTimingDoc, Demo: ReactTimingDemo },
  { id: "flip", title: "7. FLIP", doc: flipDoc, Demo: FlipDemo },
  { id: "accessibility", title: "8. 접근성", doc: accessibilityDoc, Demo: ReducedMotionDemo },
];
