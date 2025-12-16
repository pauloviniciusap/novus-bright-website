Novus Bright - Website (Static)

Files:
- index.html
- styles.css
- script.js
- logo.svg

How to run locally (no install):
1) Open index.html in a browser, OR
2) Use a simple local server (recommended):
   - Python:  python -m http.server 8000
   - Then visit: http://localhost:8000

How to make the form send submissions to your email:

Option A: Netlify Forms (easy, no code)
1) Create a free Netlify account, drag-and-drop this folder to deploy.
2) In Netlify dashboard:
   Site settings -> Forms -> Form notifications -> Add notification -> Email.
3) Keep the <form> action="" as-is (blank). Netlify captures POST submissions.

Option B: Formspree (easy, no server)
1) Create a form at https://formspree.io
2) Copy your endpoint (looks like https://formspree.io/f/XXXXXXX)
3) In index.html, set the form tag:
   action="https://formspree.io/f/XXXXXXX"
4) Publish the site anywhere (Netlify, Vercel, GitHub Pages, etc.)

Option C: Custom backend
Point the form action to your server endpoint and send email via your provider.

Placeholders you should replace in index.html:
- hello@novusbright.com
- (555) 123-4567
- service area text
