# Atlas — the study workspace that remembers

**An interactive concept prototype. Every AI answer, handwriting transcription, voice input,
document analysis, search result and share link is simulated with local mock data. No model is
called, nothing is uploaded, and there is no account, database or backend of any kind.**

Atlas is a clickable prototype of an all-in-one study workspace: notes, documents, photographed
paper work and an AI tutor in one place. This repository is **Version 1**, the single-workspace
version.

It exists to be shared with people and argued about. It is not a production app, and it is not
trying to be.

---

## The idea in one paragraph

A student's work is scattered across four places — a PDF handout, a paper problem set, notes in
some app, and an AI chat that can see none of it. So they retype their question badly and get an
answer to a question they did not ask. Atlas puts all of it in one workspace: you circle the line
of your own handwriting that is going wrong, confirm what the recogniser read, and ask about
*that*. Because everything lives together, the answer arrives with the assignment brief, your
notes and your marked quiz already in view. Over a term that becomes an academic memory — the
tutor can say "this is the fourth time, and it only happens on payables when you are working
quickly", which is something no fresh chat can ever say.

## What you can actually do in the demo

The demo opens on **FIN 301 Corporate Finance, Problem Set 4** — a Harbor Logistics free cash flow
question, with a photographed page of handwritten working already in the workspace. The work
contains one deliberate and very common mistake, which is what makes the tutor's reply worth
reading.

| # | Try this | Where |
| --- | --- | --- |
| 1 | Switch courses and assignments | Left sidebar |
| 2 | Open a PDF, a note or the photographed worksheet | Document tabs |
| 3 | **Drag a box around any handwritten answer** | On the worksheet |
| 4 | Select a region with the keyboard instead | Buttons under the page |
| 5 | Confirm or edit the transcription before the tutor sees it | Dialog that appears |
| 6 | Ask a question by text | Tutor panel |
| 7 | Press the microphone and watch it "listen" | Tutor composer |
| 8 | Open a previous conversation on this assignment | Tutor panel → History |
| 9 | Search `find the notes where I struggled with working capital` | Top search bar (`Ctrl`/`Cmd` + `K`) |
| 10 | Open learning insights: recurring mistakes, strengths, review plan | Top bar → Insights |
| 11 | Answer the short practice set and read the feedback | Insights page |
| 12 | Create and copy a share link | Top bar → Share |
| 13 | Import a file from your own machine (it never leaves the browser) | Document tabs → Import |

There is a **Demo guide** in the top bar that tracks which of these you have tried.

Progress is kept in `localStorage`, so conversations, confirmed transcriptions, practice results
and recent searches survive a refresh. **Reset the demo** in the sidebar clears it.

## Running it locally

Requires Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open the URL it prints (usually <http://localhost:5173>).

### Other commands

```bash
npm run build
```

Type-checks with `tsc -b` and writes the static site to `dist/`.

```bash
npm run preview
```

Serves the contents of `dist/` exactly as a static host would — worth doing before you deploy.

```bash
npm run lint
```

```bash
npm test
```

44 unit tests covering the search ranker, the tutor's reply matching and streaming, the
handwriting region matching, and hash routing.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push to `main`. It runs
lint, tests and the type-checked build first, so a broken commit does not reach the site.

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow by hand from the **Actions** tab).

The site appears at `https://<your-username>.github.io/<your-repo>/`.

Two things make that work on a project subpath without any extra configuration:

- **`base: './'` in `vite.config.ts`.** Asset URLs are emitted relative, so the build does not need
  to know the repository name.
- **Hash routing** (`#/`, `#/app`, `#/app/insights`). GitHub Pages serves static files, so a path
  like `/app` would 404 on refresh. A hash route never reaches the server, so every route survives
  a refresh, a bookmark and a shared link.

`public/.nojekyll` is included so Pages does not run Jekyll over the build output.

## The mock service layer

Everything simulated is behind `src/services/`, deliberately separated from the UI so that the
seam where a real backend would attach is obvious. Each module carries a comment showing the real
call it stands in for.

| Module | Simulates | A real version would use |
| --- | --- | --- |
| `ai.ts` | Tutor replies, token streaming, workspace context assembly | A chat completions endpoint |
| `ocr.ts` | Handwriting recognition on a circled region | A handwriting OCR endpoint over an image crop |
| `voice.ts` | Listening state, audio levels, transcript | `SpeechRecognition`, or recorded audio to a speech endpoint |
| `search.ts` | Natural-language document search | Vector search over document embeddings |
| `share.ts` | Share links and access levels | A share endpoint returning a signed URL |
| `files.ts` | Importing a file | An upload endpoint plus a document-understanding pass |

`src/services/README.md` goes into more detail, including why latency is simulated and why the
tutor streams rather than resolving with a finished string.

**The interesting problem is not the model call.** It is `buildContext()` in `ai.ts`: deciding
which documents out of a term of work are worth sending with this particular question, and keeping
that small enough to be affordable.

## Environment variables

`.env.example` lists placeholder variables showing where real services would be configured. **They
are all optional and entirely unused.** The app builds and runs with no `.env` file at all, which
is the point — there is nothing to sign up for.

## Project structure

```
src/
  components/
    landing/     Product overview page and its sections
    layout/      Logo, the prototype banner
    ui/          Button, Modal, Badge, Toaster, ProgressBar, Spinner
    workspace/   The demo: sidebar, document canvas, worksheet, tutor, insights
  data/          All mock data - courses, documents, worksheet, tutor script, insights
  hooks/         useTutorChat
  lib/           Hash router, localStorage helpers, class-name helper
  services/      The simulated AI, OCR, voice, search, share and file layer
  state/         Store: reducer, context, localStorage persistence
  types/         Shared domain types
```

## Design and accessibility notes

- Navy, a single confident blue, and warm paper neutrals. Amber means "something to work on",
  emerald means "mastered".
- Three-column workspace at 1024px and up; below that a segmented Files / Document / Tutor
  switcher, so it stays usable on a tablet and a phone.
- Dragging on the worksheet is a pointer interaction, so there is a **keyboard-equivalent list of
  regions** underneath the page. Nothing in the demo is reachable only by dragging.
- Dialogs trap focus, restore it on close with `preventScroll`, and close on `Escape`.
- Visible focus rings throughout, `prefers-reduced-motion` respected, and meters carry ARIA values.

## Honesty about what is fake

This matters more than the features, so it is stated in three places: a banner on every screen, a
**Simulated** tag beside every piece of generated output, and here.

- Tutor replies are hand-written scripts selected by keyword scoring. Ask something outside the
  script and it says so rather than inventing an answer.
- Handwriting "recognition" is a lookup against pre-authored regions of the sample page. The
  transcript for part (a) contains a deliberate misread so the confirm-or-edit step has a real job
  to do.
- The microphone requests no permission and records nothing. The waveform is generated numbers.
- Search is a hand-written scorer over a small local library, not a semantic index.
- Share links are generated locally and point back at this demo. Nothing is published.
- Imported files are read with `FileReader` and held in memory for the session. There is no upload
  endpoint in this codebase.
- The "academic memory" is a fixed sample dataset, not a record of anyone's term.

## Deliberately out of scope for Version 1

A separate mobile capture app, live tutoring during a lecture, LMS integrations, real-time
collaborative editing, and anything requiring an account or a server. Version 1 does less so that
the one thing it does — answering with your whole course in view — actually works.

## Licence

Prototype, shared for feedback. Not licensed for production use.
