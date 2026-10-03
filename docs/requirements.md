# Requirements

## Functional requirements

- Users can register, log in, log out, and reset their session.
- Users can complete a five-step onboarding flow after registration.
- Users can complete a multi-question safety survey, anonymously or not.
- Users can browse campaigns and resources, with search/filter.
- Users can read legal-awareness information with official source links.
- Users can view emergency contacts and call/visit them directly.
- Users can submit a safety report, anonymously or not.
- Admins can view an overview dashboard, survey analytics, and manage
  safety reports (status updates).
- Admins can view campaign/resource/emergency-contact reference lists.
- The system must not allow a user to self-assign the admin role.

## Non-functional requirements

- Responsive across 320px–1440px+ viewports.
- Accessible: semantic HTML, visible focus states, labelled form controls.
- Secure: Supabase Auth + Row Level Security on every table.
- No secrets committed to source control.
- Graceful fallback (demo mode) when no backend is configured.

## Hardware requirements

- Any machine capable of running Node.js 18+ and a modern browser.

## Software requirements

- Node.js 18+, npm, a Supabase account (free tier is sufficient), a GitHub
  account, and a Vercel account for deployment.
