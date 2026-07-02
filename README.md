# Artius Ltd — Website

A clean, fast, **no-build static website** (plain HTML + CSS + JavaScript).
No frameworks, no install step. Open it in a browser and it just works.

---

## 1. Pages

| File            | Page                                                        |
|-----------------|-------------------------------------------------------------|
| `index.html`    | Home — hero, intro, what we do, featured projects, founder  |
| `about.html`    | About — story, mission & vision, values, founder's message  |
| `projects.html` | Projects — Bali Arcade, Chef's Terminal, Lazzat, AVW Rosalida |
| `contact.html`  | Contact — info + contact form + map                         |
| `careers.html`  | Careers — open roles + job application form                 |

Supporting files: `css/styles.css` (all design), `js/main.js` (all behaviour),
`images/` (the founder photo placeholder lives here).

---

## 2. Preview it on your computer

**Easiest:** double-click `index.html` to open it in your browser.

**Better (recommended), with a local server** — open a terminal in this folder and run:

```bash
npx serve
```

Then open the address it shows (e.g. `http://localhost:3000`). A server makes
the forms and everything behave exactly like the live site.

---

## 3. Replace the placeholder content

Everything in **[square brackets]** and every placeholder image is meant to be
replaced. Search the project for these and swap in the real details:

### Text to replace
- **`[Founder's Name]`** — in `about.html` (and the founder section).
- **`[City, Country]`** and **`[Year]`** — in `projects.html` and `careers.html`.
- **Email** `hello@artiusltd.com` and **`careers@artiusltd.com`** — replace everywhere
  (appears in the footer of every page, on `contact.html`, and `careers.html`).
- **Phone** `+880 0000-000000` — replace everywhere.
- **Address** `123 Example Avenue, City, Country` — replace everywhere.
- **Mission, vision, values, project descriptions** — edit freely in `about.html`
  and `projects.html`. The sample text is professional but generic; make it yours.
- **Stats** on the home page (`4+`, `100%`, `50+`, `10+`) — edit in `index.html`.
- **Open roles** — edit/add/remove the job cards in `careers.html`.

### Images to replace
Wherever you see a striped tile that says **“PHOTO NEEDED”** with a short
description — that description tells you exactly what photo to supply there
(e.g. “Bali Arcade — main floor, wide shot”). To fill one in:

1. Put the photo in the `images/` folder (e.g. `images/bali-arcade.jpg`).
2. In the HTML, replace the whole `<div class="ph">…</div>` block with:
   `<img src="images/bali-arcade.jpg" alt="Bali Arcade main floor" loading="lazy" />`
   (Or just ask Claude to do it — say which photo goes where.)

Already in place: the founder photo (`images/founder.jpg`) and the Lazzat and
Chef's Terminal logos. (The home page hero is now big text on dark — no image
needed there. `images/artius-hero.svg` is kept in the folder in case you want
it elsewhere.)
- **Logo:** the site logo is text (“ARTIUS LTD”). If you have a logo image,
  tell Claude and it can be swapped in.

### Brand colors
Open `css/styles.css` and edit the values at the very top under `:root`
(e.g. `--accent: #d2552a;`). Changing those re-skins the whole site.
Current theme — "Light & minimal" (decorsystems-inspired): white / off-white
`#f4f2ed` base with a subtle ember accent `#d2552a`; fonts Space Grotesk
(headings) + Inter (body); sharp (square) corners.

---

## 4. How your client receives responses (the “backend”)

This site is static (no server to maintain, nothing to pay for). Form
submissions are delivered by **Web3Forms**, a free relay service:

```
Visitor fills form  →  Web3Forms (free)  →  Email arrives in the client's inbox
```

- **Contact form** → each enquiry arrives as an email (name, email, phone,
  topic, message).
- **Job applications** → each application arrives as an email (name, email,
  phone, position, message, **CV link**). Applicants paste a Google Drive /
  Dropbox / LinkedIn link to their CV — this works fully on the free plan
  (file attachments would need a paid plan).
- Spam is filtered by a hidden honeypot field (already built in).
- Free plan allows **250 submissions per month** — plenty for this site.

### One-time activation (5 minutes)
1. Go to **https://web3forms.com** and enter the email address that should
   RECEIVE submissions (your client's business email is best).
2. They instantly send an **Access Key** to that email — copy it.
3. Open `contact.html` and `careers.html`, find this line in each form:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
   and replace `YOUR_WEB3FORMS_ACCESS_KEY` with the real key (2 places total).
   Or paste the key to Claude and ask it to insert it.
4. Test: submit the contact form once — the email should arrive within a minute.

> Until the key is added, forms run in **demo mode**: they show a success
> message but nothing is sent.

### If you ever outgrow email
If the client later wants submissions in a spreadsheet or dashboard, Web3Forms
supports webhooks (e.g. auto-log every submission to Google Sheets) — ask
Claude to set that up when needed. A custom database backend is not
recommended for this site: it would add hosting costs and maintenance for no
real benefit at this scale.

---

## 5. Set the map location (Contact page)

In `contact.html`, find the `<iframe ... src="https://www.google.com/maps?q=...">`.
On Google Maps, find your location → **Share** → **Embed a map** → copy the `src`
and paste it in. (The current one points to a default city.)

---

## 6. Publish the draft with GitHub + Vercel (recommended, free)

This gives you a live link like `artius-website.vercel.app` to send to the
client, and every time you update the files the site updates automatically.

### Part A — put the site on GitHub (one time, ~10 min)
1. Go to **https://github.com/signup** and create a free account
   (use your normal email; pick any username).
2. Once logged in, click the **+** button (top-right) → **New repository**.
3. Repository name: `artius-website`. Keep it **Public**. Do NOT tick any
   checkboxes. Click **Create repository**.
4. On the next page click the small link **"uploading an existing file"**.
5. Open your project folder (`C:\1.Naimur Rahman\Artius website`) in File
   Explorer. Select **everything** (Ctrl+A) and **drag it onto the GitHub
   upload page**. Wait for all files to show.
   *(If dragging folders doesn't work in your browser: drag the loose files
   first, commit, then open the `css`, `js`, `images` folders one by one and
   upload their files via **Add file → Upload files**, typing the folder name
   in the filename box like `css/styles.css`.)*
6. Click the green **Commit changes** button. Done — your code is on GitHub.

### Part B — connect Vercel (one time, ~5 min)
1. Go to **https://vercel.com/signup** → choose **Continue with GitHub** →
   authorize it. (No credit card needed — the free "Hobby" plan is enough.)
2. You land on the dashboard. Click **Add New… → Project**.
3. You'll see your `artius-website` repository → click **Import**.
4. Change nothing (Vercel auto-detects a static site). Click **Deploy**.
5. Wait ~30 seconds → you get a live URL like
   **https://artius-website.vercel.app** 🎉
6. Send that link to the client with the feedback checklist
   (`CLIENT-CHECKLIST.md`).

### Part C — updating the site later
1. Edit files on your computer (or ask Claude to).
2. Go to your repository on github.com → **Add file → Upload files** → drag
   the changed files → **Commit changes**.
3. Vercel notices automatically and redeploys in ~30 seconds. Same link,
   new version. Nothing else to do.

### Part D — when the client approves: connect ARTIUSLTD.com
1. In Vercel: your project → **Settings → Domains** → type `artiusltd.com`
   → **Add**.
2. Vercel shows you 1–2 DNS records (an `A` record and/or `CNAME`).
3. Log in where the domain was purchased (GoDaddy/Namecheap/etc.) → DNS
   settings → add those records exactly.
4. Wait up to a few hours — then the real domain is live with free HTTPS.

---

## 6b. Alternative: put it online without GitHub (fastest)

Any static host works. Two easy options:

**Netlify (drag & drop — no account skills needed):**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page. It's live in seconds on a temporary URL.
3. Create a free account to keep it, then connect your domain `ARTIUSLTD.com`
   under **Domain settings**.

**Vercel / GitHub Pages** also work the same way (all free for a site like this).

Once hosted, point your `ARTIUSLTD.com` domain's DNS to the host (each provider
shows the exact records to add).

---

## 7. Quick go-live checklist

- [ ] Replace founder name, photo, and message
- [ ] Fill in real mission / vision / values
- [ ] Add real project locations, years, descriptions and photos
- [ ] Replace email, phone, and address everywhere
- [ ] Update social media links (footer — currently `#`)
- [ ] Add your Web3Forms access key to both forms
- [ ] Set the real Google Map location
- [ ] Update the open job roles
- [ ] Deploy and connect `ARTIUSLTD.com`

---

Built as a static site for easy hosting and simple handoff. Questions about any
step above — just ask.
