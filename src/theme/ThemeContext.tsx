// src/theme/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: { mode: 'light', colors: {} },
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  // Light‐mode palette: purely greyscale + red for errors
  const lightColors = {
    primary:       '#343a40', // dark grey (for icons, emphasis)
    secondary:     '#495057', // medium grey (for sub‐headers)
    accent:        '#6c757d', // light grey (for borders, hover)
    info:          '#e9ecef', // very light grey (cards, zebra bg)
    error:         '#dc3545', // red (links/buttons for “Remove”)

    background:    '#ffffff', // page background
    surface:       '#ffffff', // panels, cards

    textPrimary:   '#212529', // almost black
    textSecondary: '#495057', // dark grey

    border:        '#dee2e6', // form & table borders
    zebra:         '#f8f9fa', // even‐row background
  };

  // Dark‐mode can stay as you had it (or you can similarly neutralize)
  const darkColors = {
    primary:       '#adb5bd',
    secondary:     '#868e96',
    accent:        '#6c757d',
    info:          '#495057',
    error:         '#ff6b6b',

    background:    '#181818',
    surface:       '#1E1E1E',

    textPrimary:   '#e9ecef',
    textSecondary: '#adb5bd',

    border:        '#343a40',
    zebra:         '#2a2a2a',
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

    // (Optional) if you use gradients, these will now be neutral too
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(90deg, ${c.primary}, ${c.secondary})`
    );
    root.style.setProperty(
      '--gradient-button',
      `linear-gradient(90deg, ${c.accent}, ${c.primary})`
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
