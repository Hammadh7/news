# News Dholi - Complete User Guide

Welcome! This guide will help you manage your news website. You don't need any technical knowledge to publish articles.

---

## Table of Contents

1. [Quick Start - Publishing Your First Article](#quick-start)
2. [Accessing the Admin Panel](#admin-panel)
3. [Writing and Publishing Articles](#writing-articles)
4. [Adding Images to Articles](#adding-images)
5. [Editing Existing Articles](#editing-articles)
6. [Deleting Articles](#deleting-articles)
7. [Understanding Sections](#sections)
8. [Featured and Breaking News](#featured-and-breaking)
9. [Language Support](#languages)
10. [Deployment Guide](#deployment)
11. [Changing the Admin Password](#password)
12. [Google Ads Setup (Future)](#google-ads)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start - Publishing Your First Article {#quick-start}

1. Open your website URL and go to `/admin` (e.g., `https://yoursite.com/admin`)
2. Enter the admin password (default: `admin123` — **change this!**)
3. Click **"New Article"**
4. Fill in:
   - **Title**: Your headline
   - **Content**: Write your article
   - **Section**: Pick a category (India, World, Sports, etc.)
5. Click **"Publish"**
6. That's it! Your article is now live.

---

## Accessing the Admin Panel {#admin-panel}

### How to Open
- Go to: `https://your-website-url.com/admin`
- Enter your admin password
- You'll see your dashboard with all articles

### Dashboard Overview
- **Total Articles**: How many articles are published
- **Articles List**: All your articles with title, section, date
- **Quick Actions**: Buttons to create new articles, edit, or delete

---

## Writing and Publishing Articles {#writing-articles}

### Step-by-Step

1. From the admin dashboard, click **"+ New Article"**
2. Fill in the form:

| Field | What to Write | Required? |
|-------|--------------|-----------|
| **Title** | Your main headline | Yes |
| **Subtitle** | A one-line summary below the headline | No |
| **Author** | Writer's name (defaults to "Staff Reporter") | No |
| **Section** | Pick from dropdown: India, World, Politics, etc. | Yes |
| **Tags** | Keywords separated by commas (e.g., `economy, budget, tax`) | No |
| **Image** | Upload a photo (click or drag & drop) | No |
| **Image Caption** | Description of the photo | No |
| **Content** | The full article text | Yes |
| **Featured** | Toggle ON to show on homepage hero section | No |
| **Breaking News** | Toggle ON to show in the breaking news ticker | No |

### Writing Tips

Your article content supports **Markdown formatting**. Here's a quick guide:

```
# Big Heading
## Smaller Heading
### Even Smaller Heading

**Bold text** for emphasis
*Italic text* for names or titles

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered list item 1
2. Numbered list item 2

> This creates a quote block

---  (this creates a horizontal line)

[Link text](https://example.com) for hyperlinks
```

### Auto-Save
Your draft is automatically saved in your browser. If you accidentally close the tab, your work will still be there when you come back.

---

## Adding Images to Articles {#adding-images}

### How to Upload
1. In the article editor, find the **Image** section
2. Either:
   - **Click** the upload area to browse your files, OR
   - **Drag and drop** an image file onto the upload area
3. Wait for the upload to complete (you'll see a preview)
4. Add an **Image Caption** to describe the photo

### Image Tips
- Use **JPG or PNG** files
- Images should be at least **1200 pixels wide** for best quality
- Keep file size under **5 MB**
- Always add a caption — it helps with SEO and accessibility

---

## Editing Existing Articles {#editing-articles}

1. Go to the admin dashboard (`/admin`)
2. Find the article in the list
3. Click the **"Edit"** button
4. Make your changes
5. Click **"Update"**

---

## Deleting Articles {#deleting-articles}

1. Go to the admin dashboard (`/admin`)
2. Find the article in the list
3. Click the **"Delete"** button
4. Confirm the deletion

> **Warning**: Deleted articles cannot be recovered!

---

## Understanding Sections {#sections}

Your website has these news sections:

| Section | What Goes Here |
|---------|---------------|
| **India** | National news, domestic affairs |
| **World** | International news, global events |
| **Politics** | Political news, elections, government |
| **Business** | Economy, markets, corporate news |
| **Technology** | Tech news, startups, digital |
| **Sports** | All sports except cricket |
| **Entertainment** | Bollywood, Hollywood, TV, music |
| **Opinion** | Editorials, columns, op-eds |
| **Science** | Scientific discoveries, space, research |
| **Health** | Medical news, health tips, wellness |
| **Culture** | Arts, culture, lifestyle, festivals |
| **States** | State-level news from across India |
| **Cricket** | Dedicated cricket section (IPL, international) |

---

## Featured and Breaking News {#featured-and-breaking}

### Featured Articles
- Toggle **"Featured"** ON when creating/editing an article
- Featured articles appear in the large hero section on the homepage
- **Tip**: Keep 2-3 articles as featured at most

### Breaking News
- Toggle **"Breaking News"** ON for urgent, developing stories
- Shows a red ticker banner at the top of the website
- **Important**: Turn OFF breaking news once the story is no longer urgent
- Too many breaking stories dilute the impact — use sparingly!

---

## Language Support {#languages}

Your website supports **12 Indian languages**:

English, Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Bengali (বাংলা), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Urdu (اردو)

### How It Works
- Readers can switch languages using the language dropdown in the header
- The website UI (navigation, buttons, labels) translates automatically
- **Note**: Article content stays in the language you wrote it in. The language switcher translates the website interface only.

---

## Deployment Guide {#deployment}

### Deploying on Vercel (Recommended)

1. Create a free account at [vercel.com](https://vercel.com)
2. Push your code to GitHub:
   ```
   git add .
   git commit -m "Initial site"
   git push
   ```
3. In Vercel, click **"Import Project"**
4. Select your GitHub repository
5. Set **Environment Variables**:
   - `ADMIN_PASSWORD` = your chosen password
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g., `https://daily-chronicle.vercel.app`)
6. Click **Deploy**
7. Your site is live!

### Deploying on Netlify

1. Create a free account at [netlify.com](https://netlify.com)
2. Push your code to GitHub
3. In Netlify, click **"New site from Git"**
4. Select your repository
5. Build settings should auto-detect. If not:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables (same as Vercel)
7. Install the **Next.js plugin** from Netlify plugins
8. Deploy!

### Custom Domain
Both Vercel and Netlify let you add a custom domain (like `dailychronicle.in`):
1. Buy a domain from any registrar (GoDaddy, Namecheap, etc.)
2. In Vercel/Netlify settings, add your domain
3. Update DNS records as instructed
4. Your site will be live at your custom domain!

---

## Changing the Admin Password {#password}

### On Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `ADMIN_PASSWORD` to your new password
5. Redeploy (Vercel → Deployments → Redeploy)

### On Netlify
1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Update `ADMIN_PASSWORD`
5. Trigger a new deploy

> **Security Tip**: Use a strong password! At least 12 characters with letters, numbers, and symbols.

---

## Google Ads Setup (Future) {#google-ads}

When you're ready to monetize:

1. Sign up for [Google AdSense](https://adsense.google.com)
2. Get your Publisher ID (looks like `ca-pub-XXXXXXXXXX`)
3. Add it as an environment variable:
   - Name: `NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID`
   - Value: `ca-pub-XXXXXXXXXX`
4. In the site config, set `adsEnabled: true`
5. Redeploy the site
6. Ad placeholders throughout the site will start showing real ads

---

## Troubleshooting {#troubleshooting}

### "I can't log into the admin panel"
- Make sure you're using the correct password
- Check if the `ADMIN_PASSWORD` environment variable is set correctly
- Default password is `admin123`

### "My article isn't showing up"
- Make sure you clicked "Publish" (not just saved a draft)
- Refresh the homepage — articles appear immediately
- Check that the article has a title and content

### "Images aren't loading"
- Make sure the image uploaded successfully (you should see a preview)
- Use JPG or PNG format
- Keep images under 5 MB

### "The site looks broken"
- Try clearing your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if the deployment was successful on Vercel/Netlify

### Need Help?
Contact your developer for technical issues.

---

## Daily Workflow Checklist

Here's your recommended daily routine:

- [ ] Log into admin panel (`/admin`)
- [ ] Write your articles for the day
- [ ] Add images where needed
- [ ] Set 1-2 articles as **Featured**
- [ ] Mark urgent stories as **Breaking News**
- [ ] Review and publish
- [ ] Turn off "Breaking News" for old stories

That's it! Happy reporting!
