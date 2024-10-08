# Frontend Todo App
Backend (C# Dotnet Core) for this project can be found here:

https://github.com/Avicted/todo_app_dotnetcore_backend

Todo App with React, TypeScript, Vite, and Tailwind CSS.

## Features
- Create new todo items
- Update todo items
- Delete todo items
- View all todo items that belong to the user
- Authentication with the backend

## Testing
- Playwright for end-to-end testing of the frontend

---

## How to run the project
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# End-to-end testing with Playwright
npx playwright test --ui

# or
npm run test
```

## Docker that can interact with the backend
```bash
docker network create shared-network
docker-compose up
```

![Todo Items Page](Screenshot_TodoItems.png "Todo Items Page")
![New Todo Item Modal](Screenshot_New_TodoItem.png "New Todo Item Modal")

---
# Vite Documentation

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
