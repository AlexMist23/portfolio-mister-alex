# Aleksander Misterkiewicz Portfolio

Welcome to my personal portfolio repository! This project showcases my skills, projects, and experience as a Full-stack Developer.

## 🚀 Features

- Responsive design for optimal viewing on all devices
- Dynamic project listing fetched from GitHub API
- Detailed project pages with extended information
- Skills and technologies section
- Animated UI elements for enhanced user experience
- Dark mode support
- SEO optimized

## 🛠 Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [Octokit](https://github.com/octokit/rest.js/) - GitHub REST API client for JavaScript

## 📦 Installation

1. Clone the repository:

   ```
   git clone https://github.com/AlexMist23/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:

   ```
   npm install
   ```

   or if you're using yarn:

   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your GitHub token:

   ```
   GITHUB_TOKEN=your_github_token_here
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the development server:

   ```
   npm run dev
   ```

   or with yarn:

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

- `app/` - Next.js app directory containing pages and API routes
- `components/` - Reusable React components
- `data/` - JSON and Markdown files for additional project data
- `public/` - Static assets including images
- `styles/` - Global styles and Tailwind CSS configuration
