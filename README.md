# Rohit Rathod - Personal Developer Portfolio

A modern, high-performance, dynamic developer portfolio and private administration system built with **React**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth & Storage)**.

Designed with inspiration from clean, premium dark-mode developer interfaces with electric blue accents, responsive layouts, and full database-driven CRUD functionality.

---

## 🌟 Key Highlights & Features

### 1. Public Portfolio Website
- **Hero Section**: Premium typography-driven hero (no photo required), showcasing Rohit's identity as an *Aspiring Full-Stack Web Developer* and *B.Sc. Computer Science student*.
- **About Me**: In-depth story covering academic journey (GFGC Noubad, Bidar), current learning focus, career goals, and known languages (Hindi, Kannada, English).
- **Dynamic Skills**: Responsive cards with proficiency progress indicators and status badges (*Completed* vs *Currently Learning*).
- **Education Section**: Clean qualification timeline showcasing *B.Sc. Computer Science (2025–2028)* and *2nd PUC Science (Completed in 2025)*.
- **Projects Section**: Live showcases with direct URLs, technology tags, and transparent *AI-assisted* attribution for:
  - **US FOREVER** (Fashion / E-commerce): [https://rohitrathod0543-arch.github.io/usforever/](https://rohitrathod0543-arch.github.io/usforever/)
  - **RR Games** (Gaming Website): [https://rohitrathod0543-arch.github.io/game-s/](https://rohitrathod0543-arch.github.io/game-s/)
  - **INSPIRA Hotel** (Hotel / Resort Website): [https://inspira-stay-flow.base44.app](https://inspira-stay-flow.base44.app)
  - **Moonlight Cafe & Restro** (Restaurant Website): [https://moonlight-dine-spot.base44.app](https://moonlight-dine-spot.base44.app)
- **Certificates Section**: Verifiable credential records with credential IDs, verification links, and professional empty-state fallback.
- **Resume Section**: Direct *View Resume* and *Download Resume* buttons with safe fallbacks and summary highlights.
- **Interactive Contact Form**: Direct client-to-database submission saving inquiries securely for admin review.
- **Zero 404 Routing**: Uses `HashRouter` ensuring seamless refreshes on GitHub Pages (`/rohitrathodportfolio/#/`).

### 2. Private Admin Dashboard (`#/admin`)
- **Secure Supabase Authentication**: Protected routes with session validation.
- **Live Statistics Overview**: Total projects, skills, certificates, education entries, and unread contact inquiries.
- **Full CRUD Management**:
  - **Manage Profile**: Edit personal info, bio, career goals, email, and social URLs.
  - **Manage Skills**: Add, edit, delete skills, alter proficiency levels, learning status, icons, and order.
  - **Manage Education**: Add, edit, delete academic entries.
  - **Manage Projects**: Add, edit, delete projects, upload screenshot images, set live links, and toggle publish/unpublish visibility.
  - **Manage Certificates**: Add, edit, delete certificates, upload documents/PDFs, and manage verification links.
  - **Manage Resume**: Upload new PDF resumes, replace existing ones, update display filenames, or delete.
  - **Contact Messages**: Read received inquiries, mark as read/unread, and delete spam.
  - **Settings & Guides**: In-app schema guides, environment status, and deployment commands.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: `react-router-dom` (HashRouter for GitHub Pages zero-configuration compatibility)
- **Styling**: Tailwind CSS v4, custom glassmorphism, responsive grid & flexbox
- **Icons**: Lucide React
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Auth**: Supabase Authentication (Email + Password)
- **Storage**: Supabase Storage (`portfolio-assets` bucket)

---

## 🚀 Getting Started in Visual Studio Code

### Step 1: Clone or Download & Extract
Open the project directory in VS Code:
```bash
cd rohitrathodportfolio
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root by copying `.env.example`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials (see below):
```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
VITE_BASE_PATH="/rohitrathodportfolio/"
```

> **Note**: Even without Supabase credentials configured immediately, the app will run in **Local Preview Mode** with initial seed data so you can test all features right away!

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Backend Setup (5 Minutes)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, name it `rohit-portfolio`, and set a database password.
3. Once provisioned, navigate to **Project Settings** > **API**.
4. Copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **Project API Keys (anon / public)** -> `VITE_SUPABASE_ANON_KEY`
5. Paste these into your local `.env` file.

### 2. Execute Database Schema & RLS Policies
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of `supabase/schema.sql` from this repository.
4. Paste it into the SQL editor and click **Run**.
5. This automatically:
   - Creates `admin_users`, `profile`, `skills`, `education`, `projects`, `certificates`, and `contact_messages` tables.
   - Configures strict **Row Level Security (RLS)** policies ensuring public visitors can only read published portfolio content and submit contact messages.
   - Creates the `portfolio-assets` storage bucket with public read and authenticated admin write permissions.
   - Seeds all of Rohit's initial skills, projects, education, and profile data!

### 3. Create Admin User
1. In the Supabase dashboard, click **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter:
   - Email: `rohitrathod0543@gmail.com`
   - Password: Choose a strong password.
4. Click **Create User**, then copy the generated **User UID** (UUID).
5. Go back to **SQL Editor** and run:
   ```sql
   INSERT INTO public.admin_users (id, email)
   VALUES ('PASTE_YOUR_COPIED_UUID_HERE', 'rohitrathod0543@gmail.com');
   ```
6. You can now log into your private admin dashboard at `http://localhost:3000/#/admin/login` using this email and password!

---

## 🌐 Deploying to GitHub Pages

This app is pre-configured with `base: '/rohitrathodportfolio/'` in production and `HashRouter`, meaning it will never trigger 404 errors when visitors refresh pages.

### Method 1: Using `gh-pages` (Recommended)

1. Initialize your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Rohit Rathod portfolio"
   git remote add origin https://github.com/rohitrathod0543-arch/rohitrathodportfolio.git
   git branch -M main
   git push -u origin main
   ```

2. Build the production application:
   ```bash
   npm run build
   ```

3. Deploy to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```

4. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, ensure the source is set to **Deploy from a branch** -> branch: `gh-pages`, folder: `/ (root)`.
   - Your website will be live at:
     `https://rohitrathod0543-arch.github.io/rohitrathodportfolio/`

---

## 📁 Project Structure

```
rohitrathodportfolio/
├── index.html                  # HTML entry point with fonts & metadata
├── metadata.json               # App metadata
├── package.json                # Project dependencies
├── vite.config.ts              # Vite configuration with base path & alias
├── tsconfig.json               # TypeScript compiler options
├── .env.example                # Example environment variables
│
├── supabase/
│   └── schema.sql              # Complete PostgreSQL schema, RLS policies & seeds
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # HashRouter setup & route definitions
│   ├── index.css               # Tailwind CSS & custom styling
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for all entities
│   │
│   ├── services/
│   │   ├── initialData.ts      # Seed data constants for Rohit Rathod
│   │   └── supabase.ts         # Supabase client, Auth, and fallback layer
│   │
│   ├── utils/
│   │   └── icons.tsx           # Lucide icon mapping and exports
│   │
│   ├── components/             # Public portfolio sections
│   │   ├── Navbar.tsx          # Top navigation with mobile drawer
│   │   ├── Hero.tsx            # Text-based hero with CTAs
│   │   ├── About.tsx           # Biography, learning journey & goals
│   │   ├── Skills.tsx          # Dynamic skills cards with categories
│   │   ├── Education.tsx       # Timeline cards for B.Sc. & PUC
│   │   ├── Projects.tsx        # Live project showcases with AI badges
│   │   ├── Certificates.tsx    # Verifiable certificates & empty state
│   │   ├── Resume.tsx          # Resume view/download & profile summary
│   │   ├── Contact.tsx         # Working contact form & direct channels
│   │   └── Footer.tsx          # Clean footer with quick links
│   │
│   ├── pages/
│   │   ├── Home.tsx            # Public portfolio single-page application
│   │   ├── AdminLogin.tsx      # Secure admin authentication page
│   │   └── AdminDashboard.tsx  # Private admin dashboard portal
│   │
│   └── admin/                  # Admin management modules
│       ├── SkillsManager.tsx       # Skills CRUD & proficiency
│       ├── ProjectsManager.tsx     # Projects CRUD & image upload
│       ├── EducationManager.tsx    # Education CRUD
│       ├── CertificatesManager.tsx # Certificates CRUD & uploads
│       ├── ResumeManager.tsx       # Resume PDF manager
│       ├── MessagesManager.tsx     # Contact inbox & reader
│       ├── ProfileManager.tsx      # Profile & social links editor
│       └── SettingsManager.tsx     # Database connection & guides
```

---

## 🔒 Security Best Practices

1. **Row Level Security (RLS)**: Enforced directly on PostgreSQL. Public visitors can never modify database tables or read private contact submissions.
2. **Public Key Safety**: Only the browser-safe `VITE_SUPABASE_ANON_KEY` is used in frontend code. The `service_role` key is never exposed.
3. **Admin Verification**: Authorization checks query the server-side `admin_users` table with `auth.uid() = id`.
4. **Storage Policies**: Public users have read-only access to portfolio assets; file upload and deletion require authenticated admin access.

---

## 📄 License
Created for Rohit Rathod. All rights reserved.
