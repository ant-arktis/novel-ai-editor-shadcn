"use client";

import { IoCheckmark, IoMenu, IoDesktop, IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// TODO implement multiple fonts editor
// const fonts = [
//   {
//     font: "Default",
//     icon: <FontDefault className="h-4 w-4" />,
//   },
//   {
//     font: "Serif",
//     icon: <FontSerif className="h-4 w-4" />,
//   },
//   {
//     font: "Mono",
//     icon: <FontMono className="h-4 w-4" />,
//   },
// ];
const appearances = [
  {
    theme: "System",
    icon: <IoDesktop style={{ width: '1rem', height: '1rem' }} />,
  },
  {
    theme: "Light", 
    icon: <IoSunny style={{ width: '1rem', height: '1rem' }} />,
  },
  {
    theme: "Dark",
    icon: <IoMoon style={{ width: '1rem', height: '1rem' }} />,
  },
];

export default function Menu() {
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="subtle" size="sm">
          <IoMenu style={{ width: '1rem', height: '1rem' }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: '13rem', padding: '0.5rem' }} align="end">
        <p style={{ 
          padding: '0.5rem', 
          fontSize: '0.75rem', 
          fontWeight: 500,
          color: 'var(--mantine-color-dimmed)'
        }}>
          Appearance
        </p>
        {appearances.map(({ theme, icon }) => (
          <Button
            variant="subtle"
            key={theme}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 'var(--mantine-radius-sm)',
              padding: '0.375rem 0.5rem',
              fontSize: '0.875rem'
            }}
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                borderRadius: 'var(--mantine-radius-sm)', 
                border: '1px solid var(--mantine-color-default-border)',
                padding: '0.25rem'
              }}>
                {icon}
              </div>
              <span>{theme}</span>
            </div>
            {currentTheme === theme.toLowerCase() && (
              <IoCheckmark style={{ width: '1rem', height: '1rem' }} />
            )}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
