# Our Story 🤎 — 1 Year Anniversary Timeline

A romantic, handcrafted anniversary timeline website built with Next.js App Router and React.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Run Locally

```bash
# Navigate to the project directory
cd anniversary-timeline

# Install dependencies (already done if you just scaffolded)
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static site will be exported to the `out/` folder, ready for deployment on Vercel, Netlify, or any static host.

---

## 📁 Folder Structure

```
anniversary-timeline/
├── app/
│   ├── components/
│   │   └── TimelineItem.js    # Individual timeline card with scroll animation
│   ├── globals.css            # Theme colors, fonts, animations, custom scrollbar
│   ├── layout.js              # Root layout with Google Fonts (Playfair Display + Lato)
│   └── page.js                # Main page: Hero + Timeline
├── lib/
│   └── memories.js            # Hardcoded timeline data (16 entries)
├── public/
│   └── images/
│       ├── 01.jpg             # Timeline photos (01.jpg through 16.jpg)
│       ├── 02.jpg
│       ├── ...
│       └── 16.jpg
├── next.config.mjs            # Next.js config with static export
└── package.json
```

---

## 🖼️ Adding Your Photos

1. Replace the placeholder images in `/public/images/` with your actual photos.
2. Keep the filenames exactly as `01.jpg` through `16.jpg` (matching the order in `lib/memories.js`).
3. Recommended image size: **800x600px or larger** (4:3 aspect ratio looks best).
4. Rebuild or restart the dev server to see your photos.

---

## 🎨 Customization

- **Colors**: Edit the hex values in `app/globals.css` and `app/layout.js`.
- **Memories**: Update the array in `lib/memories.js` with your own dates, titles, and messages.
- **Fonts**: Already loaded from Google Fonts (Playfair Display + Lato).

---

## 🌐 Deploy on Vercel

The easiest way to deploy:

```bash
npx vercel --prod
```

Or drag the `out/` folder to [vercel.com](https://vercel.com) after running `npm run build`.

---

Made with 🤎 for your 1-year anniversary.
