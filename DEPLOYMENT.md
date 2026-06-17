# Deployment Guide

This project is pre-configured for automatic deployment to Vercel via GitHub Actions.

## Prerequisites

1.  **Vercel Account**: You need a Vercel account.
2.  **GitHub Repository**: Push this code to a GitHub repository.

## Vercel Setup

1.  Create a new project on Vercel.
2.  Connect your GitHub repository.
3.  Vercel should automatically detect the Vite framework and settings.
4.  Configure the following Environment Variables in Vercel if needed (none required by default for this template).

## GitHub Actions CI/CD Setup

To enable automatic production deployments on every push to the `main` branch, add the following secrets to your GitHub repository:

1.  `VERCEL_TOKEN`: Your Vercel Personal Access Token.
2.  `VERCEL_ORG_ID`: Your Vercel Team/User ID.
3.  `VERCEL_PROJECT_ID`: The Project ID found in your Vercel project settings.

The workflow is located at `.github/workflows/deploy.yml`.

## Local Build Optimization

The build process is handled by Vite. To run a production build locally:

```bash
npm run build
```

This will generate an optimized `dist` folder ready for static hosting.
