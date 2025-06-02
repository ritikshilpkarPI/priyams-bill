// src/theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: { mode: 'light', colors: {} },
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  // Your provided color palette
  const bluePalette = {
    darkest: '#012a4a',  // Darkest blue
    darker: '#013a63',   // Dark blue
    dark: '#01497c',     // Deep blue
    medium: '#014f86',   // Medium blue
    primary: '#2a6f97',  // Primary blue
    secondary: '#2c7da0', // Secondary blue
    light: '#468faf',    // Light blue
    lighter: '#61a5c2',  // Lighter blue
    lightest: '#89c2d9', // Lightest blue
    accent: '#a9d6e5',   // Accent blue
  };

  // Light mode theme - using your blue palette
  const lightColors = {
    primary: bluePalette.primary,    // Main brand color
    secondary: bluePalette.secondary, // Secondary brand color
    accent: bluePalette.accent,      // Accent color for highlights
    info: bluePalette.lightest,      // Info backgrounds
    error: '#dc3545',                // Keep red for errors

    background: '#ffffff',           // White background
    surface: '#ffffff',             // White surface

    textPrimary: bluePalette.darkest,   // Dark text
    textSecondary: bluePalette.dark,    // Secondary text

    border: bluePalette.lightest,    // Light borders
    zebra: bluePalette.lightest,     // Zebra striping
  };

  // Dark mode theme - keeping it black
  const darkColors = {
    primary: '#ffffff',      // White for primary
    secondary: '#e0e0e0',    // Light grey for secondary
    accent: '#a9d6e5',       // Keeping your accent blue
    info: '#2a2a2a',         // Dark grey for info
    error: '#ff6b6b',        // Light red for errors

    background: '#000000',   // Black background
    surface: '#1a1a1a',      // Slightly lighter black for surfaces

    textPrimary: '#ffffff',      // White text
    textSecondary: '#e0e0e0',    // Light grey text

    border: '#333333',       // Dark grey borders
    zebra: '#1a1a1a',        // Slightly lighter black for zebra striping
  };

  const [theme, setTheme] = useState({
    mode: 'light',
    colors: lightColors,
  });

  const toggleTheme = () =>
    setTheme(prev => ({
      mode: prev.mode === 'light' ? 'dark' : 'light',
      colors: prev.mode === 'light' ? darkColors : lightColors,
    }));

  useEffect(() => {
    const root = document.documentElement;
    const c = theme.colors;

    // Apply each semantic color as a CSS variable
    Object.entries(c).forEach(([key, val]) =>
      root.style.setProperty(`--color-${key}`, val)
    );

    // Create gradients using the blue palette for light mode
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(90deg, ${bluePalette.primary}, ${bluePalette.secondary})`
    );
    root.style.setProperty(
      '--gradient-button',
      `linear-gradient(90deg, ${bluePalette.medium}, ${bluePalette.primary})`
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
