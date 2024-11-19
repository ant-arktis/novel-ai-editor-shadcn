# Novel AI enhanced text editor 📝

This project is a text editor built with [Next.js](https://nextjs.org/), [Novel](https://novel.sh/) and [Shadcn/ui](https://ui.shadcn.com/) featuring AI integration. It provides a Notion-like customizable editing experience with various formatting options and an AI-powered assistant.

## Features

- 🤖 AI-powered writing assistance
- 📝 Rich text editing
- 🎨 Clean, modern interface
- 🌙 Dark/Light mode support
- ⌨️ Command palette for quick actions
- 🔄 Real-time markdown preview
- ⚡ Fast and responsive

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/alirezashalchian/novel-ai-editor.git
   ```

   ```
   cd novel-ai-editor
   ```

2. Install dependencies:

   ```
   pnpm i
   ```

   or

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Set up the following environment variables:

   - OPENAI_API_KEY – your OpenAI API key (you can get one [here](https://platform.openai.com/api-keys))

   - BLOB_READ_WRITE_TOKEN – your Vercel Blob read/write token

## Quick Start Guide

1. Start the development server:

   ```
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser.

3. You should see the rich text editor with an AI assistant option in the toolbar.

## Dependencies Overview

### UI Components

Shadcn components:

- dialog
- popover
- scroll-area
- separator
- slot

### Styling

- @tailwindcss/typography
- tailwind-merge
- tailwindcss-animate
- class-variance-authority
- clsx
- lucide-react
- tippy.js

### Editor Core

- novel: ^0.5.0
- highlight.js: ^11.10.0
- lowlight: ^3.1.0
- react-markdown: ^9.0.1

### AI and Backend Services

- openai: ^4.71.1
- ai: ^3.4.33
- @vercel/analytics: ^1.3.2
- @vercel/blob: ^0.26.0
- @vercel/kv: ^3.0.0
- @upstash/ratelimit: ^2.0.4

### Utility Libraries

- cmdk: ^1.0.0
- eventsource-parser: ^3.0.0
- next-themes: ^0.4.3
- sonner: ^1.7.0
- ts-pattern: ^5.5.0
- use-debounce: ^10.0.4

### Development Dependencies

- @types/node: ^20
- @types/react: ^18
- @types/react-dom: ^18
- eslint-config-next: 15.0.2
- postcss: ^8
- tailwindcss: ^3.4.1
- typescript: ^5
