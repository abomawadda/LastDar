# Development Workflow

## Branching
- Work on feature branches from `main`.
- Keep pull requests small and focused.

## Local Development
1. `npm install`
2. Configure `.env`
3. Start server: `npm run dev:server`
4. Start web: `npm run dev:web`

## Validation Before Merge
1. `npm run lint`
2. `npm run test`
3. `npm run build:web`

## Coding Notes
- Use environment variables for secrets and service settings.
- Prefer small, testable modules.
- Add tests with each feature or bug fix when possible.

