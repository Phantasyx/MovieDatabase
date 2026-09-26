/* Sample shelf for the Marquee public demo. These films are invented. */
(function () {
  var SEED = {
    version: 1,
    users: [
      {
        id: "u-mina",
        email: "mina@marquee.demo",
        name: "Mina Cole",
        role: "reviewer",
        password: "demo-reviewer",
        seedPassword: "demo-reviewer"
      },
      {
        id: "u-sam",
        email: "sam@marquee.demo",
        name: "Sam Ortiz",
        role: "reader",
        password: "demo-reader",
        seedPassword: "demo-reader"
      }
    ],
    films: [
      {
        id: "f-tide",
        title: "Low Tide Registry",
        year: 2019,
        minutes: 104,
        genre: "Drama",
        logline: "A harbor clerk starts recognizing the names in a book of boats that never returned.",
        synopsis: "Every Monday, Nia updates a handwritten registry of vessels that missed their window. The work is dull until a name repeats from her own childhood, attached to a boat she watched leave. The film stays inside the office, the dock, and one kitchen table, and it treats memory as a filing problem."
      },
      {
        id: "f-lantern",
        title: "The Brass Lantern",
        year: 2021,
        minutes: 98,
        genre: "Mystery",
        logline: "A night librarian keeps checking out a map the building does not own.",
        synopsis: "After midnight, the same patron asks for a folded coastal map. The drawer that should hold it is empty, then the map is in his coat, then it is back on the desk with a street added in pencil. The librarian stops calling the police and starts walking the new street."
      },
      {
        id: "f-airfield",
        title: "Paper Airfield",
        year: 2016,
        minutes: 112,
        genre: "Adventure",
        logline: "Two siblings follow a map their grandmother drew on the backs of grocery receipts.",
        synopsis: "The receipts are out of order and some of the stores have closed. What begins as a weekend errand becomes a route through county roads, a drained reservoir, and a field where someone once marked a runway with bedsheets. Nobody is chased. The suspense is whether the last receipt still means anything."
      },
      {
        id: "f-choir",
        title: "Kitchen Choir",
        year: 2023,
        minutes: 91,
        genre: "Comedy",
        logline: "A midnight bakery crew rehearses a wedding toast nobody asked them to give.",
        synopsis: "They have the night shift, one working oven, and a speech drafted on the back of a flour invoice. The wedding is for a regular who always buys the last rye. The jokes stay inside the work: timers, pride, and the fear of saying something sincere while wearing a hairnet."
      },
      {
        id: "f-train",
        title: "North of Nowhere",
        year: 2018,
        minutes: 86,
        genre: "Documentary",
        logline: "A town votes on whether to keep the last weekday train.",
        synopsis: "This sample documentary sits in waiting rooms, a high-school gym, and the cab of the evening train. Riders, a dispatcher, and a shop owner argue about a schedule that has already been cut once. The film does not pretend the vote will save the route. It watches people practice having a say."
      },
      {
        id: "f-balcony",
        title: "Second Balcony",
        year: 2020,
        minutes: 101,
        genre: "Romance",
        logline: "Two ushers trade shifts and start leaving notes in the seat-back pockets.",
        synopsis: "The notes are practical at first: a broken armrest, a patron who needs the aisle. They get longer. The theater is half empty and the film they are showing is not the point. What matters is who finds the note before the lights come up."
      },
      {
        id: "f-glass",
        title: "Glass Weather",
        year: 2024,
        minutes: 118,
        genre: "Science fiction",
        logline: "Tomorrow's forecast starts arriving with yesterday's voices folded into it.",
        synopsis: "A small forecast office notices the radar speaking in fragments of old phone calls. The science stays tactile: printouts, a roof sensor, a kettle. The voices are not a villain. They are weather that remembered something on the way down."
      },
      {
        id: "f-usher",
        title: "The Last Usher",
        year: 2014,
        minutes: 95,
        genre: "Drama",
        logline: "On closing night, an usher walks every aisle and remembers who used to sit where.",
        synopsis: "The building is already sold. There is one last showing and a flashlight with a weak battery. The usher does not make a speech. He straightens seats, returns a scarf, and leaves the house lights on a little longer than the manual says."
      }
    ],
    reviews: [
      {
        id: "r-tide-1",
        filmId: "f-tide",
        author: "Rowan Ellis",
        sample: true,
        rating: 5,
        title: "The ledger is the plot",
        body: "Nothing spectacular happens, which is the compliment. The film trusts a notebook, a tide chart, and a woman who is good at her job.",
        at: "2024-03-12T19:10"
      },
      {
        id: "r-tide-2",
        filmId: "f-tide",
        author: "June Park",
        sample: true,
        rating: 4,
        title: "Quiet, and it earns it",
        body: "I wanted one more scene on the water. What I got was better: the decision to stay at the desk.",
        at: "2024-04-02T21:05"
      },
      {
        id: "r-lantern-1",
        filmId: "f-lantern",
        author: "Rowan Ellis",
        sample: true,
        rating: 4,
        title: "A mystery that behaves",
        body: "The map is a real prop, not a metaphor dumped in the last reel. I followed the pencil marks the way the librarian does.",
        at: "2024-06-18T20:40"
      },
      {
        id: "r-choir-1",
        filmId: "f-choir",
        author: "June Park",
        sample: true,
        rating: 5,
        title: "Funny because the work is specific",
        body: "The toast keeps getting worse in exactly the way a group project does. I laughed hardest at the timer, not the punchline.",
        at: "2025-01-09T18:15"
      },
      {
        id: "r-train-1",
        filmId: "f-train",
        author: "June Park",
        sample: true,
        rating: 4,
        title: "A vote, not a sermon",
        body: "People contradict each other and the film lets them. The train footage is plain in a way that feels respectful.",
        at: "2023-11-20T16:00"
      },
      {
        id: "r-balcony-1",
        filmId: "f-balcony",
        author: "Rowan Ellis",
        sample: true,
        rating: 3,
        title: "Sweet, slightly tidy",
        body: "The notes are charming. The last one explains more than it needs to. I still liked the pocket they hid it in.",
        at: "2024-09-01T19:30"
      },
      {
        id: "r-glass-1",
        filmId: "f-glass",
        author: "June Park",
        sample: true,
        rating: 4,
        title: "Weather with a memory",
        body: "The voices could have turned spooky. They stay ordinary, which makes the forecast feel heavier.",
        at: "2025-05-14T22:10"
      },
      {
        id: "r-usher-1",
        filmId: "f-usher",
        author: "Rowan Ellis",
        sample: true,
        rating: 5,
        title: "Closing night, no speech",
        body: "A whole theater remembered through seats. The flashlight gag pays off without asking for applause.",
        at: "2022-12-11T17:45"
      }
    ]
  };

  window.MarqueeData = {
    seed: function () {
      return JSON.parse(JSON.stringify(SEED));
    }
  };
})();
