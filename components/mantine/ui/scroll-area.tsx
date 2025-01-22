"use client"

import * as React from "react"
import { ScrollArea as MantineScrollArea } from "@mantine/core"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantineScrollArea>
>(({ style, ...props }, ref) => (
  <MantineScrollArea
    ref={ref}
    style={{
      position: 'relative',
      overflow: 'hidden',
      ...style
    }}
    {...props}
  />
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
