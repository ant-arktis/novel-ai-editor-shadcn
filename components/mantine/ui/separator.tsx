"use client"

import * as React from "react"
import { Divider as MantineDivider } from "@mantine/core"

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantineDivider>
>(({ style, orientation = "horizontal", ...props }, ref) => (
  <MantineDivider
    ref={ref}
    orientation={orientation}
    style={{
      flexShrink: 0,
      backgroundColor: 'var(--mantine-color-default-border)',
      ...(orientation === "horizontal" 
        ? { height: '1px', width: '100%' }
        : { height: '100%', width: '1px' }
      ),
      ...style
    }}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }
