/* Marquee shelf. Hash routes, no network calls. */
(function () {
  var pageError = "";
  var shelfFilter = { q: "", genre: "all" };
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

  function partsFromHash() {
    var raw = (location.hash || "").replace(/^#/, "");
    return raw.split("?")[0].split("/").filter(Boolean);
  }

  function val(form, name) {
    return String(new FormData(form).get(name) || "").trim();
  }

  function formatWhen(iso) {
    if (!iso) return "";
    if (String(iso).indexOf("Z") !== -1) {
      var parsed = new Date(iso);
      if (!isNaN(parsed.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeZone: "America/Detroit"
        }).format(parsed);
      }
    }
    var match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!match) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[Number(match[2]) - 1] + " " + Number(match[3]) + ", " + match[1];
  }

  function stars(rating) {
    var n = Math.round(Number(rating) || 0);
    var marks = "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(n);
    return '<span class="rating"><span aria-hidden="true">' + marks + "</span> <span>" + n + " of 5</span></span>";
  }

  function average(filmId) {
    var list = MarqueeStore.reviewsFor(filmId);
    if (!list.length) return null;
    var sum = list.reduce(function (total, review) { return total + review.rating; }, 0);
    return sum / list.length;
  }

  function authorName(review) {
    if (review.userId) {
      var user = MarqueeStore.users().find(function (item) { return item.id === review.userId; });
      return user ? user.name : "Demo reviewer";
    }
    return review.author || "Sample reviewer";
  }

  function shell(body, user, parts) {
    var flash = MarqueeStore.takeFlash();
    var head = parts[0] || "shelf";
    function link(id, href, text) {
      return '<a href="' + href + '"' + (head === id ? ' aria-current="page"' : "") + ">" + text + "</a>";
    }
    var links = link("shelf", "#/", "Shelf");
    if (user) links += link("notes", "#/notes", "Your notes");
    links += user ? "" : link("login", "#/login", "Log in");
    var logout = user ? '<button type="button" class="nav-link" data-action="logout">Log out</button>' : "";
    var notice = "";
    if (flash) notice += '<p class="banner" role="status" tabindex="-1">' + esc(flash) + "</p>";
    if (pageError) notice += '<p class="alert" role="alert" tabindex="-1">' + esc(pageError) + "</p>";
    return (
      '<header class="mast"><div class="mast-inner">' +
      '<a class="brand" href="#/">MARQUEE</a>' +
      '<button class="nav-toggle" type="button" data-action="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      '<nav id="site-nav" class="nav" aria-label="Primary">' + links + logout + "</nav>" +
      "</div></header>" +
      '<main id="main"><div class="wrap">' + notice + body + "</div></main>" +
      '<footer class="site-foot"><p>Marquee is an early login-and-review exercise rebuilt as a public demo for <a href="https://phantasyx.com">PhantasyX</a>. The films are sample titles. This is not client work.</p>' +
      '<p><button type="button" class="text-button" data-action="reset-demo">Reset demo data</button></p></footer>'
    );
  }

  function filteredFilms() {
    var q = shelfFilter.q.trim().toLowerCase();
    return MarqueeStore.films().filter(function (film) {
      if (shelfFilter.genre !== "all" && film.genre !== shelfFilter.genre) return false;
      if (!q) return true;
      return (film.title + " " + film.logline + " " + film.genre).toLowerCase().indexOf(q) !== -1;
    });
  }

  function ticket(film) {
    var avg = average(film.id);
    var count = MarqueeStore.reviewsFor(film.id).length;
    var score = avg == null ? "No reviews yet" : (Math.round(avg * 10) / 10).toFixed(1) + " · " + count + (count === 1 ? " review" : " reviews");
    return '<a class="ticket" href="#/film/' + esc(film.id) + '"><span class="stub">' + esc(String(film.year)) + "</span><span class=\"ticket-body\"><p class=\"meta\">" +
      esc(film.genre) + " · " + film.minutes + " min</p><h2>" + esc(film.title) + "</h2><p>" + esc(film.logline) + '</p><p class="meta">' + esc(score) + "</p></span></a>";
  }

  function shelfView(user) {
    var genres = ["all"].concat(MarqueeStore.films().map(function (film) { return film.genre; }).filter(function (genre, index, list) {
      return list.indexOf(genre) === index;
    }));
    var chips = genres.map(function (genre) {
      var pressed = shelfFilter.genre === genre ? "true" : "false";
      var label = genre === "all" ? "All" : genre;
      return '<button type="button" class="chip" data-action="genre" data-genre="' + esc(genre) + '" aria-pressed="' + pressed + '">' + esc(label) + "</button>";
    }).join("");
    var films = filteredFilms();
    var grid = films.length ? films.map(ticket).join("") : '<p class="empty">No films match that filter.</p>';
    var signed = user ? '<p class="meta">Signed in as ' + esc(user.name) + ".</p>" : "";
    return {
      title: "Marquee",
      html:
        '<p class="kicker">Public demo</p><h1 tabindex="-1">A small shelf for writing about movies.</h1>' +
        '<p class="lede">Browse sample films, read sample reviews, and file your own note after you sign in. Everything stays in this browser.</p>' +
        '<p class="honest">Rebuilt from an early PHP login project. No production accounts, no mail, and no client stories.</p>' +
        signed +
        '<div class="toolbar"><p class="grow"><label for="q">Search the shelf</label><input id="q" type="search" value="' + esc(shelfFilter.q) + '" placeholder="Title or logline"></p></div>' +
        '<div class="chips" role="group" aria-label="Genre">' + chips + "</div>" +
        '<div class="shelf">' + grid + "</div>"
    };
  }

  function reviewCard(review) {
    var tag = review.sample ? ' <span class="sample-tag">Sample review</span>' : "";
    var title = review.title ? "<h3>" + esc(review.title) + "</h3>" : "";
    return '<article class="review"><header><p class="meta">' + esc(authorName(review)) + tag + " · " + esc(formatWhen(review.at)) + "</p>" + stars(review.rating) + "</header>" + title + "<p>" + esc(review.body) + "</p></article>";
  }

  function filmView(id, user) {
    var film = MarqueeStore.filmById(id);
    if (!film) return missingView();
    var reviews = MarqueeStore.reviewsFor(film.id).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var avg = average(film.id);
    var score = avg == null ? "No reviews yet" : (Math.round(avg * 10) / 10).toFixed(1) + " average";
    var mine = user ? MarqueeStore.userReview(user.id, film.id) : null;
    var composer = user
      ? '<form data-action="save-review" data-film="' + esc(film.id) + '"><fieldset class="card"><legend>' + (mine ? "Edit your review" : "Write a review") + "</legend>" +
        '<fieldset class="stars"><legend>Rating</legend>' + [1, 2, 3, 4, 5].map(function (n) {
          return '<label><input type="radio" name="rating" value="' + n + '"' + (mine && mine.rating === n ? " checked" : "") + "> " + n + "</label>";
        }).join("") + "</fieldset>" +
        '<p><label for="title">Title</label><input id="title" name="title" type="text" maxlength="80" value="' + esc(mine ? mine.title : "") + '"></p>' +
        '<p><label for="body">Review</label><textarea id="body" name="body" required>' + esc(mine ? mine.body : "") + "</textarea></p>" +
        '<p><button class="primary" type="submit">Save review</button></p></fieldset></form>'
      : '<p class="panel">Sign in with a demo account to file a review. <a href="#/login">Log in</a></p>';
    return {
      title: film.title,
      html:
        '<p class="kicker"><a href="#/">Shelf</a></p><div class="film-top"><h1 tabindex="-1">' + esc(film.title) + "</h1>" +
        '<ul class="facts"><li>' + film.year + "</li><li>" + esc(film.genre) + "</li><li>" + film.minutes + " min</li><li>" + esc(score) + "</li></ul>" +
        "<p>" + esc(film.synopsis) + "</p></div>" +
        "<h2>Reviews</h2>" + (reviews.length ? reviews.map(reviewCard).join("") : '<p class="empty">No reviews on this title yet.</p>') +
        composer
    };
  }

  function notesView(user) {
    var mine = MarqueeStore.reviews().filter(function (review) { return review.userId === user.id; });
    var list = mine.length ? mine.map(function (review) {
      var film = MarqueeStore.filmById(review.filmId);
      return '<article class="review"><p class="meta"><a href="#/film/' + esc(review.filmId) + '">' + esc(film ? film.title : "Film") + "</a> · " + esc(formatWhen(review.at)) + "</p>" + stars(review.rating) + (review.title ? "<h3>" + esc(review.title) + "</h3>" : "") + "<p>" + esc(review.body) + "</p></article>";
    }).join("") : '<p class="empty">You have not filed a review in this browser yet.</p>';
    return {
      title: "Your notes",
      html: '<p class="kicker">' + esc(user.name) + '</p><h1 tabindex="-1">Your notes</h1><p class="lede">Reviews you save are labeled with your demo name. Sample shelf reviews stay marked as samples.</p>' + list
    };
  }

  function loginView(user) {
    var note = user ? '<p class="hint">Signed in as ' + esc(user.name) + ". You can switch accounts.</p>" : "";
    var cards = MarqueeStore.users().map(function (account) {
      var changed = account.password !== account.seedPassword ? " (changed in this browser)" : "";
      var role = account.role === "reviewer" ? "Demo reviewer" : "Demo reader";
      return '<article class="account panel"><h3>' + esc(account.name) + "</h3><p class=\"hint\">" + role + "</p><p class=\"cred\">" + esc(account.email) + "<br>" + esc(account.password) + esc(changed) + '</p><button type="button" class="secondary" data-action="fill-login" data-email="' + esc(account.email) + '" data-password="' + esc(account.password) + '">Use this account</button></article>';
    }).join("");
    return {
      title: "Log in",
      html:
        '<div class="split"><div><p class="kicker">Demo access</p><h1 tabindex="-1">Log in</h1>' + note +
        '<p class="hint">These passwords are public. They only unlock the sample shelf in this browser.</p>' +
        '<form data-action="login"><fieldset class="card"><legend>Sign in</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></p>' +
        '<p class="actions"><button class="primary" type="submit">Log in</button> <a href="#/reset">Lost password</a></p></fieldset></form></div>' +
        '<div><h2>Demo accounts</h2><div class="accounts">' + cards + "</div></div></div>"
    };
  }

  function resetView() {
    return {
      title: "Reset password",
      html:
        '<p class="kicker">No email is sent</p><h1 tabindex="-1">Choose a new demo password</h1>' +
        '<p class="lede">A hosted app would mail a one-time link. Here, a known demo address can set a new password in this browser.</p>' +
        '<form data-action="reset-password"><fieldset class="card"><legend>Password</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">New password</label><input id="password" name="password" type="password" autocomplete="new-password" required></p>' +
        '<p><label for="password2">Repeat password</label><input id="password2" name="password2" type="password" autocomplete="new-password" required></p>' +
        '<p class="hint">At least 8 characters.</p>' +
        '<p class="actions"><button class="primary" type="submit">Update password</button> <a href="#/login">Cancel</a></p></fieldset></form>'
    };
  }

  function missingView() {
    return { title: "Not on the shelf", html: '<h1 tabindex="-1">That page is not on the shelf.</h1><p><a class="button secondary" href="#/">Back to the shelf</a></p>' };
  }

  function viewFor(parts, user) {
    var head = parts[0] || "shelf";
    if (head === "shelf") return shelfView(user);
    if (head === "film") return filmView(parts[1], user);
    if (head === "notes") return notesView(user);
    if (head === "login") return loginView(user);
    if (head === "reset") return resetView();
    return missingView();
  }

  function navigate(hash) {
    pageError = "";
    if (location.hash !== hash) location.hash = hash;
    if (!rendering) render();
  }

  function render() {
    var parts = partsFromHash();
    var head = parts[0] || "shelf";
    var user = MarqueeStore.current();
    rendering = true;
    if (!user && head === "notes") {
      rendering = false;
      navigate("#/login");
      return;
    }
    var key = parts.join("/") || "shelf";
    if (key === lastKey && !pageError && !MarqueeStore.peekFlash()) {
      rendering = false;
      return;
    }
    var view = viewFor(parts, user);
    document.getElementById("app").innerHTML = shell(view.html, user, parts);
    document.title = view.title === "Marquee" ? "Marquee" : view.title + " · Marquee";
    var notice = document.querySelector(".banner, .alert");
    if (key !== lastKey) {
      lastKey = key;
      window.scrollTo(0, 0);
      var heading = document.querySelector("#main h1");
      if (heading) heading.focus();
    } else if (notice) {
      notice.focus();
      notice.scrollIntoView({ block: "center" });
    }
    rendering = false;
  }

  function succeed(message) {
    pageError = "";
    MarqueeStore.setFlash(message);
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
    if (action === "genre") {
      shelfFilter.genre = btn.dataset.genre || "all";
      lastKey = null;
      render();
      var field = document.getElementById("q");
      if (field) field.focus();
      return;
    }
    if (action === "logout") {
      MarqueeStore.logout();
      MarqueeStore.setFlash("Signed out. Reviews you wrote are still in this browser.");
      navigate("#/");
      return;
    }
    if (action === "reset-demo") {
      if (!window.confirm("Reset the sample shelf and any reviews saved in this browser?")) return;
      MarqueeStore.reset();
      shelfFilter = { q: "", genre: "all" };
      MarqueeStore.setFlash("Demo shelf restored.");
      navigate("#/");
      return;
    }
    if (action === "fill-login") {
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      if (email) email.value = btn.dataset.email || "";
      if (password) password.value = btn.dataset.password || "";
      if (password) password.focus();
    }
  }

  function onSubmit(event) {
    var form = event.target;
    if (!form || !form.dataset || !form.dataset.action) return;
    event.preventDefault();
    var action = form.dataset.action;
    var result;
    if (action === "login") {
      result = MarqueeStore.login(val(form, "email"), val(form, "password"));
      if (!result.ok) { pageError = result.error; render(); return; }
      MarqueeStore.setFlash("Signed in as " + result.user.name + ".");
      navigate("#/");
      return;
    }
    if (action === "reset-password") {
      result = MarqueeStore.setPassword(val(form, "email"), val(form, "password"), val(form, "password2"));
      if (!result.ok) { pageError = result.error; render(); return; }
      MarqueeStore.setFlash("Password updated in this browser.");
      navigate("#/login");
      return;
    }
    if (action === "save-review") {
      var user = MarqueeStore.current();
      if (!user) { navigate("#/login"); return; }
      result = MarqueeStore.saveReview(user.id, form.dataset.film, {
        rating: val(form, "rating"),
        title: val(form, "title"),
        body: val(form, "body")
      });
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed(result.updated ? "Review updated." : "Review saved in this browser.");
    }
  }

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", function (event) {
    if (event.target.id === "q") {
      shelfFilter.q = event.target.value;
      var grid = document.querySelector(".shelf");
      if (!grid) return;
      var films = filteredFilms();
      grid.innerHTML = films.length ? films.map(ticket).join("") : '<p class="empty">No films match that filter.</p>';
    }
  });
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

  MarqueeStore.init();
  render();
})();
