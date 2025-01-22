"use client";

import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "@/components/mantine/ui/dialog";
import Magic from "@/components/tailwind/ui/icons/magic";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 'var(--mantine-radius-md)',
      backgroundColor: 'var(--mantine-color-body)',
      color: 'var(--mantine-color-text)'
    }}
    shouldFilter={false}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent style={{ overflow: 'hidden', padding: 0 }}>
        <Command style={{
          '& [cmdk-group-heading]': { padding: '0 0.5rem', fontWeight: 500, color: 'var(--mantine-color-dimmed)' },
          '& [cmdk-group]:not([hidden]) ~[cmdk-group]': { paddingTop: 0 },
          '& [cmdk-group]': { padding: '0 0.5rem' },
          '& [cmdk-input-wrapper] svg': { height: '1.25rem', width: '1.25rem' },
          '& [cmdk-input]': { height: '3rem' },
          '& [cmdk-item]': { padding: '0.75rem 0.5rem' },
          '& [cmdk-item] svg': { height: '1.25rem', width: '1.25rem' }
        }}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    borderBottom: '1px solid var(--mantine-color-default-border)',
    padding: '0 1rem'
  }} cmdk-input-wrapper="">
    <Magic style={{ 
      marginRight: '0.5rem',
      height: '1rem',
      width: '1rem',
      flexShrink: 0,
      color: 'var(--mantine-color-violet-5)'
    }} />
    <CommandPrimitive.Input
      ref={ref}
      style={{
        display: 'flex',
        height: '2.75rem',
        width: '100%',
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'transparent',
        padding: '0.75rem 0',
        fontSize: 'var(--mantine-font-size-sm)',
        outline: 'none',
        '&::placeholder': { color: 'var(--mantine-color-dimmed)' },
        '&:disabled': { cursor: 'not-allowed', opacity: 0.5 }
      }}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    style={{
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    style={{
      padding: '1.5rem 0',
      textAlign: 'center',
      fontSize: 'var(--mantine-font-size-sm)'
    }}
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    style={{
      overflow: 'hidden',
      padding: '0.25rem',
      color: 'var(--mantine-color-text)',
      '& [cmdk-group-heading]': {
        padding: '0 0.5rem',
        paddingTop: '0.375rem',
        paddingBottom: '0.375rem',
        fontSize: 'var(--mantine-font-size-xs)',
        fontWeight: 500,
        color: 'var(--mantine-color-dimmed)'
      }
    }}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    style={{
      marginLeft: '-0.25rem',
      marginRight: '-0.25rem',
      height: '1px',
      backgroundColor: 'var(--mantine-color-default-border)'
    }}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    style={{
      position: 'relative',
      display: 'flex',
      cursor: 'pointer',
      userSelect: 'none',
      alignItems: 'center',
      borderRadius: 'var(--mantine-radius-sm)',
      padding: '0.375rem 0.5rem',
      fontSize: 'var(--mantine-font-size-sm)',
      outline: 'none',
      '&:hover': {
        backgroundColor: 'var(--mantine-color-default-hover)',
        color: 'var(--mantine-color-default-color)'
      },
      '&[data-selected=true]': {
        backgroundColor: 'var(--mantine-color-default-hover)',
        color: 'var(--mantine-color-default-color)'
      },
      '&[data-disabled]': {
        pointerEvents: 'none',
        opacity: 0.5
      }
    }}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      style={{
        marginLeft: 'auto',
        fontSize: 'var(--mantine-font-size-xs)',
        letterSpacing: '0.1em',
        color: 'var(--mantine-color-dimmed)'
      }}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
