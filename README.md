# Mahmoud Ahmed - ELV & ICT Portfolio

A responsive, single-page portfolio website designed for Mahmoud Ahmed, PMP-certified Project Manager specializing in ELV and ICT projects.

## Included

- Responsive desktop, tablet, and mobile layout
- Fixed navigation and smooth scrolling
- About section and professional metrics
- Filterable Project Manager and Site Engineer project portfolio
- Project detail modal windows
- Professional certifications section
- Core expertise section
- Contact form that opens the visitor's email application
- Downloadable CV file
- GitHub Pages-ready relative paths
- Local SVG project illustrations with no external image dependency

## Project structure

```text
mahmoud-portfolio/
|-- index.html
|-- README.md
|-- .nojekyll
|-- assets/
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   |-- app.js
|   |   `-- projects.js
|   |-- img/
|   |   |-- logo.svg
|   |   |-- favicon.svg
|   |   |-- profile-mahmoud.jpg
|   |   `-- projects/
|   `-- files/
|       `-- Mahmoud_Ahmed_CV.docx
```

## Deploy to GitHub Pages

1. Create a new GitHub repository, for example `My-Portfolio`.
2. Upload all files and folders from this package to the repository root.
3. Open the repository **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)` folder.
7. Save. GitHub will publish the website after a short build.

The final address will usually be:

```text
https://YOUR-USERNAME.github.io/REPOSITORY-NAME/
```

For Mahmoud's existing repository, the expected address is:

```text
https://mahmoud2527.github.io/My-Portfolio/
```

## Edit project information

Open:

```text
assets/js/projects.js
```

Each project is stored as a JavaScript object. Edit the title, location, role, systems, scope, responsibilities, or image path there. The page updates automatically.

## Replace project images

The included project images are original SVG placeholders. To use real site photographs:

1. Add the photo to `assets/img/projects/`.
2. Use a web-friendly file name such as `kafd-11-floor.jpg`.
3. Update the relevant `image` value in `assets/js/projects.js`.
4. Recommended image size: 1200 x 800 pixels or larger.
5. Remove sensitive client information, faces, access credentials, drawings, and IP addresses before publishing site photos.

## Replace the profile image

Replace this file while keeping the same name:

```text
assets/img/profile-mahmoud.jpg
```

Recommended format: JPG, portrait orientation, at least 900 x 1200 pixels.

## Replace the CV

Replace:

```text
assets/files/Mahmoud_Ahmed_CV.docx
```

You may use a PDF instead. If you rename the file, also update the Download CV link in `index.html`.

## Update contact details

Search `index.html` for:

- `M.Ahmed1518@Outlook.com`
- `+966548306872`
- `mahmoudahmed2527`

The contact form uses a `mailto:` link and does not require a server. For a hosted form service such as Formspree, replace the form handling code in `assets/js/app.js`.

## Browser support

The site supports current versions of Chrome, Edge, Firefox, and Safari. Project details use the HTML `dialog` element.

## Notes

- The bundled CV is the source file available when this package was created. Replace it whenever the CV is updated.
- All paths are relative, so the site works correctly inside a GitHub Pages repository subfolder.
