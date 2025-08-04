# Project 02 #AIAugustAppADay: Image Caption Generator

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-02)  

**📆 Date**: 04/Aug/2025  
**🎯 Project Objective**: Build an app that allows users to upload an image or enter a URL of an image, and get an AI-generated caption.   
**🚀 Features**: Allow user to upload an image or an image URL; Have the image displayed, with a copyable caption underneath it. Stretch goals: either 3-4 selections of different tones/focuses for the caption, AND/OR the user can input a sentance or two of their own to help shape the description.  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API  
**▶️ Live Demo**: [https://dave-donnelly-ai-august-02.netlify.app/](https://dave-donnelly-ai-august-02.netlify.app/)   

## 🗒️ Summary

Today was a pretty easy kind of day. After learning my lesson from Friday, I spent more time planning out the UX of the app and understanding the components a bit better. You can take a look at my [user flow diagram here](./ai-august-2025-02.drawio.png). The kind of app I was making was fairly straightforward, the only real unknowns were how the OpenAI API processed image files, and how the browser handled those files when uploaded without any database to store them. Both were fairly easily answered with Cursor AI chats, and the app came together pretty quickly. Consequently I had a bit more time to focus on styling the app a little more than I did on Friday. Styling was where things started to become unstuck.

**Lessons learned**  
The main lesson I learned was that Cursor isn't the greatest at generating CSS styling that is simple and understandable. I got Cursor to generate the CSS using the Mantine UI components, and for the most part it did a pretty good job but there was one button (the 'Generate caption' button) that, no matter what I changed, or how many times I got Cursor to look at it, the text of the button was not displayed (even though Cursor insisted it was!). In the end, I noticed a `data-loading={isLoading}` attribute on the Button. When I removed it, the text appeared. I took to ChatGPT (o4-mini-high model) to explain:

> **Why manually adding data-loading hides your text**  
>
>In HTML (and React DOM), boolean attributes are “true” simply by being present—no matter what value you give them. That means:
>
>```jsx
>// ❌ this still adds the attribute, so it’s treated as “loading”
><Button data-loading={false}>Generate Caption</Button>
>// → <button data-loading="false">…</button>
>```
>Even though you wrote false, the attribute is still in the DOM, so Mantine’s [data-loading] CSS rules fire and hide your button text.  

Mystery solved. An issue created by AI but also solved by it. These small errors can creep in and take up the valuable time you saved by using AI to generate the code in the first place. Is it worth it? For me, in this challenge... I think so. I still wouldn't have been able to pull off the slick styling it threw together in that timeframe as a junior without AI but it certainly gave me a good education by throwing a spanner in the works! 

**Final thoughts**  
Be cautious using Cursor for your styling. It can do a lot in a short amount of time, but diagnosing issues within a web of overriding styles may become more trouble than it's worth!   


This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).  

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-02/actions/workflows/npm_test.yml/badge.svg)  
*Note: Test suite runs automatically with each push/merge.*  

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/davedonnellydev/ai-august-2025-02.git
   cd ai-august-2025-02 
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: External API URLs
USER_API_URL=https://jsonplaceholder.typicode.com/users
PRODUCT_API_URL=https://dummyjson.com/products

# Optional: Proxy Settings
ENABLE_CACHE=true
CACHE_DURATION=300000
```

### Key Configuration Files

- **`next.config.mjs`** - Next.js configuration with bundle analyzer
- **`tsconfig.json`** - TypeScript configuration with path aliases (`@/*`)
- **`theme.ts`** - Mantine theme customization
- **`eslint.config.mjs`** - ESLint rules with Mantine and TypeScript support
- **`jest.config.cjs`** - Jest testing configuration
- **`.nvmrc`** - Node.js version (v24.3.0)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Component } from '@/components/Component';  // instead of '../../../components/Component'
```


## 📦 Available Scripts
### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run prettier:check` – checks files with Prettier
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `npm run storybook` – starts storybook dev server
- `npm run storybook:build` – build production storybook bundle to `storybook-static`
- `npm run prettier:write` – formats all files with Prettier


## 📜 License
![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-02)  
This project is licensed under the MIT License.  
