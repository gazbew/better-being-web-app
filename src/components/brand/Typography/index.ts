/**
 * Typography Component Exports
 * 
 * Better Being brand-compliant typography components following
 * Brand Bible BB-4 specifications for consistent text rendering.
 */

// Heading components
export {
  Heading,
  DisplayHeading,
  SectionHeading,
  SubHeading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  type HeadingProps,
  type HeadingLevel,
  type HeadingVariant,
  type HeadingColor
} from './Heading';

// Text components
export {
  Text,
  BodyXL,
  BodyLG,
  BodyMD,
  BodySM,
  BodyXS,
  Caption,
  Label,
  ButtonText,
  Lead,
  Muted,
  Strong,
  Emphasis,
  Quote,
  type TextProps,
  type TextVariant,
  type TextWeight,
  type TextColor,
  type TextElement,
  type QuoteProps
} from './Text';

// Default exports
export { default as Heading } from './Heading';
export { default as Text } from './Text';