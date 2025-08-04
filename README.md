# Project 02 #AIAugustAppADay: Image Caption Generator

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-02)  

**📆 Date**: 04/Aug/2025  
**🎯 Project Objective**: Build an app that allows users to upload an image or enter a URL of an image, and get an AI-generated caption.   
**🚀 Features**: Allow user to upload an image or an image URL; Have the image displayed, with a copyable caption underneath it. Stretch goals: either 3-4 selections of different tones/focuses for the caption, AND/OR the user can input a sentance or two of their own to help shape the description.  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API  
**▶️ Live Demo**: *[https://your-demo-url.com](https://your-demo-url.com)*  
*(Link will be added after deployment)*  

## 🗒️ Summary
**Lessons learned**  
*A little summary of learnings*  

**Blockers**  
*Note any blockers here*  

**Final thoughts**  
*Any final thoughts here*  


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
