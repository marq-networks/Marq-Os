# MARQ — Frontend + API

## Local dev

1. Install deps:

```bash
npm install
```

2. Start both frontend and API:

```bash
npm run dev:all
```

- Frontend: `http://localhost:5173`
- API: `http://127.0.0.1:5174/v1`

## Connect frontend to API (mock → real)

1. Set `USE_MOCK_SERVICES = false` in `src/app/services/config.ts`
2. Create a `.env` file (copy from `.env.example`) and set:
   - `VITE_API_BASE_URL=http://127.0.0.1:5174/v1`


  # marq your time project tools phase 4 08  / shaz

  This is a code bundle for marq your time project tools phase 4 08  / shaz. The original project is available at https://www.figma.com/design/AKIpN8jsY95ry5CHmc6zJQ/marq-your-time-project-tools-phase-4-08----shaz.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  