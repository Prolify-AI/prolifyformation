# Prolify - Business Management Platform

A comprehensive platform for international founders launching their US business.

## Features

- User authentication with email/password and Google OAuth
- Company management and onboarding
- Dashboard with business analytics
- Document management
- Compliance tracking
- Bookkeeping and financial tools

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

You can find these values in your Supabase project settings at:
https://supabase.com/dashboard/project/_/settings/api

### Installation

```bash
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Netlify Deployment

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Configure the following in Netlify:

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`

**Environment Variables:**
Add the following environment variables in Netlify Dashboard > Site settings > Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

4. Deploy

### Vercel Deployment

1. Push your code to a Git repository
2. Import your repository in Vercel
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Supabase Setup

### Authentication

To enable Google OAuth:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials (Client ID and Secret)
5. Configure authorized redirect URLs

### Database

Database migrations are located in `supabase/migrations/`. Apply them in your Supabase project.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Radix UI Components
# prolifyformation
