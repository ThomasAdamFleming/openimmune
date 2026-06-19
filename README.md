# OpenImmune website

A static website for OpenImmune: plain HTML, CSS, and a small amount of
JavaScript, with no build step and no framework. It is designed to be hosted on
GitHub Pages at the apex domain **openimmune.ai**.

The site is deliberately high-level and qualitative. It carries no figures,
molecule names, assays, timelines, funding amounts, or partner and funder names,
in line with the programme's public-facing discipline.

---

## What is in here

```
openimmune/
  index.html          Home: problem, objective, solution, funding, contact
  about.html          What OpenImmune is, the FRO model, leadership
  contact.html        Contact form (Formspree)
  404.html            Custom not-found page
  styles.css          The full design system (tokens grouped at the top)
  script.js           Header, mobile nav, scroll reveals, form handling
  CNAME               Custom domain for GitHub Pages (openimmune.ai)
  .nojekyll           Tells Pages to serve files as-is
  robots.txt          Allows indexing, points to the sitemap
  sitemap.xml         The three public URLs
  assets/
    aperture.svg          Primary brand mark (the aperture)
    favicon.svg           Scalable favicon
    favicon.ico           Multi-resolution icon
    favicon-16.png        Favicons
    favicon-32.png
    apple-touch-icon.png  Home-screen icon (180px)
    icon-192.png          PWA-sized icons
    icon-512.png
    field.svg             Point field used behind the hero
    field-soft.svg        Sparser field for sub-pages
    og-image.png          1200x630 social share image
```

---

## Preview it locally

From inside the `openimmune` folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Fonts load from Google Fonts, so you need an
internet connection for the type to render as intended.

---

## Deploy to GitHub Pages

1. Create a repository named **openimmune** under the GitHub account
   **ThomasAdamFleming**.
2. Put the contents of this folder at the **root** of that repository (so
   `index.html` sits at the top level, not inside a sub-folder), then commit and
   push to the `main` branch.
3. In the repository, go to **Settings, then Pages**. Under **Build and
   deployment**, set **Source** to **Deploy from a branch**, choose the `main`
   branch and the `/ (root)` folder, and save.
4. Under **Settings, then Pages, then Custom domain**, enter **openimmune.ai**
   and save. The `CNAME` file in this repository already sets this; GitHub will
   verify it against your DNS (next section).
5. Once the domain verifies, tick **Enforce HTTPS**. A certificate can take up to
   an hour to be issued the first time.

---

## DNS for openimmune.ai

Set these records with whoever manages the openimmune.ai domain. The four A
records point the apex at GitHub Pages; the CNAME points the `www` sub-domain to
your Pages host.

| Type  | Host / Name | Value                      |
|-------|-------------|----------------------------|
| A     | @           | 185.199.108.153            |
| A     | @           | 185.199.109.153            |
| A     | @           | 185.199.110.153            |
| A     | @           | 185.199.111.153            |
| CNAME | www         | thomasadamfleming.github.io |

DNS changes can take from a few minutes to a day to take effect. To check the
apex once it has propagated:

```bash
dig openimmune.ai +noall +answer
```

You should see the four GitHub addresses above.

---

## The contact form (one step to switch it on)

The form on `contact.html` uses [Formspree](https://formspree.io). Right now it
is built but not connected, because Formspree needs a form to be created in their
dashboard first. The email address you gave (tomfleming@gmail.com) is the
**destination** that submissions are delivered to; it is not what goes in the
page.

To connect it:

1. Sign in at https://formspree.io and create a new form, set to deliver to
   **tomfleming@gmail.com**.
2. Formspree gives you an endpoint that looks like
   `https://formspree.io/f/abcwxyz`.
3. Open `contact.html`, find the `<form ... id="contactForm" action="">` line,
   and paste your endpoint into the empty `action=""`, so it reads
   `action="https://formspree.io/f/abcwxyz"`.

That is the only change needed. The form then works with and without JavaScript:
with it, messages send in the background and a confirmation appears in place;
without it, the browser posts to Formspree directly.

When a dedicated OpenImmune email address exists later, point the Formspree form
at that address; no change to the site is needed.

---

## Copy written for the site (please review)

Everything below was written for the website and is not lifted verbatim from the
project files, so it is worth a read-through. All of it follows house style
(British English, no em-dashes, no banned vocabulary) and the public-facing
rules (no figures, molecule, assays, timelines, amounts, or partner and funder
names). Two load-bearing choices to confirm:

- The openness language is **"released openly"** throughout, rather than "free to
  use" or "no paywall", which leaves room for an exclusivity period.
- The ambition and the larger second phase are conveyed without stating that the
  next phase is industry-funded and without any amounts.

**Home**
- Hero headline: "The immune system decides whether a medicine works."
- Hero lead, and section headings: "Powerful medicines, an unpredictable
  response", "One general way to predict immune response", "A build no one would
  do alone", "Built as a public good, funded as one", "Work with us".
- Solution cards: "An unprecedented dataset", "A coalition of capabilities",
  "Open by design", each with a short paragraph.
- The problem, objective, and funding paragraphs.

**About**
- Hero: "Making the immune response to medicines predictable".
- Sections: "What OpenImmune is", "A Focused Research Organisation", and
  "Leadership" with the heading "The people behind it".
- Leadership entries for Tom Fleming (Founder and CEO), Dr Timothy Hickling, Dr
  Trevor Howe, Oxana Polyakova, and Dr Chris Thorpe, each described by function
  with no board or chair titles. Arctoris is named only in Tom's biography.

**Contact**
- "Get in touch", with a one-line lead and four interest areas (partnership,
  funding, research, media).

**404**
- "Signal lost." with a short line back to the home page.

**Footer (every page)**
- "An open, neutrally funded, UK-led effort to make the immune response to
  medicines predictable, for everyone."

**Page titles and descriptions** (used by search engines and link previews) are
in the `<head>` of each page and are also qualitative.

---

## Editing it later

- **Words.** All copy lives directly in the HTML files, in plain sentences. Edit
  the text between the tags; no template language to learn.
- **Colours.** Open `styles.css`. The palette is at the very top under
  `1. DESIGN TOKENS` as named values (for example `--aurora`, `--void`,
  `--starlight`). Change a value once and it updates everywhere.
- **Type and sizes.** Also under the tokens block: `--font-display`,
  `--font-body`, `--font-mono`, and the `--fs-*` scale. The fonts are loaded by
  the `<link>` in each page `<head>`.
- **Motion.** The entrance, drift, and reveal timings are in `styles.css` under
  `15. MOTION`. Reduced-motion preferences are respected automatically.
- **The leadership grid.** In `about.html`, each person is one `<article
  class="member">` block. The round monogram is the two-letter `<span
  class="avatar">`; to use a photograph instead, replace that span with an
  `<img>` of the same size.
- **The share image.** `assets/og-image.png` is what appears when the site is
  shared. Replace the file (keep it 1200x630) to change it.

---

OpenImmune is a UK-led, not-for-profit Focused Research Organisation. This
repository holds its public website only.
