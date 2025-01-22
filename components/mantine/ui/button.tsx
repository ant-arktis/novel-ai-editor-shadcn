import * as React from "react";
import { Button as MantineButton } from "@mantine/core";

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof MantineButton> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "filled", size = "sm", asChild = false, ...props }, ref) => {
    return (
      <MantineButton
        ref={ref}
        variant={variant}
        size={size}
        styles={{
          root: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            fontWeight: 500,
            transition: 'all 0.2s',
            '&:disabled': {
              pointerEvents: 'none',
              opacity: 0.5
            },
            '& svg': {
              pointerEvents: 'none',
              width: '16px',
              height: '16px',
              flexShrink: 0
            }
          }
        }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
