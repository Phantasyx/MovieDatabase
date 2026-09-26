/* Felis Investigations desk. Static demo: routes, screens, and form handlers. */
(function () {
  var pageError = "";
  var caseFilter = { q: "", status: "all" };
  var lastKey = null;
  var rendering = false;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function mark() {
    return '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="2.5"/><path fill="currentColor" d="M22 28 L16 14 L29 24 Z M42 28 L48 14 L35 24 Z"/><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M20 36c1.5 6 7 10 12 10s10.5-4 12-10"/><circle cx="26" cy="32" r="2" fill="currentColor"/><circle cx="38" cy="32" r="2" fill="currentColor"/></svg>';
  }

  function sketch() {
    return '<svg viewBox="0 0 72 72" aria-hidden="true" focusable="false"><rect x="1" y="1" width="70" height="70" rx="8" fill="#f7f3eb" stroke="#e4dccf"/><path fill="#16352b" d="M24 34 L18 18 L32 30 Z M48 34 L54 18 L40 30 Z"/><circle cx="30" cy="36" r="2" fill="#a67c3d"/><circle cx="42" cy="36" r="2" fill="#a67c3d"/><path fill="none" stroke="#16352b" stroke-width="2" d="M24 44c2 5 7 8 12 8s10-3 12-8"/></svg>';
  }

  function displayName(name) {
    var parts = String(name || "").split(",");
    if (parts.length < 2) return name || "";
    return parts[1].trim() + " " + parts[0].trim();
  }

  function roleLabel(role) {
    if (role === "A") return "Admin";
    if (role === "S") return "Staff";
    if (role === "C") return "Client";
    return role || "";
  }

  function isStaff(user) {
    return !!(user && (user.role === "A" || user.role === "S"));
  }

  function formatWhen(iso) {
    if (!iso) return "";
    if (String(iso).indexOf("Z") !== -1) {
      var parsed = new Date(iso);
      if (!isNaN(parsed.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "America/Detroit"
        }).format(parsed);
      }
    }
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
    if (!match) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hour = Number(match[4]);
    var ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return months[Number(match[2]) - 1] + " " + Number(match[3]) + ", " + match[1] + ", " + hour + ":" + match[5] + " " + ampm;
  }

  function wallInput(iso) {
    var match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(iso || "");
    if (!match) return "";
    return match[1] + " " + match[2];
  }

  function parseWhen(input) {
    var match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/.exec(String(input || "").trim());
    if (!match) return "";
    var hour = String(match[4]).padStart(2, "0");
    return match[1] + "-" + match[2] + "-" + match[3] + "T" + hour + ":" + match[5];
  }

  function todayLine() {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Detroit"
    }).format(new Date());
  }

  function val(form, name) {
    return String(new FormData(form).get(name) || "").trim();
  }

  function partsFromHash() {
    var raw = (location.hash || "").replace(/^#/, "");
    var path = raw.split("?")[0];
    return path.split("/").filter(Boolean);
  }

  function person(id) {
    return FelisStore.userById(id);
  }

  function options(users, selected) {
    return users.map(function (user) {
      var sel = user.id === selected ? " selected" : "";
      return '<option value="' + esc(user.id) + '"' + sel + ">" + esc(user.name) + "</option>";
    }).join("");
  }

  function shell(body, user, parts) {
    var flash = FelisStore.takeFlash();
    var head = parts[0] || "home";
    var current = head === "case" ? "cases" : head === "user" ? "users" : head;
    var links = "";
    if (!user) {
      links = '<a href="#/login"' + (current === "login" ? ' aria-current="page"' : "") + ">Log in</a>";
    } else if (user.role === "C") {
      links = '<a href="#/client"' + (current === "client" ? ' aria-current="page"' : "") + ">Your cases</a>";
    } else {
      links =
        '<a href="#/staff"' + (current === "staff" ? ' aria-current="page"' : "") + ">Staff</a>" +
        '<a href="#/cases"' + (current === "cases" ? ' aria-current="page"' : "") + ">Cases</a>" +
        '<a href="#/users"' + (current === "users" ? ' aria-current="page"' : "") + ">Users</a>";
    }
    var logout = user ? '<button type="button" class="nav-link" data-action="logout">Log out</button>' : "";
    var notice = "";
    if (flash) notice += '<p class="banner" role="status">' + esc(flash) + "</p>";
    if (pageError) notice += '<p class="alert" role="alert" tabindex="-1">' + esc(pageError) + "</p>";
    return (
      '<header class="top"><div class="top-inner">' +
      '<a class="brand" href="#/">' + mark() + "<span>Felis</span></a>" +
      '<button class="nav-toggle" type="button" data-action="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '<nav id="site-nav" class="nav" aria-label="Primary">' + links + logout + "</nav>" +
      "</div></header>" +
      '<main id="main"><div class="wrap">' + notice + body + "</div></main>" +
      '<footer class="site-foot"><p>Felis Investigations is a portfolio demo for <a href="https://phantasyx.com">PhantasyX</a>. Records stay in this browser. No mail is sent.</p>' +
      '<p><button type="button" class="text-button" data-action="reset-demo">Reset demo data</button></p></footer>'
    );
  }

  function homeView(user) {
    var quotes = [
      ["Found out that fluffy was fluffing someone else on the side. Found me a new top cat.", "Anonymous"],
      ["Thanks for ensuring me that Garfield was only interested in Lasagna and not chasing after that mangy cat that lives behind the Italian restaurant.", "Jon"],
      ["They told me nobody could beat the Hidden Paw, but you brought Macavity to justice. Thank you so much.", "Anonymous"],
      ["Thank you so much for finding grandma Grizabella. We thought we would never see her again.", "Valerie Eliot"]
    ].map(function (item) {
      return "<blockquote><p>" + esc(item[0]) + "</p><cite>" + esc(item[1]) + "</cite></blockquote>";
    }).join("");
    var services = [
      ["Shadow work", "People and cats followed by inspectors who know how to stay quiet."],
      ["Missing", "Katnapped kittens, missing cats, and witnesses located."],
      ["After hours", "Theft, blackmail, furniture damage, and worse, investigated without publicity."]
    ].map(function (item) {
      return '<article class="card"><h3>' + esc(item[0]) + "</h3><p>" + esc(item[1]) + "</p></article>";
    }).join("");
    var signed = user
      ? '<p class="signed-in">Signed in as ' + esc(displayName(user.name)) + '. <a href="' + (user.role === "C" ? "#/client" : "#/staff") + '">Open the desk</a>.</p>'
      : "";
    return {
      title: "Felis Investigations",
      html:
        '<section class="hero-grid"><div>' +
        '<p class="kicker">Discreet inquiries</p>' +
        "<h1 tabindex=\"-1\">Investigations conducted without publicity.</h1>" +
        '<p class="lede">Domestic, divorce, and carousing work. People and cats shadowed. Missing cats and witnesses located. Accidents, losses by theft, blackmail, and murder, handled by the Felis desk.</p>' +
        '<p class="actions"><a class="button primary" href="#request">Request an evaluation</a><a class="button secondary" href="#/login">Staff and client login</a></p>' +
        signed + "</div>" +
        '<aside class="dossier" aria-label="Sample case file"><p class="kicker">Sample file</p><h2>16-2044</h2><p>Felix caterwauling every night.</p><p><span class="pill open">Open</span></p>' +
        '<dl class="meta"><div><dt>Client</dt><dd>Levon Helm</dd></div><div><dt>Agent</dt><dd>Harvey Martin</dd></div></dl></aside></section>' +
        '<section class="section"><h2>What the desk handles</h2><div class="cards">' + services + "</div></section>" +
        '<section class="section"><h2>Testimonials</h2><div class="quotes">' + quotes + "</div></section>" +
        '<section class="section" id="request"><h2>Request a free evaluation</h2>' +
        '<p class="hint">This form does not email anyone. It saves the note in this browser, where a staff demo login can read it.</p>' +
        '<form data-action="request"><fieldset><legend>Tell us the trouble</legend>' +
        '<p class="hp"><label for="company">Company</label><input id="company" name="company" tabindex="-1" autocomplete="off"></p>' +
        '<p><label for="name">Name</label><input id="name" name="name" type="text" autocomplete="name" required></p>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></p>' +
        '<p><label for="message">Message</label><textarea id="message" name="message" required></textarea></p>' +
        '<p><button class="button primary" type="submit">Save request</button></p></fieldset></form></section>'
    };
  }

  function loginView(user) {
    var note = user ? '<p class="hint">You are signed in as ' + esc(displayName(user.name)) + ". You can switch accounts.</p>" : "";
    var cards = FelisStore.users().map(function (account) {
      var changed = account.password !== account.seedPassword ? " (changed in this browser)" : "";
      return '<article class="account"><h3>' + esc(displayName(account.name)) + "</h3><p>" + esc(roleLabel(account.role)) + "</p><p><strong>" + esc(account.email) + "</strong><br>" + esc(account.password) + esc(changed) + "</p>" +
        '<button type="button" class="button secondary small" data-action="fill-login" data-email="' + esc(account.email) + '" data-password="' + esc(account.password) + '">Use this account</button></article>';
    }).join("");
    return {
      title: "Sign in",
      html:
        '<div class="split login-split"><div><p class="kicker">Demo access</p><h1 tabindex="-1">Sign in</h1>' +
        note +
        '<p class="hint">Passwords below are public demo credentials. Changing one updates only this browser.</p>' +
        '<form data-action="login"><fieldset><legend>Login</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></p>' +
        '<p class="actions"><button class="button primary" type="submit">Log in</button><a href="#/reset">Lost password</a></p>' +
        "</fieldset></form></div><div><h2>Demo accounts</h2><div class=\"accounts\">" + cards + "</div></div></div>"
    };
  }

  function resetView() {
    return {
      title: "Reset password",
      html:
        '<p class="kicker">No email is sent</p><h1 tabindex="-1">Choose a new demo password</h1>' +
        '<p class="lede">A hosted desk would mail a one-time link. Here, a known demo address can set a new password in this browser.</p>' +
        '<form data-action="reset-password"><fieldset><legend>Password reset</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">New password</label><input id="password" name="password" type="password" autocomplete="new-password" required></p>' +
        '<p><label for="password2">Repeat password</label><input id="password2" name="password2" type="password" autocomplete="new-password" required></p>' +
        '<p class="hint">At least 8 characters.</p>' +
        '<p class="actions"><button class="button primary" type="submit">Update password</button><a href="#/login">Cancel</a></p>' +
        "</fieldset></form>"
    };
  }

  function staffView(user) {
    var cases = FelisStore.cases();
    var open = cases.filter(function (c) { return c.status === "open"; }).length;
    var clients = FelisStore.users().filter(function (u) { return u.role === "C"; }).length;
    var staff = FelisStore.users().filter(function (u) { return u.role === "A" || u.role === "S"; }).length;
    var activity = [];
    cases.forEach(function (c) {
      c.notes.forEach(function (n) { activity.push({ at: n.at, kind: "Note", text: n.body, id: c.id, number: c.number }); });
      c.reports.forEach(function (r) { activity.push({ at: r.at, kind: "Report", text: r.summary, id: c.id, number: c.number }); });
    });
    activity.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var recent = activity.slice(0, 4).map(function (item) {
      return '<article class="entry"><p class="meta">' + esc(item.kind) + " · " + esc(formatWhen(item.at)) + ' · <a href="#/case/' + esc(item.id) + '">' + esc(item.number) + "</a></p><p>" + esc(item.text) + "</p></article>";
    }).join("");
    var requests = FelisStore.requests();
    var requestHtml = requests.length
      ? requests.map(function (req) {
          return '<article class="entry"><p class="meta">' + esc(req.name) + " · " + esc(req.email) + " · " + esc(formatWhen(req.at)) + '</p><p class="pre">' + esc(req.message) + '</p><p><button type="button" class="button secondary small" data-action="dismiss-request" data-id="' + esc(req.id) + '">Dismiss</button></p></article>';
        }).join("")
      : '<p class="empty">Evaluation requests from the public form show up here.</p>';
    return {
      title: "Staff desk",
      html:
        '<p class="kicker">' + esc(todayLine()) + "</p>" +
        '<h1 tabindex="-1">Welcome, ' + esc(displayName(user.name)) + "</h1>" +
        '<p class="lede">This is the Felis staff desk. What you can open depends on the demo role you signed in with.</p>' +
        '<div class="stats"><article class="stat"><strong>' + open + '</strong> Open cases</article><article class="stat"><strong>' + clients + '</strong> Clients</article><article class="stat"><strong>' + staff + "</strong> Staff</article></div>" +
        '<div class="cards section"><article class="card"><a class="stretch" href="#/cases"><h3>Cases</h3><p>Open a file, add a note, or file a surveillance report.</p></a></article>' +
        '<article class="card"><a class="stretch" href="#/users"><h3>Users</h3><p>Clients and inspectors on this browser’s desk.</p></a></article>' +
        '<article class="card"><a class="stretch" href="#/case/new"><h3>New case</h3><p>Start a file for someone already in the client list.</p></a></article></div>' +
        '<section class="section"><h2>Recent activity</h2><div class="timeline">' + (recent || '<p class="empty">No notes yet.</p>') + "</div></section>" +
        '<section class="section"><h2>Evaluation requests</h2><div class="timeline">' + requestHtml + "</div></section>"
    };
  }

  function filteredCases() {
    return FelisStore.cases().filter(function (c) {
      if (caseFilter.status !== "all" && c.status !== caseFilter.status) return false;
      if (!caseFilter.q) return true;
      var client = person(c.clientId);
      var agent = person(c.agentId);
      var hay = [c.number, c.summary, client ? client.name : "", agent ? agent.name : ""].join(" ").toLowerCase();
      return hay.indexOf(caseFilter.q.trim().toLowerCase()) !== -1;
    });
  }

  function caseRow(c) {
    var client = person(c.clientId);
    var agent = person(c.agentId);
    var latest = "—";
    if (c.reports.length) {
      var sorted = c.reports.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
      latest = formatWhen(sorted[0].at);
    }
    return "<tr>" +
      '<td data-label="Select"><input type="radio" name="selected" value="' + esc(c.id) + '" aria-label="Select case ' + esc(c.number) + '"></td>' +
      '<td data-label="Number"><a class="num" href="#/case/' + esc(c.id) + '">' + esc(c.number) + "</a></td>" +
      '<td data-label="Client">' + esc(client ? client.name : "—") + "</td>" +
      '<td data-label="Agent">' + esc(agent ? agent.name : "—") + "</td>" +
      '<td data-label="Summary"><div class="clamp">' + esc(c.summary) + "</div></td>" +
      '<td data-label="Latest">' + esc(latest) + "</td>" +
      '<td data-label="Status"><span class="pill ' + esc(c.status) + '">' + esc(c.status) + "</span></td>" +
      "</tr>";
  }

  function caseRowsHtml() {
    var rows = filteredCases();
    if (!rows.length) return '<tr><td class="empty" colspan="7">No cases match that filter.</td></tr>';
    return rows.map(caseRow).join("");
  }

  function paintCaseRows() {
    var body = document.getElementById("case-rows");
    if (!body) return;
    body.innerHTML = caseRowsHtml();
    var count = document.getElementById("case-count");
    if (count) count.textContent = filteredCases().length + " shown";
  }

  function casesView() {
    return {
      title: "Cases",
      html:
        '<p class="kicker">Staff files</p><h1 tabindex="-1">Cases</h1>' +
        '<div class="toolbar">' +
        '<p class="grow"><label for="case-q">Search</label><input id="case-q" type="search" value="' + esc(caseFilter.q) + '" placeholder="Number, client, summary"></p>' +
        '<p><label for="case-status">Status</label><select id="case-status"><option value="all"' + (caseFilter.status === "all" ? " selected" : "") + '>All</option><option value="open"' + (caseFilter.status === "open" ? " selected" : "") + '>Open</option><option value="closed"' + (caseFilter.status === "closed" ? " selected" : "") + ">Closed</option></select></p>" +
        '<p class="actions"><a class="button primary" href="#/case/new">Add case</a></p></div>' +
        '<form data-action="delete-case"><p class="actions"><button class="button danger" type="submit">Delete selected</button></p>' +
        '<p class="hint" id="case-count">' + filteredCases().length + " shown</p>" +
        '<table class="stack"><thead><tr><th>Select</th><th>Number</th><th>Client</th><th>Agent</th><th>Summary</th><th>Latest</th><th>Status</th></tr></thead><tbody id="case-rows">' +
        caseRowsHtml() + "</tbody></table></form>"
    };
  }

  function newCaseView(user) {
    var clients = FelisStore.users().filter(function (u) { return u.role === "C"; });
    var agents = FelisStore.users().filter(function (u) { return u.role === "A" || u.role === "S"; });
    return {
      title: "New case",
      html:
        '<p class="kicker"><a href="#/cases">Cases</a></p><h1 tabindex="-1">New case</h1>' +
        '<form data-action="new-case"><fieldset><legend>Open a file</legend>' +
        '<p><label for="clientId">Client</label><select id="clientId" name="clientId">' + options(clients, clients[0] && clients[0].id) + "</select></p>" +
        '<p><label for="agentId">Agent in charge</label><select id="agentId" name="agentId">' + options(agents, user.id) + "</select></p>" +
        '<p><label for="number">Case number</label><input id="number" name="number" type="text" placeholder="16-3001" required></p>' +
        '<p><label for="summary">Summary</label><input id="summary" name="summary" type="text" required></p>' +
        '<p class="actions"><button class="button primary" type="submit">Create case</button><a href="#/cases">Cancel</a></p>' +
        "</fieldset></form>"
    };
  }

  function timeline(items, renderItem) {
    if (!items.length) return '<p class="empty">Nothing filed yet.</p>';
    return '<div class="timeline">' + items.map(renderItem).join("") + "</div>";
  }

  function caseDetail(id, user) {
    var c = FelisStore.caseById(id);
    if (!c) return missingView();
    var client = person(c.clientId);
    var agent = person(c.agentId);
    var staff = isStaff(user);
    var back = staff ? '<a href="#/cases">All cases</a>' : '<a href="#/client">Your cases</a>';
    var notes = c.notes.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var reports = c.reports.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var noteHtml = timeline(notes, function (n) {
      var who = person(n.agentId);
      return '<article class="entry"><p class="meta">' + esc(formatWhen(n.at)) + " · " + esc(who ? who.name : "Desk") + "</p><p>" + esc(n.body) + "</p></article>";
    });
    var reportHtml = timeline(reports, function (r) {
      var who = person(r.agentId);
      return '<article class="entry"><p class="meta"><a href="#/case/' + esc(c.id) + "/report/" + esc(r.id) + '">' + esc(formatWhen(r.at)) + "</a> · " + esc(who ? who.name : "Desk") + "</p><p>" + esc(r.summary) + "</p></article>";
    });
    var editor = staff
      ? '<form data-action="save-case" data-id="' + esc(c.id) + '"><fieldset><legend>File</legend>' +
        "<p>Client: " + esc(client ? client.name : "—") + "</p>" +
        '<p><label for="number">Case number</label><input id="number" name="number" type="text" value="' + esc(c.number) + '" required></p>' +
        '<p><label for="summary">Summary</label><input id="summary" name="summary" type="text" value="' + esc(c.summary) + '" required></p>' +
        '<p><label for="agent">Agent in charge</label><select id="agent" name="agent">' + options(FelisStore.users().filter(function (u) { return u.role === "A" || u.role === "S"; }), c.agentId) + "</select></p>" +
        '<p><label for="status">Status</label><select id="status" name="status"><option value="open"' + (c.status === "open" ? " selected" : "") + '>Open</option><option value="closed"' + (c.status === "closed" ? " selected" : "") + ">Closed</option></select></p>" +
        '<p><button class="button primary" type="submit">Update case</button></p></fieldset></form>'
      : '<div class="panel"><h2>' + esc(c.number) + "</h2><p>" + esc(c.summary) + '</p><p><span class="pill ' + esc(c.status) + '">' + esc(c.status) + "</span></p>" +
        "<p>Agent: " + esc(agent ? displayName(agent.name) : "—") + "</p></div>";
    var noteForm = staff
      ? '<form data-action="add-note" data-id="' + esc(c.id) + '"><p><label for="note">Add a note</label><textarea id="note" name="note"></textarea></p><p><button class="button secondary" type="submit">Add note</button></p></form>'
      : "";
    var addReport = staff ? '<p><a class="button secondary" href="#/case/' + esc(c.id) + '/report/new">Add report</a></p>' : "";
    return {
      title: c.number,
      html:
        '<p class="kicker">' + back + "</p><h1 tabindex=\"-1\">" + esc(c.number) + "</h1>" +
        '<p class="lede">' + esc(c.summary) + "</p>" +
        '<div class="case-layout"><div>' + editor + "</div><div>" +
        "<h2>Notes</h2>" + noteHtml + noteForm +
        "<h2>Reports</h2>" + reportHtml + addReport +
        "</div></div>"
    };
  }

  function reportView(parts, user) {
    var c = FelisStore.caseById(parts[1]);
    if (!c) return missingView();
    var reportId = parts[3];
    var report = reportId === "new" ? null : c.reports.find(function (r) { return r.id === reportId; });
    if (reportId !== "new" && !report) return missingView();
    var staff = isStaff(user);
    var photos = (report && report.photos ? report.photos : []).map(function (photo) {
      return '<figure class="sketch">' + sketch() + "<figcaption><strong>" + esc(photo.caption) + "</strong><br><span class=\"hint\">" + esc(photo.time) + "</span></figcaption></figure>";
    }).join("");
    if (!staff) {
      if (!report) return missingView();
      return {
        title: "Report",
        html:
          '<p class="kicker"><a href="#/case/' + esc(c.id) + '">Back to ' + esc(c.number) + "</a></p>" +
          '<h1 tabindex="-1">' + esc(report.summary) + "</h1>" +
          "<p>" + esc(formatWhen(report.at)) + "</p><p class=\"pre\">" + esc(report.detail || "") + "</p>" +
          "<h2>Photo notes</h2>" + (photos || '<p class="empty">No photo notes.</p>')
      };
    }
    var action = report ? "save-report" : "create-report";
    return {
      title: report ? "Edit report" : "New report",
      html:
        '<p class="kicker"><a href="#/case/' + esc(c.id) + '">Back to ' + esc(c.number) + "</a></p>" +
        "<h1 tabindex=\"-1\">" + (report ? "Case report" : "New report") + "</h1>" +
        "<p>Client: " + esc((person(c.clientId) || {}).name || "—") + "<br>Case: " + esc(c.summary) + "</p>" +
        '<form data-action="' + action + '" data-case="' + esc(c.id) + '" data-report="' + esc(report ? report.id : "") + '"><fieldset><legend>Report</legend>' +
        '<p><label for="at">Date and time</label><input id="at" name="at" type="text" value="' + esc(report ? wallInput(report.at) : wallInput(new Date().toISOString().slice(0, 16))) + '" placeholder="2016-02-12 01:35" required></p>' +
        '<p class="hint">Use year-month-day and 24-hour time, for example 2016-02-13 02:15.</p>' +
        '<p><label for="summary">Summary</label><textarea id="summary" name="summary" required>' + esc(report ? report.summary : "") + "</textarea></p>" +
        '<p><label for="detail">Detail</label><textarea id="detail" name="detail">' + esc(report ? report.detail : "") + "</textarea></p>" +
        '<p><button class="button primary" type="submit">Save report</button></p></fieldset></form>' +
        "<h2>Photo notes</h2><p class=\"hint\">Captions stay in this browser. Files are not uploaded.</p>" +
        (photos || '<p class="empty">No photo notes yet.</p>') +
        (report ? '<form data-action="add-photo" data-case="' + esc(c.id) + '" data-report="' + esc(report.id) + '"><fieldset><legend>Add a photo note</legend><p><label for="caption">Caption</label><input id="caption" name="caption" type="text" required></p><p><label for="time">Time seen</label><input id="time" name="time" type="text" placeholder="2:05 AM"></p><p><button class="button secondary" type="submit">Add photo note</button></p></fieldset></form>' : '<p class="hint">Save the report before adding photo notes.</p>')
    };
  }

  function usersView(actor) {
    var rows = FelisStore.users().map(function (user) {
      return "<tr>" +
        '<td data-label="Select"><input type="radio" name="selected" value="' + esc(user.id) + '" aria-label="Select ' + esc(user.name) + '"></td>' +
        '<td data-label="Name"><a href="#/user/' + esc(user.id) + '">' + esc(user.name) + "</a></td>" +
        '<td data-label="Email">' + esc(user.email) + "</td>" +
        '<td data-label="Role">' + esc(roleLabel(user.role)) + "</td></tr>";
    }).join("");
    return {
      title: "Users",
      html:
        '<p class="kicker">Directory</p><h1 tabindex="-1">Users</h1>' +
        '<p class="hint">New accounts get the demo password <strong>demo-new-user</strong>. It is listed on the sign-in page.</p>' +
        '<form data-action="delete-user" data-actor="' + esc(actor.id) + '"><p class="actions"><a class="button primary" href="#/user/new">Add user</a><button class="button danger" type="submit">Delete selected</button></p>' +
        '<table class="stack"><thead><tr><th>Select</th><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>' + rows + "</tbody></table></form>"
    };
  }

  function userView(parts) {
    var id = parts[1];
    var user = id === "new" ? null : FelisStore.userById(id);
    if (id !== "new" && !user) return missingView();
    var role = user ? user.role : "C";
    function roleOpt(value, label) {
      return '<option value="' + value + '"' + (role === value ? " selected" : "") + ">" + label + "</option>";
    }
    return {
      title: user ? "Edit user" : "New user",
      html:
        '<p class="kicker"><a href="#/users">Users</a></p><h1 tabindex="-1">' + (user ? "Edit user" : "New user") + "</h1>" +
        (user ? '<p class="hint">Password changes happen on the <a href="#/reset">reset page</a>, which does not send email.</p>' : "") +
        '<form data-action="save-user" data-id="' + esc(user ? user.id : "new") + '"><fieldset><legend>Person</legend>' +
        '<p><label for="name">Name</label><input id="name" name="name" type="text" value="' + esc(user ? user.name : "") + '" placeholder="Last, First" required></p>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" value="' + esc(user ? user.email : "") + '" required></p>' +
        '<p><label for="phone">Phone</label><input id="phone" name="phone" type="text" value="' + esc(user ? user.phone : "") + '"></p>' +
        '<p><label for="address">Address</label><input id="address" name="address" type="text" value="' + esc(user ? user.address : "") + '"></p>' +
        '<p><label for="notes">Notes</label><textarea id="notes" name="notes">' + esc(user ? user.notes : "") + "</textarea></p>" +
        '<p><label for="role">Role</label><select id="role" name="role">' + roleOpt("A", "Admin") + roleOpt("S", "Staff") + roleOpt("C", "Client") + "</select></p>" +
        '<p class="actions"><button class="button primary" type="submit">Save</button><a href="#/users">Cancel</a></p></fieldset></form>'
    };
  }

  function clientView(user) {
    var rows = FelisStore.cases().filter(function (c) { return c.clientId === user.id; });
    var body = rows.length ? rows.map(function (c) {
      var agent = person(c.agentId);
      var latest = "—";
      if (c.reports.length) {
        var sorted = c.reports.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
        latest = formatWhen(sorted[0].at);
      }
      return "<tr><td data-label=\"Agent\">" + esc(agent ? agent.name : "—") + "</td>" +
        '<td data-label="Description"><a href="#/case/' + esc(c.id) + '">' + esc(c.summary) + "</a></td>" +
        '<td data-label="Latest report">' + esc(latest) + "</td>" +
        '<td data-label="Status"><span class="pill ' + esc(c.status) + '">' + esc(c.status) + "</span></td></tr>";
    }).join("") : '<tr><td class="empty" colspan="4">No files are under your name.</td></tr>';
    return {
      title: "Your cases",
      html:
        '<p class="kicker">' + esc(todayLine()) + "</p>" +
        '<h1 tabindex="-1">Welcome, ' + esc(displayName(user.name)) + "</h1>" +
        "<p class=\"lede\">Thank you for choosing Felis Investigations. These are the files opened in your name.</p>" +
        '<table class="stack"><thead><tr><th>Agent in charge</th><th>Description</th><th>Most recent report</th><th>Status</th></tr></thead><tbody>' + body + "</tbody></table>"
    };
  }

  function missingView() {
    return {
      title: "Not on the desk",
      html: '<h1 tabindex="-1">That page is not on the desk.</h1><p><a class="button secondary" href="#/">Back home</a></p>'
    };
  }

  function caseView(parts, user) {
    if (parts[1] === "new") return newCaseView(user);
    if (parts[2] === "report") return reportView(parts, user);
    if (!parts[1]) return missingView();
    return caseDetail(parts[1], user);
  }

  function viewFor(parts, user) {
    var head = parts[0] || "home";
    if (head === "home") return homeView(user);
    if (head === "login") return loginView(user);
    if (head === "reset") return resetView();
    if (head === "staff") return staffView(user);
    if (head === "cases") return casesView();
    if (head === "case") return caseView(parts, user);
    if (head === "users") return usersView(user);
    if (head === "user") return userView(parts);
    if (head === "client") return clientView(user);
    return missingView();
  }

  function clientAllowed(parts, user) {
    var head = parts[0] || "home";
    if (head === "home" || head === "login" || head === "reset" || head === "client") return true;
    if (head === "case" && parts[1] && parts[1] !== "new") {
      if (parts[2] === "report" && (!parts[3] || parts[3] === "new")) return false;
      var c = FelisStore.caseById(parts[1]);
      return !!(c && c.clientId === user.id);
    }
    return false;
  }

  function navigate(hash) {
    pageError = "";
    if (location.hash === hash) {
      if (!rendering) render();
      return;
    }
    location.hash = hash;
  }

  function render() {
    var parts = partsFromHash();
    var head = parts[0] || "home";
    var user = FelisStore.current();
    var publicHead = head === "home" || head === "login" || head === "reset";
    rendering = true;
    if (!user && !publicHead) {
      rendering = false;
      navigate("#/login");
      return;
    }
    if (user && user.role === "C" && !clientAllowed(parts, user)) {
      FelisStore.setFlash("That file is not on your desk.");
      rendering = false;
      navigate("#/client");
      return;
    }
    if (user && user.role !== "C" && head === "client") {
      rendering = false;
      navigate("#/staff");
      return;
    }
    var view = viewFor(parts, user);
    var app = document.getElementById("app");
    app.innerHTML = shell(view.html, user, parts);
    document.title = view.title === "Felis Investigations" ? view.title : view.title + " · Felis Investigations";
    var key = parts.join("/") || "home";
    if (key !== lastKey) {
      lastKey = key;
      window.scrollTo(0, 0);
      var heading = document.querySelector("#main h1");
      if (heading) heading.focus();
    } else if (pageError) {
      var alert = document.querySelector("[role='alert']");
      if (alert) alert.focus();
    }
    rendering = false;
  }

  function requireStaff() {
    var user = FelisStore.current();
    if (!isStaff(user)) {
      FelisStore.setFlash("That desk is for staff.");
      navigate(user && user.role === "C" ? "#/client" : "#/login");
      return null;
    }
    return user;
  }

  function succeed(message) {
    pageError = "";
    FelisStore.setFlash(message);
    render();
  }

  function onClick(event) {
    var btn = event.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.dataset.action;
    if (action === "nav-toggle") {
      var nav = document.getElementById("site-nav");
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (action === "logout") {
      event.preventDefault();
      FelisStore.logout();
      FelisStore.setFlash("Signed out. Demo records are still in this browser.");
      navigate("#/");
      return;
    }
    if (action === "reset-demo") {
      if (!window.confirm("Reset cases, users, and saved requests in this browser?")) return;
      FelisStore.reset();
      caseFilter = { q: "", status: "all" };
      FelisStore.setFlash("Demo data reset.");
      navigate("#/");
      return;
    }
    if (action === "fill-login") {
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      if (email) email.value = btn.dataset.email || "";
      if (password) password.value = btn.dataset.password || "";
      if (password) password.focus();
      return;
    }
    if (action === "dismiss-request") {
      if (!requireStaff()) return;
      FelisStore.dismissRequest(btn.dataset.id);
      succeed("Request dismissed.");
    }
  }

  function onSubmit(event) {
    var form = event.target;
    if (!form || !form.dataset || !form.dataset.action) return;
    event.preventDefault();
    var action = form.dataset.action;
    var result;

    if (action === "request") {
      result = FelisStore.addRequest({
        name: val(form, "name"),
        email: val(form, "email"),
        message: val(form, "message"),
        company: val(form, "company")
      });
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed(result.ignored ? "Thanks. That note was set aside." : "Saved in this browser. Sign in as staff to read it on the desk.");
      return;
    }

    if (action === "login") {
      result = FelisStore.login(val(form, "email"), val(form, "password"));
      if (!result.ok) { pageError = result.error; render(); return; }
      FelisStore.setFlash("Signed in as " + displayName(result.user.name) + ".");
      navigate(result.user.role === "C" ? "#/client" : "#/staff");
      return;
    }

    if (action === "reset-password") {
      result = FelisStore.setPassword(val(form, "email"), val(form, "password"), val(form, "password2"));
      if (!result.ok) { pageError = result.error; render(); return; }
      FelisStore.setFlash("Password updated in this browser. Sign in with the new one.");
      navigate("#/login");
      return;
    }

    if (action === "delete-case") {
      if (!requireStaff()) return;
      var selectedCase = val(form, "selected");
      if (!selectedCase) { pageError = "Select a case first."; render(); return; }
      var doomed = FelisStore.caseById(selectedCase);
      if (!doomed) { pageError = "Case not found."; render(); return; }
      if (!window.confirm("Delete case " + doomed.number + "? This only changes demo data in this browser.")) return;
      FelisStore.deleteCase(selectedCase);
      succeed("Case " + doomed.number + " deleted.");
      return;
    }

    if (action === "new-case") {
      var actor = requireStaff();
      if (!actor) return;
      result = FelisStore.addCase({
        number: val(form, "number"),
        summary: val(form, "summary"),
        clientId: val(form, "clientId"),
        agentId: val(form, "agentId")
      });
      if (!result.ok) { pageError = result.error; render(); return; }
      FelisStore.setFlash("Case opened.");
      navigate("#/case/" + result.id);
      return;
    }

    if (action === "save-case") {
      if (!requireStaff()) return;
      result = FelisStore.updateCase(form.dataset.id, {
        number: val(form, "number"),
        summary: val(form, "summary"),
        agentId: val(form, "agent"),
        status: val(form, "status")
      });
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed("Case updated.");
      return;
    }

    if (action === "add-note") {
      var noteUser = requireStaff();
      if (!noteUser) return;
      result = FelisStore.addNote(form.dataset.id, val(form, "note"), noteUser.id);
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed("Note added.");
      return;
    }

    if (action === "create-report" || action === "save-report") {
      var reportUser = requireStaff();
      if (!reportUser) return;
      var when = parseWhen(val(form, "at"));
      var payload = { at: when, summary: val(form, "summary"), detail: val(form, "detail"), agentId: reportUser.id };
      if (!when) { pageError = "Use a date and time like 2016-02-12 01:35."; render(); return; }
      if (action === "create-report") result = FelisStore.addReport(form.dataset.case, payload);
      else result = FelisStore.updateReport(form.dataset.case, form.dataset.report, payload);
      if (!result.ok) { pageError = result.error; render(); return; }
      FelisStore.setFlash(action === "create-report" ? "Report added." : "Report saved.");
      navigate("#/case/" + form.dataset.case);
      return;
    }

    if (action === "add-photo") {
      if (!requireStaff()) return;
      result = FelisStore.addPhoto(form.dataset.case, form.dataset.report, {
        caption: val(form, "caption"),
        time: val(form, "time")
      });
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed("Photo note added.");
      return;
    }

    if (action === "save-user") {
      if (!requireStaff()) return;
      var fields = {
        name: val(form, "name"),
        email: val(form, "email"),
        phone: val(form, "phone"),
        address: val(form, "address"),
        notes: val(form, "notes"),
        role: val(form, "role")
      };
      if (form.dataset.id === "new") result = FelisStore.addUser(fields);
      else result = FelisStore.updateUser(form.dataset.id, fields);
      if (!result.ok) { pageError = result.error; render(); return; }
      FelisStore.setFlash(form.dataset.id === "new" ? "User added. Demo password: demo-new-user." : "User saved.");
      navigate("#/users");
      return;
    }

    if (action === "delete-user") {
      var deleter = requireStaff();
      if (!deleter) return;
      var selectedUser = val(form, "selected");
      if (!selectedUser) { pageError = "Select a user first."; render(); return; }
      var who = FelisStore.userById(selectedUser);
      if (who && !window.confirm("Delete " + who.name + " from this browser’s demo?")) return;
      result = FelisStore.deleteUser(selectedUser, deleter.id);
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed("User deleted.");
    }
  }

  function onInput(event) {
    if (event.target.id === "case-q") {
      caseFilter.q = event.target.value;
      paintCaseRows();
    }
  }

  function onChange(event) {
    if (event.target.id === "case-status") {
      caseFilter.status = event.target.value;
      paintCaseRows();
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onChange);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var nav = document.getElementById("site-nav");
    if (nav && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      var toggle = document.querySelector(".nav-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("hashchange", function () {
    pageError = "";
    render();
  });

  FelisStore.init();
  render();
})();
