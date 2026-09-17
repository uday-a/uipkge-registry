import ScrollSpyComp from "./ScrollSpy.vue";
import ScrollSpyIndicatorComp from "./ScrollSpyIndicator.vue";
import ScrollSpyItemComp from "./ScrollSpyItem.vue";
import ScrollSpyLinkComp from "./ScrollSpyLink.vue";
import ScrollSpyListComp from "./ScrollSpyList.vue";
import ScrollSpyTitleComp from "./ScrollSpyTitle.vue";
import ScrollSpyStepperComp from "./ScrollSpyStepper.vue";

export interface ScrollSpyItem {
  href: string;
  title: string;
  depth?: number;
  children?: ScrollSpyItem[];
}

export type {
  ScrollSpyVariant,
  ScrollSpyTurn,
  ScrollSpyIndicatorMode,
  ScrollSpyPosition,
  ScrollSpyRailPosition,
  ScrollSpyLineWidth,
  ScrollSpyColor,
} from "./context";

export const ScrollSpy = Object.assign(ScrollSpyComp, {
  Root: ScrollSpyComp,
  Title: ScrollSpyTitleComp,
  List: ScrollSpyListComp,
  Indicator: ScrollSpyIndicatorComp,
  Item: ScrollSpyItemComp,
  Link: ScrollSpyLinkComp,
  Stepper: ScrollSpyStepperComp,
});

export const ScrollSpyRoot = ScrollSpyComp;
export const ScrollSpyTitle = ScrollSpyTitleComp;
export const ScrollSpyList = ScrollSpyListComp;
export const ScrollSpyIndicator = ScrollSpyIndicatorComp;
export const ScrollSpyItem = ScrollSpyItemComp;
export const ScrollSpyLink = ScrollSpyLinkComp;
export const ScrollSpyStepper = ScrollSpyStepperComp;

export default ScrollSpy;
