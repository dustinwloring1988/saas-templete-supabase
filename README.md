# Next.js Project with Theme Toggle and Multiple Pages

This project is a Next.js application that includes a theme toggle feature, multiple pages for different functionalities, and various integrations for a complete SaaS template.

## Project Structure

- `app/`: Contains the main application pages and layout
  - `layout.tsx`: Main layout component for the application
  - `page.tsx`: Home page component
  - `otp/page.tsx`: One-Time Password (OTP) page
  - `api-usage/page.tsx`: API usage page
  - `new-project/page.tsx`: New project creation page
  - `chat-interface/page.tsx`: Chat interface page
  - `billing/page.tsx`: Billing and subscription page
  - `settings/page.tsx`: User settings page
  - `register/page.tsx`: User registration page
  - `forgot-password/page.tsx`: Password recovery page
  - `reset-password/page.tsx`: Password reset page
- `components/`: Reusable React components
  - `Sidebar.tsx`: Sidebar component for navigation
  - `ThemeProvider.tsx`: Provider component for theme context
  - `ThemeToggle.tsx`: Toggle component for switching between light and dark themes
  - `ApiCostChart.tsx`: Chart component for API usage costs
- `lib/`: Utility functions and API integrations
  - `stripe.ts`: Stripe integration for payments
  - `supabase.ts`: Supabase client setup and helper functions
  - `openai.ts`: OpenAI integration for AI features

## Features

- **Theme Toggle**: Users can switch between light and dark themes using the ThemeToggle component.
- **Sidebar Navigation**: Easy navigation between different pages of the application.
- **Multiple Pages**: Includes pages for home, OTP, API usage, creating new projects, chat interface, billing, and user settings.
- **Authentication**: User registration, login, and password recovery flows.
- **API Integration**: Stripe for payments, Supabase for backend, and OpenAI for AI features.
- **Responsive Design**: Tailwind CSS for a mobile-friendly layout.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Stripe
- Supabase
- OpenAI

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/dustinwloring1988/saas-template.git && cd saas-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables for Stripe, Supabase, OpenAI, and other integrations.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

