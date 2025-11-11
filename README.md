# FlemzinPortal: School Management System

Welcome to the FlemzinPortal, a modern, role-based school management application built with Next.js. This portal provides distinct dashboards and functionalities for three user roles: **Parents/Students**, **Staff**, and **Admins**.

## Tech Stack

This project is built with a modern, performant, and type-safe technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN/UI](https://ui.shadcn.com/) - for accessible and reusable components.
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

---

## Project Structure

The project uses the Next.js App Router, which organizes the application by routes. Here is a breakdown of the key directories:

```
/src
├── app/                      # Main application directory
│   ├── (roles)/              # Route groups for different user roles
│   │   ├── admin/            # Admin-specific pages (e.g., dashboard, announcements)
│   │   ├── parstud/          # Parent/Student pages (e.g., results, fees, calendar)
│   │   └── staff/            # Staff-specific pages
│   ├── layout.tsx            # The root layout for the entire application
│   └── page.tsx              # The main login page (entry point)
│
├── components/               # Reusable React components
│   ├── ui/                   # Core UI components from ShadCN (Button, Card, etc.)
│   └── dashboard-layout.tsx  # The main authenticated layout wrapper
│
├── hooks/                    # Custom React hooks (e.g., use-toast)
│
└── lib/                      # Libraries, utilities, and data
    ├── data.ts               # **[IMPORTANT]** Mock data source for the entire app
    ├── utils.ts              # Utility functions (e.g., `cn` for classnames)
    └── placeholder-images.ts # Manages placeholder image data
```

---

## Getting Started

To run the project locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

## How to Work with the Project

### 1. Understanding the Data Flow (Mock Backend)

Currently, this project **does not use a real database**. All data is mocked and served from the `src/lib/data.ts` file. This was done to allow for rapid frontend development and prototyping.

- **`allUsers`**: An array of user objects that acts as the user database.
- **`allResults`**: An object containing academic results, keyed by student registration ID.
- **Other exports**: Mock data for announcements, fees, calendar events, etc.

When you need to make changes to the data (e.g., add a user, change a result), you will edit this file directly.

### 2. Integrating a Real Backend (e.g., Node.js/Express)

This project is structured to make integrating a real backend straightforward.

**To switch from the mock data to a real API:**

1.  **Build your API**: Your backend developer can create a Node.js/Express (or any other) server that exposes API endpoints (e.g., `/api/users/:id`, `/api/announcements`).

2.  **Modify Frontend Pages**: Go into the page components (e.g., `src/app/parstud/profile/page.tsx`) and replace the mock data imports with `fetch` calls to your new API.

    **Before (using mock data):**
    ```typescript
    import { allUsers } from '@/lib/data';

    // Find user from the local array
    const user = allUsers.find(u => u.regId === regId);
    ```

    **After (using a real API):**
    ```typescript
    // Fetch user from your backend API
    const response = await fetch(`https://your-api-url.com/api/users/${regId}`);
    const user = await response.json();
    ```

    This change can be made on a page-by-page basis, allowing for a gradual transition from the mock data to a live backend.

### 3. Adding or Modifying Pages

- **To add a new page**, create a new folder within the appropriate role directory (e.g., `src/app/parstud/new-page/`) and add a `page.tsx` file inside it.
- **To modify an existing page**, locate its `page.tsx` file in the corresponding route directory.
- Next.js uses a file-based routing system, so the folder structure directly maps to the URL paths.

### 4. Styling and Components

- **Styling**: All styling is done with Tailwind CSS utility classes.
- **Components**: The project heavily utilizes components from **ShadCN/UI**. Before building a new component from scratch, check the `src/components/ui/` directory to see if a suitable one already exists (e.g., `<Card>`, `<Button>`, `<Input>`). This ensures visual consistency across the application.
- **Colors & Theme**: The application's color palette is defined in `src/app/globals.css` using CSS variables. To change the primary color or background, you can edit the HSL values in the `:root` block.
```css
:root {
  --background: 206 86% 94%;
  --primary: 207 82% 71%;
  --accent: 261 44% 66%;
  /* ...etc */
}
```

This documentation should serve as a solid foundation for any developer joining the project.

---
## File Reference

Here is a comprehensive list of all files in the project and their purpose, ensuring full transparency.

### Root Directory
- `README.md`: This file. The main documentation for the project.
- `.gitignore`: Specifies which files and folders should be ignored by Git (e.g., `node_modules`, `.next`).
- `next.config.ts`: Configuration file for the Next.js framework. Used to set options like `devIndicators`.
- `package.json`: Lists all the project's `npm` dependencies and defines scripts like `dev`, `build`, and `start`.
- `components.json`: Configuration file for the `ShadCN/UI` component library.
- `tailwind.config.ts`: Configuration file for Tailwind CSS, including theme extensions and colors.
- `tsconfig.json`: The configuration file for the TypeScript compiler, defining rules for type checking and path aliases (like `@/*`).
- `apphosting.yaml`: Configuration file for deploying the application on Firebase App Hosting.

### `src/app` - Core Application
- `globals.css`: Contains global styles, Tailwind CSS layer definitions, and the application's color theme variables for both light and dark modes.
- `layout.tsx`: The root layout for the entire application. It sets up the main HTML structure, fonts, and the `Toaster` component for notifications.
- `page.tsx`: The entry point of the application. This is the main login page where users sign in or view results as a guest.

### `src/app/(roles)` - Role-Based Routes
- `admin/`, `parstud/`, `staff/`: These folders contain the pages specific to each user role.
  - `layout.tsx`: A layout file within each role's folder that wraps all pages for that role. It typically calls `DashboardLayout`.
  - `page.tsx`: The main dashboard/homepage that a user sees after logging in.
  - `profile/page.tsx`: The user profile page.
  - `announcements/page.tsx`: A page to view announcements.
  - `support/page.tsx`: A page to view support chat channels.
  - `support/[id]/page.tsx`: The actual chat interface for a specific conversation.
- **Note**: The `parstud` folder contains additional pages like `results`, `fees`, and `calendar`.

### `src/components` - Reusable Components
- `dashboard-layout.tsx`: A crucial component that provides the main structure for all authenticated pages. It includes the top navigation bar, the user profile dropdown, notifications, and the mobile bottom navigation.
- `ui/`: This directory holds all the reusable, low-level UI components provided by ShadCN/UI (e.g., `Button`, `Card`, `Input`, `Dialog`).

### `src/hooks` - Custom React Hooks
- `use-toast.ts`: A custom hook for triggering toast notifications throughout the application.
- `use-mobile.tsx`: A utility hook that detects if the application is being viewed on a mobile-sized screen.

### `src/lib` - Libraries and Utilities
- `data.ts`: **The mock backend**. This file contains all the sample data (users, results, announcements, etc.) that the application currently uses.
- `utils.ts`: A utility file containing the `cn` function, which merges CSS classes from Tailwind CSS and `clsx`.
- `placeholder-images.json` & `placeholder-images.ts`: These files manage the data for placeholder images used throughout the application, ensuring consistency.

This breakdown covers every file and its role, confirming that there is no hidden or extraneous code. The entire project is structured to be as straightforward and maintainable as possible.
