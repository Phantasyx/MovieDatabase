/* Movies, reviews, and accounts for Marquee. */
(function () {
  var SEED = {
    version: 3,
    users: [
      { id: "u-mina", email: "mina@marquee.demo", name: "Mina Cole", role: "reviewer", password: "demo-reviewer", seedPassword: "demo-reviewer", favorites: [], preferences: { reminders: false, quiet: true }, subscription: { plan: null, status: "none", nextBilling: null, last4: null, cardName: null, invoices: [] } },
      { id: "u-sam", email: "sam@marquee.demo", name: "Sam Ortiz", role: "reader", password: "demo-reader", seedPassword: "demo-reader", favorites: [], preferences: { reminders: false, quiet: true }, subscription: { plan: null, status: "none", nextBilling: null, last4: null, cardName: null, invoices: [] } }
    ],
    films: [
      {
        id: "f-tide",
        title: "Low Tide Registry",
        year: 2019,
        minutes: 104,
        genre: "Drama",
        image: "images/tide.jpg",
        photo: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
        logline: "A harbor clerk starts recognizing the names in a book of boats that never returned.",
        synopsis: "Every Monday, Nia updates a handwritten registry of vessels that missed their window. The work is dull until a name repeats from her own childhood, attached to a boat she watched leave. The film stays inside the office, the dock, and one kitchen table, and it treats memory as a filing problem."
      },
      {
        id: "f-lantern",
        title: "The Brass Lantern",
        year: 2021,
        minutes: 98,
        genre: "Mystery",
        image: "images/lantern.jpg",
        photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
        logline: "A night librarian keeps checking out a map the building does not own.",
        synopsis: "After midnight, the same patron asks for a folded coastal map. The drawer that should hold it is empty, then the map is in his coat, then it is back on the desk with a street added in pencil. The librarian stops calling the police and starts walking the new street."
      },
      {
        id: "f-airfield",
        title: "Paper Airfield",
        year: 2016,
        minutes: 112,
        genre: "Adventure",
        image: "images/airfield.jpg",
        photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        logline: "Two siblings follow a map their grandmother drew on the backs of grocery receipts.",
        synopsis: "The receipts are out of order and some of the stores have closed. What begins as a weekend errand becomes a route through county roads, a drained reservoir, and a field where someone once marked a runway with bedsheets. Nobody is chased. The suspense is whether the last receipt still means anything."
      },
      {
        id: "f-choir",
        title: "Kitchen Choir",
        year: 2023,
        minutes: 91,
        genre: "Comedy",
        image: "images/choir.jpg",
        photo: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f",
        logline: "A midnight bakery crew rehearses a wedding toast nobody asked them to give.",
        synopsis: "They have the night shift, one working oven, and a speech drafted on the back of a flour invoice. The wedding is for a regular who always buys the last rye. The jokes stay inside the work: timers, pride, and the fear of saying something sincere while wearing a hairnet."
      },
      {
        id: "f-train",
        title: "North of Nowhere",
        year: 2018,
        minutes: 86,
        genre: "Documentary",
        image: "images/train.jpg",
        photo: "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
        logline: "A town votes on whether to keep the last weekday train.",
        synopsis: "This sample documentary sits in waiting rooms, a high-school gym, and the cab of the evening train. Riders, a dispatcher, and a shop owner argue about a schedule that has already been cut once. The film does not pretend the vote will save the route. It watches people practice having a say."
      },
      {
        id: "f-balcony",
        title: "Second Balcony",
        year: 2020,
        minutes: 101,
        genre: "Romance",
        image: "images/balcony.jpg",
        hero: "images/hero.jpg",
        photo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        logline: "Two ushers trade shifts and start leaving messages in the seat-back pockets.",
        synopsis: "The messages are practical at first: a broken armrest, a patron who needs the aisle. They get longer. The theater is half empty and the film they are showing is not the point. What matters is who finds the message before the lights come up."
      },
      {
        id: "f-glass",
        title: "Glass Weather",
        year: 2024,
        minutes: 118,
        genre: "Science fiction",
        image: "images/glass.jpg",
        photo: "https://images.unsplash.com/photo-1461511669078-d46bf351cd6e",
        logline: "Tomorrow's forecast starts arriving with yesterday's voices folded into it.",
        synopsis: "A small forecast office notices the radar speaking in fragments of old phone calls. The science stays tactile: printouts, a roof sensor, a kettle. The voices are not a villain. They are weather that remembered something on the way down."
      },
      {
        id: "f-usher",
        title: "The Last Usher",
        year: 2014,
        minutes: 95,
        genre: "Drama",
        image: "images/usher.jpg",
        photo: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
        logline: "On closing night, an usher walks every aisle and remembers who used to sit where.",
        synopsis: "The building is already sold. There is one last showing and a flashlight with a weak battery. The usher does not make a speech. He straightens seats, returns a scarf, and leaves the house lights on a little longer than the manual says."
      },
      {
        id: "f-salt",
        title: "Salt Line",
        year: 2017,
        minutes: 107,
        genre: "Drama",
        image: "images/salt.jpg",
        photo: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
        logline: "A survey pilot starts tracing one coastline that does not match the charts.",
        synopsis: "She flies the same stretch every season and marks where the water has moved. This year a jetty appears that nobody in town will admit to building. The film stays in the air and in one harbormaster's office."
      },
      {
        id: "f-rows",
        title: "Harvest Rows",
        year: 2022,
        minutes: 94,
        genre: "Documentary",
        image: "images/orchard.jpg",
        photo: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
        logline: "A county films its fields from above and argues about what the rows are for.",
        synopsis: "The pictures are plain: green lines, a road, a shed. Farmers, a surveyor, and a teacher take turns explaining the same acre. Nobody wins the argument. The film lets the pattern stay on screen longer than a speech."
      },
      {
        id: "f-cup",
        title: "Second Cup",
        year: 2019,
        minutes: 99,
        genre: "Romance",
        image: "images/kettle.jpg",
        photo: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
        logline: "Two regulars keep missing each other at the only table by the window.",
        synopsis: "He takes the early shift. She takes the late one. The pastry case is the whole plot for a while. When they finally sit down, the conversation is about the mug, the weather, and whether either of them is staying in town."
      },
      {
        id: "f-mail",
        title: "Box Numbers",
        year: 2015,
        minutes: 102,
        genre: "Drama",
        image: "images/envelope.jpg",
        photo: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624",
        logline: "A substitute carrier learns which mailbox still belongs to someone who moved.",
        synopsis: "The route is short and the names on the boxes are out of date. She delivers what she can and holds the rest. One letter keeps coming back with no forwarding address, and the film is about whether she opens it."
      },
      {
        id: "f-lights",
        title: "String Lights",
        year: 2021,
        minutes: 96,
        genre: "Romance",
        image: "images/market.jpg",
        photo: "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
        logline: "Neighbors spend a week arguing over who has to take the lights down.",
        synopsis: "The tree in the courtyard was decorated for a party that already happened. Everybody likes them at night and nobody wants the ladder. Two people end up on that ladder anyway, and the talk is better than the party was."
      },
      {
        id: "f-mic",
        title: "The Night Mic",
        year: 2020,
        minutes: 88,
        genre: "Documentary",
        image: "images/radio.jpg",
        photo: "https://images.unsplash.com/photo-1593078166039-c9878df5c520",
        logline: "A community station lets whoever shows up talk until the song ends.",
        synopsis: "The host sets a microphone on a stand and waits. Callers talk about buses, birthdays, and a road closure. The film does not tidy their sentences. It listens the way the station does, one voice at a time."
      },
      {
        id: "f-bike",
        title: "Bicycle Sunday",
        year: 2023,
        minutes: 93,
        genre: "Comedy",
        image: "images/bicycle.jpg",
        photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
        logline: "A street closes to cars once a week, and nobody can agree who thought of it.",
        synopsis: "The bicycle on the wall has been there longer than the rule. Kids, a shop owner, and a very serious cyclist all claim the holiday. The jokes come from the arguments, which are polite and endless."
      },
      {
        id: "f-pines",
        title: "Hollow Pines",
        year: 2016,
        minutes: 109,
        genre: "Mystery",
        image: "images/pines.jpg",
        photo: "https://images.unsplash.com/photo-1448375240586-882707db888b",
        logline: "A ranger marks trees that were not on the fire map she drew last spring.",
        synopsis: "The forest is quiet in the way that makes people talk softer. She finds blazes on trunks that her own map does not mention. The film walks with her instead of explaining the marks from a desk."
      },
      {
        id: "f-agenda",
        title: "Empty Agenda",
        year: 2024,
        minutes: 90,
        genre: "Comedy",
        image: "images/office.jpg",
        photo: "https://images.unsplash.com/photo-1497366216548-37526070297c",
        logline: "A team books a glass room for a meeting that nobody put on the calendar.",
        synopsis: "The chairs are ready and the screen is on. People arrive because the invite looked official. They spend the hour inventing a project so the room will not feel wasted. It is funny because they are trying to be professional."
      },
      {
        id: "f-trim",
        title: "The Trim",
        year: 2018,
        minutes: 84,
        genre: "Documentary",
        image: "images/candy.jpg",
        photo: "https://images.unsplash.com/photo-1582053433976-25c00369fc93",
        logline: "An editor talks through a scene by holding the frames up to the window.",
        synopsis: "There is no interview lighting and no montage of famous movies. She shows the cuts she kept and the ones she did not, and she explains each choice in the language of timing. The strips are the whole subject."
      },
      {
        id: "f-river",
        title: "River Arithmetic",
        year: 2013,
        minutes: 111,
        genre: "Drama",
        image: "images/river.jpg",
        photo: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2",
        logline: "A water keeper measures the same bend every week and writes the numbers by hand.",
        synopsis: "The river looks calm from the bank. Her book says otherwise. When the town wants a new dock, she brings the book to a meeting and reads the pages out loud. The film trusts those numbers more than the speeches."
      },
      {
        id: "f-field",
        title: "Deep Field",
        year: 2025,
        minutes: 121,
        genre: "Science fiction",
        image: "images/telescope.jpg",
        photo: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
        logline: "A night assistant notices a smudge on a plate that was not there yesterday.",
        synopsis: "The observatory is small and the sky in the picture is not. She checks the focus, the log, and the weather. The smudge stays. The film never turns it into a monster. It stays a mark that someone has to account for."
      },
      {
        id: "f-dock",
        title: "Private Dock",
        year: 2017,
        minutes: 100,
        genre: "Romance",
        image: "images/ferry.jpg",
        photo: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054",
        logline: "Two families share a lake dock and pretend the schedule on the post is fair.",
        synopsis: "Mornings belong to one house and evenings to the other, until a visitor needs the boat at noon. The movie is mostly people being careful with each other's things. The water does the rest."
      },
      {
        id: "f-counters",
        title: "Clean Counters",
        year: 2022,
        minutes: 89,
        genre: "Comedy",
        image: "images/kitchen.jpg",
        photo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
        logline: "A pop-up dinner gets postponed because nobody will dirty the new kitchen.",
        synopsis: "The room was photographed for a magazine that morning. Guests are already on the way. The cook, the host, and a neighbor negotiate which towel can be used. The food is simple. The panic is specific."
      },
      {
        id: "f-wheel",
        title: "The Night Wheel",
        year: 2019,
        minutes: 103,
        genre: "Romance",
        image: "images/carousel.jpg",
        photo: "https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b",
        logline: "A fairground worker and a ticket seller trade shifts on the tallest ride.",
        synopsis: "The wheel runs after the rest of the lot has closed. They talk over the radio while the cars go around. Nothing dramatic happens at the top. The pleasure is in coming back down to the same person."
      },
      {
        id: "f-lamp",
        title: "The Green Lamp",
        year: 2014,
        minutes: 97,
        genre: "Mystery",
        image: "images/voltage.jpg",
        photo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
        logline: "A night clerk keeps finding a lamp on that she is sure she switched off.",
        synopsis: "The office is a bank of desks and one pool of green light. She writes the times in a pad. The lamp is not a ghost story. Someone else has a key, and the film is patient about who."
      },
      {
        id: "f-suit",
        title: "Pressed Suit",
        year: 2016,
        minutes: 105,
        genre: "Drama",
        image: "images/coat.jpg",
        photo: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3",
        logline: "A man borrows a good suit for a hearing and spends the day trying not to wrinkle it.",
        synopsis: "The jacket is nicer than anything he owns. He sits straight on the bus, in the hallway, and in a plastic chair. The hearing is short. The film is about the hours around it, and about giving the suit back clean."
      },
      {
        id: "f-unmade",
        title: "Late Morning",
        year: 2020,
        minutes: 92,
        genre: "Romance",
        image: "images/ceiling.jpg",
        photo: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        logline: "Two people keep a day with nowhere to be and a bed they are not ready to leave.",
        synopsis: "The room is bright and ordinary. They talk about breakfast, a train, and whether the day counts if they waste it. The movie does not rush them into a decision. It stays with the light on the sheets."
      },
      {
        id: "f-dune",
        title: "The Long Dune",
        year: 2011,
        minutes: 116,
        genre: "Adventure",
        image: "images/desert.jpg",
        photo: "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
        logline: "A guide walks a ridge she has crossed before, this time with a visitor who counts steps.",
        synopsis: "There is no chase and no buried treasure. The suspense is heat, distance, and whether the visitor will admit he is lost. She already knows the way. The dune is the map."
      },
      {
        id: "f-guitar",
        title: "Six Strings",
        year: 2018,
        minutes: 98,
        genre: "Drama",
        image: "images/violin.jpg",
        photo: "https://images.unsplash.com/photo-1460036521480-ff49c08c2781",
        logline: "A repair shop keeps a guitar that the owner was supposed to pick up in the spring.",
        synopsis: "The season changes and the ticket stays on the case. The repairer plays it once, after hours, and then puts it back. The film is about waiting for someone who may have changed their mind."
      },
      {
        id: "f-pass",
        title: "White Pass",
        year: 2015,
        minutes: 87,
        genre: "Documentary",
        image: "images/snow.jpg",
        photo: "https://images.unsplash.com/photo-1418985991508-e47386d96a71",
        logline: "A road crew talks about keeping one mountain pass open through the winter.",
        synopsis: "The interviews happen in truck cabs and at a turnout. People disagree about closures, school days, and who should turn around. The mountains stay in the background, which is where the weather actually is."
      },
      {
        id: "f-piano",
        title: "City of Keys",
        year: 2012,
        minutes: 108,
        genre: "Drama",
        image: "images/piano.jpg",
        photo: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
        logline: "A piano tuner spends a week in a hall that is about to be renovated.",
        synopsis: "He works one note at a time while contractors measure the doors. The music is not a concert. It is the sound of someone making a room honest before it changes. He does not give a speech about it."
      },
      {
        id: "f-shore",
        title: "One Umbrella",
        year: 2024,
        minutes: 91,
        genre: "Comedy",
        image: "images/underwater.jpg",
        photo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        logline: "A beach rental stand has one umbrella left and too many opinions about it.",
        synopsis: "The day is bright and the line is not long, but everybody has a reason. The attendant tries to be fair and fails in small, polite ways. The joke is the negotiation, not a pratfall."
      },
      {
        id: "f-table",
        title: "The Spare Chair",
        year: 2017,
        minutes: 96,
        genre: "Drama",
        image: "images/window.jpg",
        photo: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85",
        logline: "A woman keeps a second chair at a white table for a guest who has not visited in a year.",
        synopsis: "The apartment is almost empty on purpose. She waters nothing and sets out two glasses anyway. When someone finally knocks, the film has already told you what the chair was for."
      },
      {
        id: "f-archive",
        title: "The Archivist",
        year: 2021,
        minutes: 113,
        genre: "Mystery",
        image: "images/archive.jpg",
        photo: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
        logline: "A clerk in a stacks room finds a box that was checked out under her own name.",
        synopsis: "She did not request it. The slip is old and the handwriting looks like hers. She reads the rules, then breaks one of them, and follows the box instead of reporting it. The shelves stay quiet the whole time."
      },
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
        body: "The messages are charming. The last one explains more than it needs to. I still liked the pocket they hid it in.",
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
      },
      {
        id: "r-salt-1",
        filmId: "f-salt",
        author: "June Park",
        sample: true,
        rating: 4,
        title: "The coastline moves",
        body: "The flight footage is the argument. I believed the jetty because nobody in the office would name it.",
        at: "2024-08-03T15:20"
      },
      {
        id: "r-pines-1",
        filmId: "f-pines",
        author: "Rowan Ellis",
        sample: true,
        rating: 4,
        title: "Marks the map missed",
        body: "She marks trees her spring map does not mention. The film walks with her and does not explain the blazes from a desk.",
        at: "2023-10-19T18:40"
      },
      {
        id: "r-piano-1",
        filmId: "f-piano",
        author: "June Park",
        sample: true,
        rating: 5,
        title: "One key, then the next",
        body: "The renovation is loud and the tuning is not. That contrast is the whole movie, and it holds.",
        at: "2022-05-22T20:05"
      },
      {
        id: "r-field-1",
        filmId: "f-field",
        author: "Rowan Ellis",
        sample: true,
        rating: 4,
        title: "A mark, not a monster",
        body: "The sky in the picture is huge and the observatory stays small. I liked that the smudge never turns into a villain.",
        at: "2025-07-01T21:15"
      },
      {
        id: "r-bike-1",
        filmId: "f-bike",
        author: "June Park",
        sample: true,
        rating: 4,
        title: "Sunday, on purpose",
        body: "Everyone claims the closed street and nobody is the villain. The joke is the argument, which stays polite.",
        at: "2024-11-10T14:00"
      }
    ]
  };

  window.MarqueeData = {
    seed: function () {
      return JSON.parse(JSON.stringify(SEED));
    }
  };
})();
