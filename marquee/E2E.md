# End-to-end checks

Checked on 26 Sep 2026 against `marquee/dist/` served at `http://127.0.0.1:8080/`. Desktop viewport 1280 by 800. Phone viewport 390 by 800. Storage was cleared before the run.

| Check | Result |
| --- | --- |
| Movies opens on the Second Balcony hero and lists 33 titles, each with its own local poster | Passed |
| Every poster and the hero loaded a local photograph (natural size above 40px) | Passed |
| Search for `lantern` leaves only The Brass Lantern and hides the hero | Passed |
| Comedy combined with that search shows "No movies match that search." Clearing the search leaves the comedy titles, including Kitchen Choir and Bicycle Sunday | Passed |
| Kitchen Choir labels June Park's copy **Sample review** | Passed |
| Paper Airfield starts with no reviews and still shows its photograph | Passed |
| Saving a movie while signed out opens Sign in, with "Sign in to save a movie." | Passed |
| `#/reviews`, `#/saved`, `#/profile`, and the older `#/notes` path open Sign in while signed out | Passed |
| A bad password shows "That email and password do not match an account." | Passed |
| Mina Cole can sign in. The header links to her profile. The banner "Signed in as Mina Cole." is on screen | Passed |
| Save on a title shows "Saved to your favorites." and the button reads Saved. Saved favorites lists that movie. Removing it shows "Removed from your favorites." | Passed |
| Saving a review on Paper Airfield shows "Review saved in this browser." The review is Mina Cole's and is not labeled Sample review. Saving again updates that one review | Passed |
| Your reviews lists the Paper Airfield review. `#/notes` still opens Your reviews | Passed |
| Profile shows Mina Cole, mina@marquee.demo, the initials MC, and a Member badge. The reminder switch stays on after leaving the page | Passed |
| Glass Weather is included with a plan until someone subscribes. Plans lists Basic, Standard, and Premium | Passed |
| A short card number is rejected. 4242 4242 4242 4242 with an expiry, security code, and billing address starts Standard, stores only the last 4, and lists paid invoices | Passed |
| The plan can change to Premium, pause, resume, cancel, and be purchased again. Sam does not inherit Mina's plan. Reset demo data clears the plan and the invoices | Passed |
| Log out hides Your reviews and leaves the review readable, with a sign-in prompt | Passed |
| Sam Ortiz can read a title and cannot open the review form. His reviews page starts empty. A favorite he saves does not appear on Mina's saved list | Passed |
| A short password and a mismatched password are rejected. A matching password of 8 or more characters updates in the browser | Passed |
| Reset demo data restores 33 titles, removes the written review, signs out, and restores the seed password | Passed |
| `#/missing` shows "That page is not in the catalog." | Passed |
| At 1280 and at 390, the page does not scroll sideways. At 390 the menu opens from the left edge to the right edge, a poster row scrolls inside itself, and Escape closes the menu | Passed |
| At 768 the menu lists Movies, Plans, Your reviews, Saved, Billing, and Profile. Plans, checkout, billing, profile, and a locked title fit at 1280, 768, and 390 | Passed |
| The hero image is requested first. Poster files are the size used on screen and load as the rows come into view | Passed |

No Cloudflare deploy was run.
