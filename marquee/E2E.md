# End-to-end notes

Checked on 26 September 2026 against `http://127.0.0.1:8080/`, serving `dist/` after `sh build.sh`. The browser was headless Chrome. Each run started from a cleared `localStorage` key `marquee-demo-v1` and a cleared session.

A separate desktop recording walked the same shelf, search, sample-review, sign-in, save, and notes path with the mouse. Both runs completed without a page error.

## Primary flows

| Flow | Result |
| --- | --- |
| Shelf lists the eight sample films, including Paper Airfield | Passed |
| Search for `lantern` leaves only The Brass Lantern | Passed |
| Comedy filter with a search that matches nothing shows the empty state; clearing the search leaves Kitchen Choir | Passed |
| Low Tide Registry labels shelf copy **Sample review** and attributes it to June Park, not a demo account | Passed |
| Paper Airfield starts with no reviews | Passed |
| `#/notes` while signed out opens Log in | Passed |
| Unknown email shows “Those credentials are not in this demo.” | Passed |
| “Use this account” fills Mina Cole; sign-in shows “Signed in as Mina Cole.” inside the viewport | Passed |
| Saving a review on Paper Airfield from the form below the fold shows “Review saved in this browser.” inside the viewport. The note is Mina Cole’s and is not labeled Sample review | Passed |
| Saving the same film again updates that one review | Passed |
| Your notes lists the Paper Airfield review | Passed |
| Log out returns to the shelf, hides Your notes, and leaves the review readable with a sign-in prompt | Passed |
| Sam Ortiz’s notes start empty | Passed |
| A password shorter than 8 characters is rejected | Passed |
| Two different new passwords are rejected | Passed |
| A matching new password is stored in this browser and shown on the sign-in card | Passed |
| Reset demo data restores eight films, removes the written review, and restores both seed passwords | Passed |
| `#/missing` shows “That page is not on the shelf.” | Passed |
| At 1280px and at 390px the page does not scroll sideways. The phone menu sits inside the screen and Escape closes it | Passed |

## Not part of this check

- A live deploy of `https://marquee.phantasyx.com`. This environment did not publish the Worker.
- Email. Password reset stays in the browser.
- The archived PHP app. It needs a database this demo does not ship.
