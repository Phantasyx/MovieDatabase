# End-to-end notes

Checked on 26 September 2026 against `http://127.0.0.1:8080/`, serving `dist/` after `sh build.sh`. The browser was headless Chrome at 1280px and at 390px. Each run started from a cleared `localStorage` key `marquee-demo-v1` and a cleared session.

## Primary flows

| Flow | Result |
| --- | --- |
| Shelf opens on the Second Balcony hero and lists all eight titles in poster rows | Passed |
| Every poster and the hero loaded a local photograph (natural size above 40px) | Passed |
| Search for `lantern` leaves only The Brass Lantern and hides the hero | Passed |
| Comedy combined with that search shows an empty shelf. Clearing the search leaves Kitchen Choir | Passed |
| Kitchen Choir labels June Park's copy **Sample note** | Passed |
| Paper Airfield starts with no notes and still shows its photograph | Passed |
| `#/notes` while signed out opens Sign in | Passed |
| Unknown email shows "Those credentials are not in this demo." | Passed |
| Signing in as Mina Cole shows "Signed in as Mina Cole." on screen | Passed |
| Saving a note on Paper Airfield shows "Note saved in this browser." on screen. The note is Mina Cole's and is not labeled Sample note. Saving again updates that one note | Passed |
| Your notes lists the Paper Airfield note | Passed |
| Log out returns to the shelf, hides Your notes, and leaves the note readable with a sign-in prompt | Passed |
| Sam Ortiz can read a title and cannot open the note form. His notes page starts empty | Passed |
| A password shorter than 8 characters is rejected. Two different new passwords are rejected. A matching password is stored in this browser | Passed |
| Reset demo data restores eight titles, removes the written note, and restores both seed passwords | Passed |
| `#/missing` shows "That page is not on the shelf." | Passed |
| At 1280px and at 390px the page does not scroll sideways. Poster rows scroll inside themselves. The phone menu stays inside the screen and Escape closes it | Passed |
| The page reported no JavaScript errors | Passed |

## Not part of this check

- A live deploy of `https://marquee.phantasyx.com`. This environment did not publish the Worker.
- Email. Password changes stay in the browser.
- The archived PHP app. It needs a database this demo does not ship.
