# 🍔 ChowEazy Web Application (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React Query](https://img.shields.io/badge/TanStack_Query-5.0-FF4154?logo=react-query)

The official customer and vendor-facing web frontend for the **ChowEazy** food ordering platform. Built with Next.js 14, this application delivers a blazingly fast, SEO-friendly, and highly responsive user interface. It also includes Progressive Web App (PWA) capabilities for a native-like experience on mobile browsers.

## ✨ Key Features

* **Progressive Web App (PWA):** Fully installable on mobile devices with offline capabilities and caching (`next-pwa`).
* **Location & Mapping:** Integrated with `@react-google-maps/api` and `react-google-places-autocomplete` for seamless delivery address selection and restaurant proximity mapping.
* **Authentication:** Secure login flows supporting standard credentials and Google OAuth (`@react-oauth/google`).
* **Robust Form Handling:** Client-side validation powered by **Zod** and **React Hook Form** for reliable user inputs during checkout and profile setup.
* **Modern UI/UX:** Built using **Tailwind CSS** and **Radix UI** primitives for accessible, beautifully animated (`framer-motion`) and consistent design components.
* **Optimized Data Fetching:** Utilizes **TanStack React Query** for aggressive caching, background refetching, and simplified server-state management.

## 🛠 Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS, Radix UI, Class Variance Authority (CVA), Lucide React (Icons)
* **State Management:** React Query (TanStack), React Context
* **Networking:** Axios
* **Validation:** Zod

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+)
* Google Maps API Key
* Google OAuth Client ID

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   
   Environment Setup:
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_oauth_client_id

   npm run dev

   Build for Production
   npm run build
   npm start
