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
  index.html          Home: problem, why it matters, objective, solution, who it is for, funding, contact
  about.html          What OpenImmune is, the FRO model, leadership
  why-this-matters.html   Overview: the human case and the eight areas
  why-00-ai-moonshot.html      00  The AI moonshot (the capability)
  why-01-inflammatory-disease.html   01  Inflammatory disease
  why-02-haemophilia.html      02  Haemophilia and bleeding disorders
  why-03-rare-paediatric.html  03  Rare and paediatric disease
  why-04-cell-gene-oncology.html     04  Cell and gene therapy in oncology
  why-05-neurology-ms.html     05  Neurology and MS
  why-06-large-populations.html      06  Large-population areas
  why-07-vaccines.html         07  Vaccines (the inverted case)
  contact.html        Contact form (Web3Forms)
  thank-you.html      Confirmation page after a form post without JavaScript (noindex)
  404.html            Custom not-found page
  styles.css          The full design system (tokens grouped at the top)
  script.js           Header, mobile nav, dropdown, scroll reveals, kinetic headings, scroll progress, pointer effects, stat count-up, form handling
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

## The contact form

The form on `contact.html` posts to [Web3Forms](https://web3forms.com) at
`https://api.web3forms.com/submit`. It is live.

How it is wired:

- `access_key` is a hidden field in `contact.html`. It is **public by design**:
  it identifies the form, not the inbox, so it is safe in the page source.
- Delivery currently goes to **tomfleming@gmail.com**, which is set against the
  key in the Web3Forms dashboard. When a dedicated OpenImmune address exists,
  change the destination there; nothing in the repository needs editing.
- `subject` and `from_name` set how the message appears in the inbox. The
  enquirer's own address is used as the reply-to, so replying goes straight
  back to them.
- `botcheck` is a hidden checkbox honeypot. Web3Forms rejects any submission
  where it has been ticked, which only a bot would do.
- `redirect` points at `thank-you.html`, a `noindex` confirmation page in this
  repository. It is only used when JavaScript is unavailable.

The form works with and without JavaScript. With it, `script.js` sends the
message in the background, strips the `redirect` field, and reports success or
failure in place. Without it, the browser posts to Web3Forms and lands on
`thank-you.html`.

If the form ever stops working, check the access key first, then the Web3Forms
dashboard for the delivery address and the monthly submission allowance.

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
  response", "A common harm, and a fixable one", "One general way to predict
  immune response", "A build no one would do alone", "An open foundation, for
  the whole field", "Built as a public good, funded as one", "Work with us".
- Why it matters: three human dimensions ("The treatment that never arrives",
  "The treatment that is taken away", "An unfairness built into the tools"),
  kept qualitative with no figures, and a closing line: "We can already make
  medicines that give people their lives back. We just cannot yet tell whose
  body will let them keep it. OpenImmune is how we learn to tell, openly, for
  everyone."
- Who it is for: four short entries (patients, clinicians, developers,
  researchers).
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

**Why this matters (nine pages)**
- A "Why this matters" item in the main navigation opens a dropdown to an overview page and eight numbered area pages (00 the AI moonshot, 01 inflammatory disease, 02 haemophilia and bleeding disorders, 03 rare and paediatric disease, 04 cell and gene therapy in oncology, 05 neurology and MS, 06 large-population areas, 07 vaccines).
- Each area page follows one pattern: why it matters in human terms, what is happening mechanistically, an evidence panel of published figures with primary-source links, the populations it applies to, and previous and next links between areas.
- The figures on these pages are drawn from the published literature and each carries a citation link, rather than from any OpenImmune material. The pages carry no OpenImmune data-scale figures, funding amounts, partner names, or the proof-of-concept molecule. One change from the versions supplied: the named cancer programme on page 04 was replaced with a general reference to the parallel public effort on MHC Class I, to keep that name out of public copy.

**Footer (every page)**
- "An open, neutrally funded, UK-led effort to make the immune response to
  medicines predictable, for everyone."

**Page titles and descriptions** (used by search engines and link previews) are
in the `<head>` of each page and are also qualitative.

---

## Interaction and motion (the craft layer)

The site keeps its calm, dark, one-luminous-moment-per-view character. On top of
that, a light interaction layer was added to make it feel considered and tactile
without ever distracting from the words. All of it is gated behind
`prefers-reduced-motion` and behaves gracefully on touch devices and without
JavaScript.

- **Micro-interactions.** Buttons, cards, and the team grid use gentle
  spring easing (a small settle, never a bounce). Buttons carry a soft light
  sweep on hover and a slight press on click. Cards and member panels lift and,
  on a desktop pointer, catch a soft aurora glow that follows the cursor.
- **Kinetic headings.** The home hero and each page heading rise word by word as
  they enter view. Without JavaScript, or with reduced motion set, the headings
  simply appear.
- **Scroll reveals.** Sections and feature blocks fade and slide up in sequence
  as you scroll, on a slow, even cadence.
- **Depth and accents.** A faint mesh gradient sits behind the hero, the header
  becomes frosted glass once you scroll, the contact form is a glass panel, and
  a barely-there grain gives the surfaces a premium, non-flat feel.
- **Moments of delight.** The hero aperture and point field lean gently towards
  the cursor; a thin aurora line at the top of the window tracks reading
  position; and small aurora ticks draw in beside each item in "Why it matters".

To tune or remove any of this, see `17. ELEVATION LAYER` in `styles.css` and the
numbered modules in `script.js`.

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
  `15. MOTION`; the craft layer added later sits under `17. ELEVATION LAYER`
  through `19. RESPONSIVE ADDITIONS`. Reduced-motion preferences are respected
  automatically, and every effect degrades to a fully readable static page.
- **The leadership grid.** In `about.html`, each person is one `<article
  class="member">` block. The round monogram is the two-letter `<span
  class="avatar">`; to use a photograph instead, replace that span with an
  `<img>` of the same size.
- **The share image.** `assets/og-image.png` is what appears when the site is
  shared. Replace the file (keep it 1200x630) to change it.

---

OpenImmune is a UK-led, not-for-profit Focused Research Organisation. This
repository holds its public website only.
