# CityRide · Online Bus Pass System

CityRide is an academic demo for applying for a bus pass online. Passengers choose a route and pass duration, track their applications, and print an approved pass. Administrators can search and filter applications, review submissions, and view registered passengers.

## Run locally

Install Git and Python 3, then run:

```sh
git clone https://github.com/jsrikavyacsb243218-ux/onlinebuspassreg.git
cd onlinebuspassreg
python -m http.server 8000 --bind 127.0.0.1
```

Open [CityRide](http://127.0.0.1:8000/) in your browser. The app uses plain HTML, CSS, and JavaScript and runs directly from the static server.

## Try the demo

1. [Register](http://127.0.0.1:8000/register.html), sign in, and submit a student or general passenger application. Both categories support monthly and quarterly passes.
2. In another tab of the same browser profile, open [Administrator sign-in](http://127.0.0.1:8000/admin-login.html) and expand **Demo admin credentials**. Find the application in the admin dashboard and approve it.
3. Return to the passenger dashboard and refresh to see the decision. Open [My digital pass](http://127.0.0.1:8000/pass.html) to view or print the approved pass.

## How data is stored

Accounts, sessions, and applications live in the browser’s `localStorage`. Use the same browser profile and URL for both roles so they share the demo records. The demo uses client-side authentication and is intended for sample data. Its passes are invalid for travel.

## Project layout

- [`index.html`](index.html) and the other root HTML files define the public pages, forms, dashboards, and pass view.
- [`css/style.css`](css/style.css) contains the responsive design and print styles.
- [`js/js/`](js/js/) contains authentication, application handling, dashboard rendering, and UI interactions.
- [`assets/`](assets/) contains the hero image, fonts, and font license files.
