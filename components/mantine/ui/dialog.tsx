"use client"

import * as React from "react"
import { Modal as MantineModal } from "@mantine/core"
import { IoClose } from "react-icons/io5"

const Dialog = MantineModal

const DialogTrigger = MantineModal.Trigger

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantineModal.Content>
>(({ children, style, ...props }, ref) => (
  <MantineModal.Content
    ref={ref}
    style={{
      position: 'fixed',
      width: '100%',
      maxWidth: '32rem',
      display: 'grid',
      gap: '1rem',
      backgroundColor: 'var(--mantine-color-body)',
      padding: '1.5rem',
      boxShadow: 'var(--mantine-shadow-lg)',
      borderRadius: 'var(--mantine-radius-md)',
      ...style
    }}
    {...props}
  >
    {children}
    <MantineModal.CloseButton style={{
      position: 'absolute',
      right: '1rem',
      top: '1rem',
      borderRadius: 'var(--mantine-radius-sm)',
      opacity: 0.7,
      transition: 'opacity 150ms',
      cursor: 'pointer'
    }}>
      <IoClose style={{ height: '1rem', width: '1rem' }} />
    </MantineModal.CloseButton>
  </MantineModal.Content>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      textAlign: 'center',
      ...style
    }}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: '0.5rem',
      ...style
    }}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof MantineModal.Title>
>(({ style, ...props }, ref) => (
  <MantineModal.Title
    ref={ref}
    style={{
      fontSize: 'var(--mantine-font-size-lg)',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-0.025em',
      ...style
    }}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger
}
