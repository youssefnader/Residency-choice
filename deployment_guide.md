# 🚀 AuraMedical Deployment Guide

Follow these steps to take your residency choice app from local testing to a live production environment.

---

## Part 1: Backend Setup (Supabase)

Supabase provides the real-time database that syncs choices across all doctors' screens.

1.  **Create an Account**: Sign up for a free account at [supabase.com](https://supabase.com).
2.  **New Project**: Create a new project named "AuraMedical". 
    *   Set a secure **Database Password** and save it.
    *   Choose a region close to your university.
3.  **Initialize Database**:
    *   In the Supabase dashboard, go to the **SQL Editor** (the `>_` icon in the left sidebar).
    *   Click **New Query**.
    *   Copy the contents of the [supabase_schema.sql](file:///e:/Antigravity%20Projects/The%20residency/supabase_schema.sql) file (found in your project root) and paste it into the editor.
    *   Click **Run**.
4.  **Get API Credentials**:
    *   Click the **Project Settings** (gear icon ⚙️ at the very bottom of the left sidebar).
    *   Click **API** in the sub-menu that appears.
    *   Look for the **Project API keys** section:
        *   **Project URL**: It looks like `https://xyzabc.supabase.co`. Copy this.
        *   **anon public**: It's a long string of letters. Copy this.

---

## Part 2: Frontend Deployment (GitHub & Vercel)

### Step 1: Create a GitHub Repository
Before Vercel can host your app, you need to upload it to GitHub.

1.  Log in to [github.com](https://github.com) and click the **+ (Plus)** icon in the top right > **New repository**.
2.  Name it `residency-choice` and click **Create repository**.
3.  In your terminal (inside your project folder `e:\Antigravity Projects\The residency`), run these commands:
    ```bash
    git init
    git add .
    git commit -m "Initialize residency app"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/residency-choice.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub name).*

### Step 2: Deploy to Vercel
Vercel is the easiest way to host Vite applications.

1.  **Prepare your Code**: Ensure your code is in a GitHub repository.
2.  **Sign in to Vercel**: Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3.  **Import Project**:
    *   Click **Add New** > **Project**.
    *   Select your "residency-choice" repository.
4.  **Configure Environment Variables**:
    *   This is the most important step! In the **Environment Variables** section, add:
        *   `VITE_SUPABASE_URL`: (The Project URL from Supabase)
        *   `VITE_SUPABASE_ANON_KEY`: (The anon public key from Supabase)
5.  **Deploy**: Click **Deploy**. Vercel will build your app and give you a public `xxx.vercel.app` URL.

---

## Part 3: Live Session Checklist

Before the actual residency selection begins:

1.  **Clear Test Data**: In Supabase SQL Editor, run `DELETE FROM profiles; DELETE FROM departments;` if you did any test imports.
2.  **Import Candidates**: Log in to your live URL, go to the **Admin** tab, and upload the final [candidates.xlsx](file:///e:/Antigravity%20Projects/The%20residency/candidates.xlsx).
3.  **Setup Specialties**: Add the departments and seat counts in the Admin dashboard.
4.  **Share the Link**: Send the Vercel URL to all your colleagues. They can now join as candidates and start the interactive selection!

---
> [!TIP]
> **Budget Note**: Both Supabase and Vercel have generous "Free Tiers" that should easily handle several hundred doctors concurrently for a few days.
