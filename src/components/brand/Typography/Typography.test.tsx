import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { 
  Heading, 
  DisplayHeading, 
  SectionHeading, 
  SubHeading,
  H1, H2, H3, H4, H5, H6,
  Text,
  BodyXL, BodyLG, BodyMD, BodySM, BodyXS,
  Caption, Label, ButtonText,
  Lead, Muted, Strong, Emphasis, Quote
} from './index';

describe('Typography Components', () => {
  describe('Heading Component', () => {
    it('renders with default props', () => {
      render(<Heading>Test Heading</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Heading');
    });

    it('renders correct heading level', () => {
      render(<Heading level={1}>H1 Heading</Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.tagName).toBe('H1');
    });

    it('applies variant classes correctly', () => {
      render(<Heading variant="display">Display Heading</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('bb-heading');
    });

    it('applies color classes correctly', () => {
      render(<Heading color="orange">Orange Heading</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-bb-orange');
    });

    it('applies custom className', () => {
      render(<Heading className="custom-class">Custom Heading</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('custom-class');
    });

    it('applies uppercase for section headings', () => {
      render(<Heading level={2} variant="heading">Section Heading</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('uppercase');
    });

    it('does not apply uppercase for subheadings', () => {
      render(<Heading level={2} variant="subheading">Sub Heading</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).not.toHaveClass('uppercase');
    });
  });

  describe('Heading Variants', () => {
    it('DisplayHeading renders with display variant', () => {
      render(<DisplayHeading>Display</DisplayHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-bb-primary', 'font-bb-bold');
    });

    it('SectionHeading renders with heading variant', () => {
      render(<SectionHeading>Section</SectionHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-bb-secondary', 'font-bb-semibold');
    });

    it('SubHeading renders with subheading variant', () => {
      render(<SubHeading>Sub</SubHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-bb-secondary', 'font-bb-medium');
    });
  });

  describe('Semantic Heading Components', () => {
    it('H1 renders h1 element', () => {
      render(<H1>H1 Content</H1>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.tagName).toBe('H1');
    });

    it('H2 renders h2 element', () => {
      render(<H2>H2 Content</H2>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.tagName).toBe('H2');
    });

    it('H3 renders h3 element', () => {
      render(<H3>H3 Content</H3>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.tagName).toBe('H3');
    });

    it('H4 renders h4 element', () => {
      render(<H4>H4 Content</H4>);
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading.tagName).toBe('H4');
    });

    it('H5 renders h5 element', () => {
      render(<H5>H5 Content</H5>);
      const heading = screen.getByRole('heading', { level: 5 });
      expect(heading.tagName).toBe('H5');
    });

    it('H6 renders h6 element', () => {
      render(<H6>H6 Content</H6>);
      const heading = screen.getByRole('heading', { level: 6 });
      expect(heading.tagName).toBe('H6');
    });
  });

  describe('Text Component', () => {
    it('renders with default props', () => {
      render(<Text>Test Text</Text>);
      const text = screen.getByText('Test Text');
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('P');
    });

    it('renders with correct variant classes', () => {
      render(<Text variant="body-lg">Large Text</Text>);
      const text = screen.getByText('Large Text');
      expect(text).toHaveClass('bb-body-lg', 'text-bb-lg');
    });

    it('applies weight classes correctly', () => {
      render(<Text weight="bold">Bold Text</Text>);
      const text = screen.getByText('Bold Text');
      expect(text).toHaveClass('font-bb-bold');
    });

    it('applies color classes correctly', () => {
      render(<Text color="orange">Orange Text</Text>);
      const text = screen.getByText('Orange Text');
      expect(text).toHaveClass('text-bb-orange');
    });

    it('renders with custom element', () => {
      render(<Text as="span">Span Text</Text>);
      const text = screen.getByText('Span Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('applies custom className', () => {
      render(<Text className="custom-text">Custom Text</Text>);
      const text = screen.getByText('Custom Text');
      expect(text).toHaveClass('custom-text');
    });
  });

  describe('Text Variants', () => {
    it('BodyXL renders with body-xl variant', () => {
      render(<BodyXL>Extra Large Body</BodyXL>);
      const text = screen.getByText('Extra Large Body');
      expect(text).toHaveClass('bb-body-xl', 'text-bb-xl');
    });

    it('BodyLG renders with body-lg variant', () => {
      render(<BodyLG>Large Body</BodyLG>);
      const text = screen.getByText('Large Body');
      expect(text).toHaveClass('bb-body-lg', 'text-bb-lg');
    });

    it('BodyMD renders with body-md variant', () => {
      render(<BodyMD>Medium Body</BodyMD>);
      const text = screen.getByText('Medium Body');
      expect(text).toHaveClass('bb-body-md', 'text-bb-base');
    });

    it('BodySM renders with body-sm variant', () => {
      render(<BodySM>Small Body</BodySM>);
      const text = screen.getByText('Small Body');
      expect(text).toHaveClass('bb-body-sm', 'text-bb-sm');
    });

    it('BodyXS renders with body-xs variant', () => {
      render(<BodyXS>Extra Small Body</BodyXS>);
      const text = screen.getByText('Extra Small Body');
      expect(text).toHaveClass('bb-body-xs', 'text-bb-xs');
    });

    it('Caption renders with caption variant', () => {
      render(<Caption>Caption Text</Caption>);
      const text = screen.getByText('Caption Text');
      expect(text).toHaveClass('bb-caption');
      expect(text.tagName).toBe('SMALL');
    });

    it('Label renders with label variant', () => {
      render(<Label>Label Text</Label>);
      const text = screen.getByText('Label Text');
      expect(text).toHaveClass('bb-label', 'uppercase');
      expect(text.tagName).toBe('LABEL');
    });

    it('ButtonText renders with button variant', () => {
      render(<ButtonText>Button Text</ButtonText>);
      const text = screen.getByText('Button Text');
      expect(text).toHaveClass('bb-button-text', 'uppercase');
      expect(text.tagName).toBe('SPAN');
    });
  });

  describe('Semantic Text Components', () => {
    it('Lead renders with body-xl and medium weight', () => {
      render(<Lead>Lead Text</Lead>);
      const text = screen.getByText('Lead Text');
      expect(text).toHaveClass('bb-body-xl', 'font-bb-medium');
    });

    it('Muted renders with muted color', () => {
      render(<Muted>Muted Text</Muted>);
      const text = screen.getByText('Muted Text');
      expect(text).toHaveClass('text-bb-tertiary');
    });

    it('Strong renders with semibold weight and strong element', () => {
      render(<Strong>Strong Text</Strong>);
      const text = screen.getByText('Strong Text');
      expect(text).toHaveClass('font-bb-semibold');
      expect(text.tagName).toBe('STRONG');
    });

    it('Emphasis renders with em element and brand styling', () => {
      render(<Emphasis>Emphasized Text</Emphasis>);
      const text = screen.getByText('Emphasized Text');
      expect(text).toHaveClass('bb-emphasis', 'italic', 'text-bb-orange');
      expect(text.tagName).toBe('EM');
    });
  });

  describe('Quote Component', () => {
    it('renders quote with basic content', () => {
      render(<Quote>This is a quote</Quote>);
      const quote = screen.getByText('"This is a quote"');
      expect(quote).toBeInTheDocument();
      expect(quote.closest('blockquote')).toHaveClass('bb-quote');
    });

    it('renders quote with author', () => {
      render(<Quote author="John Doe">This is a quote</Quote>);
      const quote = screen.getByText('"This is a quote"');
      const author = screen.getByText('John Doe');
      expect(quote).toBeInTheDocument();
      expect(author).toBeInTheDocument();
      expect(author).toHaveClass('font-bb-semibold');
    });

    it('renders quote with author and title', () => {
      render(<Quote author="John Doe" authorTitle="CEO, Better Being">This is a quote</Quote>);
      const author = screen.getByText('John Doe');
      const title = screen.getByText('CEO, Better Being');
      expect(author).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it('renders quote with title only', () => {
      render(<Quote authorTitle="Wellness Expert">This is a quote</Quote>);
      const title = screen.getByText('Wellness Expert');
      expect(title).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('applies custom className to quote', () => {
      render(<Quote className="custom-quote">This is a quote</Quote>);
      const blockquote = screen.getByText('"This is a quote"').closest('blockquote');
      expect(blockquote).toHaveClass('custom-quote');
    });
  });

  describe('Accessibility', () => {
    it('headings have proper semantic structure', () => {
      render(
        <div>
          <H1>Main Title</H1>
          <H2>Section Title</H2>
          <H3>Subsection Title</H3>
        </div>
      );
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3 = screen.getByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it('labels are properly associated', () => {
      render(<Label id="email-label">Email Address</Label>);
      const label = screen.getByText('Email Address');
      expect(label).toHaveAttribute('id', 'email-label');
      expect(label.tagName).toBe('LABEL');
    });

    it('quotes have proper semantic markup', () => {
      render(<Quote author="Test Author">Test quote content</Quote>);
      const blockquote = screen.getByRole('blockquote');
      expect(blockquote).toBeInTheDocument();
    });
  });

  describe('Brand Compliance', () => {
    it('display headings use Playfair Display font', () => {
      render(<DisplayHeading>Display Title</DisplayHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-bb-primary');
    });

    it('section headings use League Spartan font', () => {
      render(<SectionHeading>Section Title</SectionHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-bb-secondary');
    });

    it('body text uses League Spartan font', () => {
      render(<BodyMD>Body content</BodyMD>);
      const text = screen.getByText('Body content');
      expect(text).toHaveClass('font-bb-body');
    });

    it('captions use Inter font', () => {
      render(<Caption>Caption text</Caption>);
      const text = screen.getByText('Caption text');
      expect(text).toHaveClass('font-bb-ui');
    });

    it('applies brand tracking for headings', () => {
      render(<DisplayHeading>Brand Title</DisplayHeading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('tracking-bb-brand');
    });

    it('applies body tracking for text', () => {
      render(<BodyMD>Body text</BodyMD>);
      const text = screen.getByText('Body text');
      expect(text).toHaveClass('tracking-bb-body');
    });
  });
});