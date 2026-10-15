# Abdulhakim Amtouti – portfolio

A plain HTML/CSS/JS site. No build step, no frameworks, free to host.

## Put it online with GitHub Pages (free)

1. Sign in to GitHub and create a new **public** repository named exactly
   `YOUR-USERNAME.github.io` .
2. On the new repository page, click **Add file → Upload files**, drag in
   everything from this folder (including the `assets` folder), and click
   **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source to
   **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io`.

Each project has its own link, e.g. `https://YOUR-USERNAME.github.io/#quadcopter`,
which you can put on your CV next to the project.

## Edit your details

Open `projects.js`. The `SITE` block at the top holds your name, tagline,
email, GitHub, LinkedIn, CV link and About text. Anything left as `""` is hidden.

To add a CV download, upload the PDF into `assets/` and set `cv: "assets/cv.pdf"`.

## Add a project

1. Make a folder for its media, e.g. `assets/img/my-project/`.
2. In `projects.js`, copy the commented TEMPLATE at the bottom, fill it in,
   and paste it into the `PROJECTS` list (mind the comma between projects).
3. Upload the changed files to GitHub. The site updates within a minute or two.

The order of `PROJECTS` is the order on the home page.

## Photos and videos

- **Photos:** JPG, around 1600 px on the long side. Portrait photos make the best
  cover images on the home page.
- **Short clips:** MP4 in `assets/video/my-project/`, added to a section as
  `{ video: "assets/video/my-project/clip.mp4", caption: "..." }`.
  GitHub's website accepts files up to 25 MB, so keep clips short.
- **Longer videos:** upload to YouTube as *Unlisted* and add
  `{ youtube: "https://youtu.be/...", caption: "..." }` with the normal YouTube link.
- The quadcopter flight clip is already included at
  `assets/video/quadcopter/flight-test.mp4`.

## Preview on your computer

Double-click `index.html`. It opens in your browser without a server.

## Files

- `index.html` – the page shell
- `projects.js` – all your content (the only file you normally edit)
- `app.js` – builds the pages from `projects.js`
- `styles.css` – the design
- `assets/` – images, videos, CV
