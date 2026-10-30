# Memorial message page

Next.js site with:
- `/` public landing page listing messages (photo, name, message, time). Hidden from search engines.
- `/write/<ADMIN_KEY>` secret page to post and delete messages.
- Storage: Vercel Blob (messages as JSON, photos as images).

## Setup on Vercel
1. Import this folder as a Vercel project (framework: Next.js).
2. Connect the Blob store `seanghouy-memory-blob` to the project (Storage tab). This adds `BLOB_READ_WRITE_TOKEN`.
3. Add env var `ADMIN_KEY` (a long random string). The admin link is `https://<your-site>/write/<ADMIN_KEY>`.
4. Edit `lib/config.js` to set the name, dates and intro text.
