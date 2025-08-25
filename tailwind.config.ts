import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["League Spartan", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        heading: ["League Spartan", "system-ui", "sans-serif"],
        body: ["Playfair Display", "Georgia", "serif"],
        display: ["League Spartan", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#e5c287", // Soft Honey - Gentle brand primary
          foreground: "#7a4d3b",
        },
        secondary: {
          DEFAULT: "#7a4d3b", // Warm Chocolate - Gentle secondary
          foreground: "#f7f3eb",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Soft & Sophisticated Color Palette
        honey: {
          DEFAULT: "#e5c287",
          50: "#faf8f1",
          100: "#f7f3eb",
          200: "#f0e9d2",
          300: "#e8dbb8",
          400: "#e5c287",
          500: "#d4ab6a",
          600: "#c19854",
          700: "#a67c42",
          800: "#8b6635",
          900: "#72532b",
          950: "#5a4222",
        },
        chocolate: {
          DEFAULT: "#7a4d3b",
          50: "#faf8f7",
          100: "#f2ede9",
          200: "#e6d7ce",
          300: "#d4b8a1",
          400: "#c58a7d",
          500: "#a67c52",
          600: "#8b6642",
          700: "#7a4d3b",
          800: "#5c3a2d",
          900: "#4a2f24",
          950: "#3a251c",
        },
        cream: {
          DEFAULT: "#f0e9d2",
          50: "#fefdfb",
          100: "#fdf9f3",
          200: "#fbf3e7",
          300: "#f9e7c9",
          400: "#f7dbab",
          500: "#f0e9d2",
          600: "#e8d5b8",
          700: "#dcc19e",
          800: "#c8a584",
          900: "#b08a6a",
          950: "#8d6f52",
        },
        tan: {
          DEFAULT: "#d4b8a1",
          50: "#faf9f7",
          100: "#f5f1ed",
          200: "#ede6d6",
          300: "#e0d3be",
          400: "#d4b8a1",
          500: "#c19d84",
          600: "#a8826a",
          700: "#8f6a54",
          800: "#765747",
          900: "#5d453a",
          950: "#4a362e",
        },
        warmBrown: {
          DEFAULT: "#a67c52",
          50: "#f9f7f4",
          100: "#f3ede5",
          200: "#e8d9ca",
          300: "#dbc1a5",
          400: "#cea57f",
          500: "#a67c52",
          600: "#926644",
          700: "#7d5439",
          800: "#684530",
          900: "#533829",
          950: "#3f2b20",
        },
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-ambient": "var(--gradient-ambient)",
        "gradient-warm": "var(--gradient-warm)",
        // Abstract patterns
        "abstract-dots":
          "radial-gradient(circle at 1px 1px, hsl(var(--muted)) 1px, transparent 0)",
        "abstract-grid":
          "linear-gradient(hsl(var(--muted)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--muted)) 1px, transparent 1px)",
      },
      backgroundSize: {
        dots: "20px 20px",
        grid: "24px 24px",
      },
      boxShadow: {
        // Modern shadow system
        minimal: "var(--shadow-minimal)",
        float: "var(--shadow-float)",
        ambient: "var(--shadow-ambient)",
        glow: "var(--shadow-glow)",
        // Legacy wellness shadows for compatibility
        wellness: "var(--shadow-float)",
        "wellness-sm": "var(--shadow-minimal)",
        "wellness-lg": "var(--shadow-ambient)",
        premium: "var(--shadow-glow)",
        "premium-lg": "var(--shadow-ambient)",
        floating: "var(--shadow-ambient)",
      },
      transitionTimingFunction: {
        // Modern easing curves
        spring: "var(--ease-spring)",
        gentle: "var(--ease-gentle)",
        smooth: "var(--ease-smooth)",
        // Legacy for compatibility
        wellness: "var(--ease-gentle)",
        "bounce-gentle": "var(--ease-spring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Modern radius scale
        xs: "calc(var(--radius) - 6px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      spacing: {
        // Harmonious spacing scale
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        "5xl": "var(--space-5xl)",
      },
      fontSize: {
        // Modern typography scale
        "display-2xl": [
          "clamp(3rem, 8vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        "display-xl": [
          "clamp(2.5rem, 6vw, 3.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.015em" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 2.75rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.75rem, 4vw, 2.25rem)",
          { lineHeight: "1.25", letterSpacing: "-0.005em" },
        ],
        "display-sm": ["clamp(1.5rem, 3vw, 1.875rem)", { lineHeight: "1.3" }],
      },
      keyframes: {
        // Enhanced animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-gentle": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "0.1",
          },
          "50%": {
            transform: "translateY(-20px) rotate(5deg)",
            opacity: "0.2",
          },
        },
        "pulse-soft": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.05",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.1",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // New modern animations
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--accent) / 0.3)",
            opacity: "1",
          },
          "50%": {
            boxShadow: "0 0 30px hsl(var(--accent) / 0.6)",
            opacity: "0.8",
          },
        },
        "blob-float": {
          "0%, 100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-gentle": "float-gentle 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "scale-in": "scale-in 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.8s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        // New modern animations
        shimmer: "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "blob-float": "blob-float 20s ease-in-out infinite",
        // Legacy animations for compatibility
        glow: "glow-pulse 2s ease-in-out infinite",
        float: "float-gentle 6s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "5/4": "5 / 4",
      },
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(0, 1fr))",
        "auto-fill": "repeat(auto-fill, minmax(0, 1fr))",
      },
      // Custom utilities for Better Being
      screens: {
        xs: "475px",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Custom plugin for Better Being utilities
    function ({
      addUtilities,
      addComponents,
    }: {
      addUtilities: Function;
      addComponents: Function;
    }) {
      // Add custom utilities
      addUtilities({
        ".text-gradient-primary": {
          background:
            "linear-gradient(to right, hsl(var(--primary)), hsl(var(--earth-clay)))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".text-gradient-secondary": {
          background:
            "linear-gradient(to right, hsl(var(--secondary)), hsl(var(--accent)))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".glass-light": {
          "background-color": "hsl(var(--background) / 0.6)",
          "backdrop-filter": "blur(12px)",
          border: "1px solid hsl(var(--border) / 0.5)",
        },
        ".glass-strong": {
          "background-color": "hsl(var(--background) / 0.8)",
          "backdrop-filter": "blur(20px)",
          border: "1px solid hsl(var(--border) / 0.7)",
        },
      });

      // Add custom components
      addComponents({
        ".btn-modern": {
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: "translateY(0)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        ".card-modern": {
          "background-color": "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          "border-radius": "var(--radius)",
          "box-shadow": "var(--shadow-minimal)",
          transition: "all 0.3s ease",
          "&:hover": {
            "box-shadow": "var(--shadow-float)",
            transform: "translateY(-4px)",
          },
        },
        ".input-modern": {
          "background-color": "hsl(var(--input))",
          border: "1px solid hsl(var(--border))",
          "border-radius": "var(--radius)",
          "box-shadow": "var(--shadow-minimal)",
          transition: "all 0.2s ease",
          "&:focus": {
            outline: "none",
            ring: "2px",
            "ring-color": "hsl(var(--ring))",
            "border-color": "transparent",
          },
        },
      });
    },
  ],
} satisfies Config;
