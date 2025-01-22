"use client"

import * as React from "react"
import { Popover as MantinePopover } from "@mantine/core"

const Popover = MantinePopover

const PopoverTrigger = MantinePopover.Target

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantinePopover.Dropdown>
>(({ style, position = "bottom", offset = 4, ...props }, ref) => (
  <MantinePopover.Dropdown
    ref={ref}
    position={position}
    offset={offset}
    style={{
      zIndex: 50,
      width: '18rem',
      padding: '1rem',
      backgroundColor: 'var(--mantine-color-body)',
      color: 'var(--mantine-color-text)',
      border: '1px solid var(--mantine-color-default-border)',
      borderRadius: 'var(--mantine-radius-md)',
      boxShadow: 'var(--mantine-shadow-md)',
      outline: 'none',
      ...style
    }}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
