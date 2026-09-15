# Mock service layer

Everything in this folder is a **simulation**. No network requests leave the
browser, no API keys are used, and nothing is uploaded anywhere. Each module is
written with the same shape a real client would have — async functions,
latency, progress callbacks, error-free happy paths — so that swapping in a real
backend is a change inside one file rather than a change across the UI.

| Module | Simulates | Where a real implementation would go |
| --- | --- | --- |
| `ai.ts` | The AI tutor: scripted answers, token-by-token streaming, workspace context assembly | A chat completions endpoint with the workspace context in the prompt |
| `ocr.ts` | Handwriting recognition on a circled region of a photographed page | A handwriting OCR endpoint that takes an image crop and returns text plus confidence |
| `voice.ts` | The microphone: listening state, live audio levels, a final transcript | The browser `SpeechRecognition` API, or a speech-to-text endpoint over a recorded blob |
| `search.ts` | Natural-language document search | A vector search over document embeddings, with the same ranking-reasons response shape |
| `share.ts` | Creating and copying a share link | A share endpoint returning a signed URL, plus a permissions model |
| `files.ts` | Importing a file into the workspace | An upload endpoint; note the prototype deliberately keeps files in the browser only |

## Deliberate design choices

**Latency is simulated.** Every call goes through `delay()` with a realistic
range. A prototype that answers instantly feels fake and, more importantly,
hides the loading states that a real product has to design for.

**The tutor streams.** `streamTutorReply` emits chunks on an interval rather
than resolving with a finished string, because the difference between those two
shapes is the difference between a UI that needs rewriting later and one that
does not.

**Ranking explains itself.** `search.ts` returns a `reasons` array alongside
each result. A real semantic index can produce the same thing from matched
chunks, and it is far more convincing to a user than a bare list.

**Nothing persists server-side.** Files chosen through the importer are read
with `FileReader` into an object URL that lives for the session. Demo state that
does persist (chats, practice results, recent searches) goes to `localStorage`
and never leaves the machine.

## If this were built for real

The interesting engineering problem is not the model call. It is assembling the
right context before the question is ever sent: which documents from a term of
work are relevant to this question, which past mistakes are worth surfacing,
and how to keep that context small enough to be affordable. `buildContext()` in
`ai.ts` is a sketch of the shape that would take.
