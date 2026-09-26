/* Seed data for the Felis Investigations portfolio demo. */
(function () {
  var SEED = {
    version: 1,
    users: [
      {
        id: "u-avery",
        email: "avery@felis.demo",
        name: "Quinn, Avery",
        phone: "517-555-0142",
        address: "410 Grove Street, East Lansing",
        notes: "Principal. Handles the files that should stay quiet.",
        role: "A",
        password: "demo-admin",
        seedPassword: "demo-admin",
        joined: "2015-01-01T09:00"
      },
      {
        id: "u-harvey",
        email: "harvey@felis.demo",
        name: "Martin, Harvey",
        phone: "517-555-0177",
        address: "88 Kalamazoo Street, Lansing",
        notes: "Night surveillance. Prefers a thermos and a quiet street.",
        role: "S",
        password: "demo-staff",
        seedPassword: "demo-staff",
        joined: "2015-01-22T09:00"
      },
      {
        id: "u-levon",
        email: "levon@felis.demo",
        name: "Helm, Levon",
        phone: "517-555-0119",
        address: "12 Woodbridge, East Lansing",
        notes: "Client. Felix has been loud after midnight for two weeks.",
        role: "C",
        password: "demo-client",
        seedPassword: "demo-client",
        joined: "2016-02-01T09:00"
      },
      {
        id: "u-mary",
        email: "mary@felis.demo",
        name: "Astor, Mary",
        phone: "517-555-0164",
        address: "7 Bailey Street, East Lansing",
        notes: "Client. Asked us to find Grizabella, then to watch a garden tabby.",
        role: "C",
        password: "demo-client",
        seedPassword: "demo-client",
        joined: "2016-01-12T09:00"
      }
    ],
    cases: [
      {
        id: "c-felix",
        number: "16-2044",
        clientId: "u-levon",
        agentId: "u-harvey",
        summary: "Felix caterwauling every night.",
        status: "open",
        notes: [
          {
            id: "n-felix-1",
            at: "2016-02-10T11:35",
            agentId: "u-harvey",
            body: "Initial meeting with client. He's very concerned Felix will just not shut up at night. It's not like him to caterwaul so much, so there must be something going on in the neighborhood."
          },
          {
            id: "n-felix-2",
            at: "2016-02-14T14:15",
            agentId: "u-harvey",
            body: "Met with the client to discuss the case."
          }
        ],
        reports: [
          {
            id: "r-felix-1",
            at: "2016-02-12T01:35",
            agentId: "u-harvey",
            summary: "Surveillance of neighborhood for three hours. Nothing untoward spotted.",
            detail: "Walked the block from midnight to 3:00am. Felix was restless but quiet. No other cats on the fences.",
            photos: []
          },
          {
            id: "r-felix-2",
            at: "2016-02-13T02:15",
            agentId: "u-harvey",
            summary: "Surveillance of neighborhood for two hours. Spotted a very attractive Siamese cat wandering through. Caterwauling commenced.",
            detail: "Arrived at 1:00am. Everything was quiet for about an hour. Suddenly, a Siamese cat wandered by and the caterwauling began. I think the Siamese was enjoying the attention, since she hung around for over an hour. Felix didn't shut up until she finally left. She didn't seem interested in him, though.",
            photos: [
              { caption: "The offender, on the fence", time: "2:05 AM" }
            ]
          }
        ]
      },
      {
        id: "c-tabby",
        number: "16-1182",
        clientId: "u-mary",
        agentId: "u-avery",
        summary: "Tabby sneaking around her place.",
        status: "open",
        notes: [
          {
            id: "n-tabby-1",
            at: "2016-02-16T16:10",
            agentId: "u-avery",
            body: "Client says a tabby sits on the garden wall at dusk and watches the kitchen window. No theft yet. She wants a name, not a confrontation."
          }
        ],
        reports: [
          {
            id: "r-tabby-1",
            at: "2016-02-16T19:40",
            agentId: "u-avery",
            summary: "Watched the wall from the alley. The tabby arrived, sat, and left when the porch light came on.",
            detail: "Orange tabby, no collar, notch in the left ear. Stayed twenty minutes. Did not approach the door.",
            photos: []
          }
        ]
      },
      {
        id: "c-cans",
        number: "16-0901",
        clientId: "u-levon",
        agentId: "u-harvey",
        summary: "Garbage cans regularly knocked over.",
        status: "open",
        notes: [
          {
            id: "n-cans-1",
            at: "2016-02-11T08:05",
            agentId: "u-harvey",
            body: "Cans down three nights running. Client suspects a gray tom. Asked us not to involve the neighbors yet."
          }
        ],
        reports: [
          {
            id: "r-cans-1",
            at: "2016-02-12T01:19",
            agentId: "u-harvey",
            summary: "Cans down again. Paw prints in the coffee grounds. No collar.",
            detail: "Prints are too large for Felix. A gray shape left toward the alley behind the Italian restaurant.",
            photos: []
          }
        ]
      },
      {
        id: "c-griz",
        number: "15-0770",
        clientId: "u-mary",
        agentId: "u-avery",
        summary: "Missing cat Grizabella.",
        status: "closed",
        notes: [
          {
            id: "n-griz-1",
            at: "2015-11-02T10:00",
            agentId: "u-avery",
            body: "Family had not seen her in six weeks. Last sighting was near the restaurant on Grand River."
          }
        ],
        reports: [
          {
            id: "r-griz-1",
            at: "2015-11-04T21:10",
            agentId: "u-avery",
            summary: "Found behind the Italian restaurant. Returned home the same night.",
            detail: "She was healthy and accepting lasagna from a stranger. She came when called. The family has her back.",
            photos: []
          }
        ]
      }
    ],
    requests: []
  };

  window.FelisData = {
    seed: function () {
      return JSON.parse(JSON.stringify(SEED));
    }
  };
})();
