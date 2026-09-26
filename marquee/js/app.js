/* Marquee. Hash routes, no network calls. */
(function () {
  var FEATURED = "f-balcony";
  var GENRES = ["Drama", "Mystery", "Adventure", "Comedy", "Documentary", "Romance", "Science fiction"];
  var pageError = "";
  var shelfFilter = { q: "", genre: "all" };
  var returnHash = "#/";
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

  function pageHead() {
    return partsFromHash()[0] || "movies";
  }

  function isMovies(head) {
    return !head || head === "movies" || head === "shelf";
  }

  function reviewRequested() {
    var hash = location.hash || "";
    return hash.indexOf("review=1") !== -1 || hash.indexOf("note=1") !== -1;
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

  function initials(name) {
    return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  function heart() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-4.2-9-8.2C1.2 10 2.4 6.8 5.6 6.2 7.4 5.8 9 6.6 12 9.2 15 6.6 16.6 5.8 18.4 6.2c3.2.6 4.4 3.8 2.6 6.6C18.5 16.8 12 21 12 21z"></path></svg>';
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

  function isFiltering() {
    return !!(shelfFilter.q.trim() || shelfFilter.genre !== "all");
  }

  function filteredFilms() {
    var q = shelfFilter.q.trim().toLowerCase();
    return MarqueeStore.films().filter(function (film) {
      if (shelfFilter.genre !== "all" && film.genre !== shelfFilter.genre) return false;
      if (!q) return true;
      return (film.title + " " + film.logline + " " + film.genre + " " + film.synopsis).toLowerCase().indexOf(q) !== -1;
    });
  }

  function creditsList() {
    return MarqueeStore.films().map(function (film) {
      return "<li>" + esc(film.title) + ' <a href="' + esc(film.photo) + '">Unsplash</a></li>';
    }).join("");
  }

  function shell(body, user) {
    var flash = MarqueeStore.takeFlash();
    var head = pageHead();
    function link(id, href, text) {
      var current = false;
      if (id === "movies") current = isMovies(head);
      else if (id === "reviews") current = head === "reviews" || head === "notes";
      else current = head === id;
      return '<a href="' + href + '"' + (current ? ' aria-current="page"' : "") + ">" + text + "</a>";
    }
    var links = link("movies", "#/", "Movies");
    if (user) {
      links += link("reviews", "#/reviews", "Your reviews");
      links += link("saved", "#/saved", "Saved");
    } else {
      links += link("login", "#/login", "Sign in");
    }
    var logout = user ? '<button type="button" class="nav-link" data-action="logout">Log out</button>' : "";
    var who = user ? '<p class="nav-user">Signed in as ' + esc(user.name) + ".</p>" : "";
    var profile = "";
    if (user) {
      profile = '<a class="profile-link" href="#/profile"' + (head === "profile" ? ' aria-current="page"' : "") +
        ' aria-label="Profile, ' + esc(user.name) + '"><span class="avatar sm" aria-hidden="true">' + esc(initials(user.name)) + "</span></a>";
    }
    var notice = "";
    if (flash) notice += '<p class="banner" role="status" tabindex="-1">' + esc(flash) + "</p>";
    if (pageError) notice += '<p class="alert" role="alert" tabindex="-1">' + esc(pageError) + "</p>";
    return (
      '<header class="top"><div class="top-bar">' +
      '<a class="brand" href="#/">MARQUEE</a>' +
      '<nav id="site-nav" class="nav" aria-label="Primary">' + who + links + logout + "</nav>" +
      '<div class="top-search"><label class="sr" for="q">Search movies</label>' +
      '<input id="q" type="search" value="' + esc(shelfFilter.q) + '" placeholder="Search movies" autocomplete="off"></div>' +
      profile +
      '<button class="nav-toggle" type="button" data-action="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
      "</div></header>" +
      '<main id="main">' + notice + body + "</main>" +
      '<footer class="site-foot"><p>Marquee is a movie catalog. Browse movies, save favorites, write reviews, and open your profile. Favorites and reviews stay in this browser. <a href="https://phantasyx.com">PhantasyX</a>.</p>' +
      '<p><button type="button" class="text-button" data-action="reset-demo">Reset demo data</button></p>' +
      '<details class="credits"><summary>Photograph credits</summary>' +
      '<p>These photographs are from Unsplash and used under the <a href="https://unsplash.com/license">Unsplash License</a>. That license does not require credit. The links are here so each picture can be traced.</p><ul>' +
      creditsList() + "</ul></details></footer>"
    );
  }

  function posterCard(film) {
    var user = MarqueeStore.current();
    var on = !!(user && MarqueeStore.isFavorite(user.id, film.id));
    var avg = average(film.id);
    var score = avg == null ? "" : '<span class="poster-score">' + (Math.round(avg * 10) / 10).toFixed(1) + "</span>";
    var label = on ? "Remove " + film.title + " from favorites" : "Save " + film.title;
    return '<div class="poster-wrap">' +
      '<button type="button" class="fav' + (on ? " is-on" : "") + '" data-action="favorite" data-film="' + esc(film.id) + '" aria-pressed="' + (on ? "true" : "false") + '" aria-label="' + esc(label) + '">' + heart() + "</button>" +
      '<a class="poster" href="#/film/' + esc(film.id) + '">' +
      '<img src="' + esc(film.image) + '" alt="" width="900" height="1200">' +
      '<span class="poster-copy"><span class="poster-title">' + esc(film.title) + "</span>" +
      '<span class="poster-meta">' + esc(String(film.year)) + " · " + esc(film.genre) + score + "</span></span></a></div>";
  }

  function rowBlock(title, films) {
    if (!films.length) return "";
    var cards = films.map(posterCard).join("");
    return '<section class="row"><div class="row-head"><h2>' + esc(title) + "</h2></div>" +
      '<div class="row-frame">' +
      '<button type="button" class="row-nav prev" data-action="row-prev" aria-label="Scroll ' + esc(title) + ' backward"></button>' +
      '<div class="scroller">' + cards + "</div>" +
      '<button type="button" class="row-nav next" data-action="row-next" aria-label="Scroll ' + esc(title) + ' forward"></button>' +
      "</div></section>";
  }

  function heroBlock() {
    var film = MarqueeStore.filmById(FEATURED);
    if (!film) return "";
    var src = film.hero || film.image;
    return '<section class="hero">' +
      '<img class="hero-media" src="' + esc(src) + '" alt="" width="1600" height="900">' +
      '<div class="hero-copy"><p class="kicker">' + esc(film.genre) + " · " + film.year + "</p>" +
      '<h1 tabindex="-1">' + esc(film.title) + "</h1>" +
      '<p class="logline">' + esc(film.logline) + "</p>" +
      '<p class="actions"><a class="btn btn-light" href="#/film/' + esc(film.id) + '">Open title</a> ' +
      '<a class="btn btn-ghost" href="#/film/' + esc(film.id) + '?review=1">Write a review</a></p></div></section>';
  }

  function chipsBlock() {
    var genres = ["all"].concat(GENRES);
    var chips = genres.map(function (genre) {
      var pressed = shelfFilter.genre === genre ? "true" : "false";
      var label = genre === "all" ? "All" : genre;
      return '<button type="button" class="chip" data-action="genre" data-genre="' + esc(genre) + '" aria-pressed="' + pressed + '">' + esc(label) + "</button>";
    }).join("");
    return '<div class="chips" role="group" aria-label="Genre">' + chips + "</div>";
  }

  function paintRows() {
    var rows = document.querySelector(".rows");
    var hero = document.querySelector(".hero");
    if (!rows) return;
    if (hero) hero.hidden = isFiltering();
    rows.innerHTML = isFiltering() ? resultsBlock() : browseBlock();
    if (isFiltering()) document.title = "Search · Marquee";
    else {
      var featured = MarqueeStore.filmById(FEATURED);
      document.title = featured ? featured.title + " · Marquee" : "Marquee";
    }
  }

  function browseBlock() {
    var html = "";
    var user = MarqueeStore.current();
    if (user) html += rowBlock("Saved favorites", MarqueeStore.favoritesFor(user.id));
    GENRES.forEach(function (genre) {
      var films = MarqueeStore.films().filter(function (film) { return film.genre === genre; });
      html += rowBlock(genre, films);
    });
    return html;
  }

  function resultsBlock() {
    var films = filteredFilms();
    if (!films.length) {
      return '<h2>Matching titles</h2><p class="empty">No movies match that search.</p>';
    }
    var label = shelfFilter.genre !== "all" ? shelfFilter.genre : "Matching titles";
    return rowBlock(label, films);
  }

  function moviesView() {
    var filtering = isFiltering();
    var featured = MarqueeStore.filmById(FEATURED);
    return {
      title: filtering ? "Search" : (featured ? featured.title : "Marquee"),
      html: (filtering ? "" : heroBlock()) + '<div class="shelf-tools">' + chipsBlock() + '</div><div class="rows">' + (filtering ? resultsBlock() : browseBlock()) + "</div>"
    };
  }

  function reviewCard(review) {
    var tag = review.sample ? ' <span class="sample-tag">Sample review</span>' : "";
    var title = review.title ? "<h3>" + esc(review.title) + "</h3>" : "";
    return '<article class="review"><header><p class="meta">' + esc(authorName(review)) + tag + " · " + esc(formatWhen(review.at)) + "</p>" + stars(review.rating) + "</header>" + title + "<p>" + esc(review.body) + "</p></article>";
  }

  function favoriteButton(film, user) {
    var on = !!(user && MarqueeStore.isFavorite(user.id, film.id));
    return '<button type="button" class="btn ' + (on ? "btn-light" : "btn-ghost") + '" data-action="favorite" data-film="' + esc(film.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' + (on ? "Saved" : "Save") + "</button>";
  }

  function filmView(id, user) {
    var film = MarqueeStore.filmById(id);
    if (!film) return missingView();
    var reviews = MarqueeStore.reviewsFor(film.id).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var avg = average(film.id);
    var score = avg == null ? "No reviews yet" : (Math.round(avg * 10) / 10).toFixed(1) + " average";
    var mine = user ? MarqueeStore.userReview(user.id, film.id) : null;
    var composer;
    if (user && user.role === "reviewer") {
      composer = '<form id="review" data-action="save-review" data-film="' + esc(film.id) + '"><fieldset class="card"><legend>' + (mine ? "Edit your review" : "Write a review") + "</legend>" +
        '<fieldset class="stars"><legend>Rating</legend>' + [1, 2, 3, 4, 5].map(function (n) {
          return '<label><input type="radio" name="rating" value="' + n + '"' + (mine && mine.rating === n ? " checked" : "") + "> " + n + "</label>";
        }).join("") + "</fieldset>" +
        '<p><label for="title">Title</label><input id="title" name="title" type="text" maxlength="80" value="' + esc(mine ? mine.title : "") + '"></p>' +
        '<p><label for="body">Review</label><textarea id="body" name="body" required>' + esc(mine ? mine.body : "") + "</textarea></p>" +
        '<p><button class="btn btn-red" type="submit">Save review</button></p></fieldset></form>';
    } else if (user) {
      composer = '<div id="review" class="panel"><p>This account can read reviews. <a href="#/login">Sign in as Mina Cole</a> if you want to write one.</p></div>';
    } else {
      composer = '<div id="review" class="panel"><p>Sign in when you want to write a review on this title. Sample reviews stay labeled. <a href="#/login">Sign in</a></p></div>';
    }
    return {
      title: film.title,
      html:
        '<section class="title-hero"><img src="' + esc(film.hero || film.image) + '" alt="" width="1600" height="900">' +
        '<div class="title-copy"><p class="kicker"><a href="#/">Movies</a></p><h1 tabindex="-1">' + esc(film.title) + "</h1>" +
        '<ul class="facts"><li>' + film.year + "</li><li>" + esc(film.genre) + "</li><li>" + film.minutes + " min</li><li>" + esc(score) + "</li></ul>" +
        "<p>" + esc(film.synopsis) + "</p>" +
        '<p class="actions">' + favoriteButton(film, user) + "</p></div></section>" +
        '<div class="sheet"><h2>Reviews</h2>' + (reviews.length ? reviews.map(reviewCard).join("") : '<p class="empty">No reviews on this title yet.</p>') +
        composer + "</div>"
    };
  }

  function reviewsView(user) {
    var mine = MarqueeStore.reviews().filter(function (review) { return review.userId === user.id; });
    var list = mine.length ? mine.map(function (review) {
      var film = MarqueeStore.filmById(review.filmId);
      return '<article class="review"><p class="meta"><a href="#/film/' + esc(review.filmId) + '">' + esc(film ? film.title : "Title") + "</a> · " + esc(formatWhen(review.at)) + "</p>" + stars(review.rating) + (review.title ? "<h3>" + esc(review.title) + "</h3>" : "") + "<p>" + esc(review.body) + "</p></article>";
    }).join("") : '<p class="empty">You have not written a review in this browser yet.</p>';
    var lede = user.role === "reviewer"
      ? "These are the reviews you saved. Sample reviews on a title stay marked as samples."
      : "This account can read reviews. Reviews on a title were either samples or written by a reviewer account. You can still save favorites.";
    return {
      title: "Your reviews",
      html: '<div class="sheet plain"><p class="kicker">' + esc(user.name) + '</p><h1 tabindex="-1">Your reviews</h1><p class="lede">' + lede + "</p>" + list + "</div>"
    };
  }

  function savedView(user) {
    var films = MarqueeStore.favoritesFor(user.id);
    var body = films.length
      ? '<p class="lede">Movies you saved on this account stay in this browser. Choose Save again on a title to remove it.</p>'
      : '<p class="empty">You have not saved a movie yet. Open a title and choose Save.</p>';
    return {
      title: "Saved favorites",
      html: '<div class="sheet plain"><p class="kicker">' + esc(user.name) + '</p><h1 tabindex="-1">Saved favorites</h1>' + body + "</div>" +
        (films.length ? '<div class="rows">' + rowBlock("Saved favorites", films) + "</div>" : "")
    };
  }

  function profileView(user) {
    var prefs = user.preferences || { reminders: false, quiet: true };
    var ability = user.role === "reviewer"
      ? "This account can write reviews and save favorites."
      : "This account can read reviews and save favorites.";
    return {
      title: "Profile",
      html:
        '<div class="sheet plain profile">' +
        '<div class="profile-head"><span class="avatar" aria-hidden="true">' + esc(initials(user.name)) + "</span>" +
        '<div><p class="kicker">Signed in</p><h1 tabindex="-1">' + esc(user.name) + "</h1>" +
        '<p class="profile-email">' + esc(user.email) + '</p><p><span class="badge">Demo member</span></p></div></div>' +
        "<p>" + ability + "</p>" +
        '<h2>Preferences</h2>' +
        '<p class="lede">These switches stay in this browser. Marquee does not send email, and it does not play video. They do not hide movies from the catalog.</p>' +
        '<label class="check"><input type="checkbox" data-action="pref" data-pref="reminders"' + (prefs.reminders ? " checked" : "") + "> Remind me about new sample titles</label>" +
        '<label class="check"><input type="checkbox" data-action="pref" data-pref="quiet"' + (prefs.quiet ? " checked" : "") + "> Keep the catalog quiet</label>" +
        '<p class="actions"><a href="#/reviews">Your reviews</a> <a href="#/saved">Saved favorites</a></p></div>'
    };
  }

  function loginView(user) {
    var note = user ? '<p class="hint">Signed in as ' + esc(user.name) + ". You can switch accounts.</p>" : "";
    var cards = MarqueeStore.users().map(function (account) {
      var changed = account.password !== account.seedPassword ? " (changed in this browser)" : "";
      var role = account.role === "reviewer"
        ? "Writes reviews and can save favorites."
        : "Reads reviews and can save favorites.";
      return '<article class="account panel"><h3>' + esc(account.name) + "</h3><p class=\"hint\">" + role + "</p><p class=\"cred\">" + esc(account.email) + "<br>" + esc(account.password) + esc(changed) + '</p><button type="button" class="btn btn-ghost" data-action="fill-login" data-email="' + esc(account.email) + '" data-password="' + esc(account.password) + '">Use this account</button></article>';
    }).join("");
    return {
      title: "Sign in",
      html:
        '<div class="sheet auth"><div><p class="kicker">Accounts</p><h1 tabindex="-1">Sign in</h1>' + note +
        '<p class="lede">Sign in to write a review or save a movie. The passwords below only work in this browser.</p>' +
        '<form data-action="login"><fieldset class="card"><legend>Sign in</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required></p>' +
        '<p class="actions"><button class="btn btn-red" type="submit">Sign in</button> <a href="#/reset">New password</a></p></fieldset></form></div>' +
        '<div><h2>Accounts</h2><div class="accounts">' + cards + "</div></div></div>"
    };
  }

  function resetView() {
    return {
      title: "New password",
      html:
        '<div class="sheet narrow"><p class="kicker">Stays in this browser</p><h1 tabindex="-1">Choose a new password</h1>' +
        '<p class="lede">Marquee does not send email. If you know an account address, you can set a new password here.</p>' +
        '<form data-action="reset-password"><fieldset class="card"><legend>Password</legend>' +
        '<p><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required></p>' +
        '<p><label for="password">New password</label><input id="password" name="password" type="password" autocomplete="new-password" required></p>' +
        '<p><label for="password2">Repeat password</label><input id="password2" name="password2" type="password" autocomplete="new-password" required></p>' +
        '<p class="hint">At least 8 characters.</p>' +
        '<p class="actions"><button class="btn btn-red" type="submit">Update password</button> <a href="#/login">Cancel</a></p></fieldset></form></div>'
    };
  }

  function missingView() {
    return { title: "Not in the catalog", html: '<div class="sheet narrow"><h1 tabindex="-1">That page is not in the catalog.</h1><p><a class="btn btn-light" href="#/">Back to movies</a></p></div>' };
  }

  function viewFor(parts, user) {
    var head = parts[0] || "movies";
    if (isMovies(head)) return moviesView();
    if (head === "film") return filmView(parts[1], user);
    if (head === "reviews" || head === "notes") return reviewsView(user);
    if (head === "saved") return savedView(user);
    if (head === "profile") return profileView(user);
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
    var head = parts[0] || "movies";
    var user = MarqueeStore.current();
    rendering = true;
    if (!user && (head === "notes" || head === "reviews" || head === "saved" || head === "profile")) {
      rendering = false;
      navigate("#/login");
      return;
    }
    var key = parts.join("/") || "movies";
    if (key === lastKey && !pageError && !MarqueeStore.peekFlash()) {
      rendering = false;
      return;
    }
    var view = viewFor(parts, user);
    document.getElementById("app").innerHTML = shell(view.html, user);
    document.title = view.title === "Marquee" ? "Marquee" : view.title + " · Marquee";
    var notice = document.querySelector(".banner, .alert");
    var review = document.getElementById("review");
    if (key !== lastKey) {
      lastKey = key;
      if (review && reviewRequested()) {
        review.scrollIntoView({ block: "start" });
        var focusable = review.querySelector("textarea, a, button");
        if (focusable) focusable.focus();
      } else {
        window.scrollTo(0, 0);
        var heading = document.querySelector("#main h1");
        if (heading) heading.focus();
      }
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
    var loginLink = event.target.closest("a[href='#/login']");
    if (loginLink) {
      var current = partsFromHash();
      returnHash = current[0] === "film" && current[1] ? "#/film/" + current[1] : "#/";
    }
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
    if (action === "row-prev" || action === "row-next") {
      var scroller = btn.parentElement.querySelector(".scroller");
      if (!scroller) return;
      var amount = Math.max(220, scroller.clientWidth * 0.8);
      scroller.scrollBy({ left: action === "row-next" ? amount : -amount, behavior: "smooth" });
      return;
    }
    if (action === "genre") {
      shelfFilter.genre = btn.dataset.genre || "all";
      lastKey = null;
      render();
      var pressed = document.querySelector('.chip[aria-pressed="true"]');
      if (pressed) pressed.focus();
      return;
    }
    if (action === "favorite") {
      event.preventDefault();
      var signedIn = MarqueeStore.current();
      if (!signedIn) {
        var here = partsFromHash();
        returnHash = here[0] === "film" && here[1] ? "#/film/" + here[1] : "#/";
        MarqueeStore.setFlash("Sign in to save a movie.");
        navigate("#/login");
        return;
      }
      var result = MarqueeStore.toggleFavorite(signedIn.id, btn.dataset.film);
      if (!result.ok) { pageError = result.error; render(); return; }
      succeed(result.saved ? "Saved to your favorites." : "Removed from your favorites.");
      return;
    }
    if (action === "logout") {
      MarqueeStore.logout();
      MarqueeStore.setFlash("Signed out. Reviews you wrote are still in this browser.");
      navigate("#/");
      return;
    }
    if (action === "reset-demo") {
      if (!window.confirm("Reset the sample movies, reviews, and favorites saved in this browser?")) return;
      MarqueeStore.reset();
      shelfFilter = { q: "", genre: "all" };
      MarqueeStore.setFlash("Demo movies restored.");
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
      var dest = returnHash || "#/";
      returnHash = "#/";
      MarqueeStore.setFlash("Signed in as " + result.user.name + ".");
      navigate(dest);
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
  document.addEventListener("change", function (event) {
    var input = event.target;
    if (!input || input.dataset.action !== "pref") return;
    var user = MarqueeStore.current();
    if (!user) return;
    MarqueeStore.setPreference(user.id, input.dataset.pref, input.checked);
  });
  document.addEventListener("input", function (event) {
    if (event.target.id !== "q") return;
    shelfFilter.q = event.target.value;
    if (document.querySelector(".shelf-tools")) {
      paintRows();
      return;
    }
    if (!shelfFilter.q.trim()) return;
    navigate("#/");
    var field = document.getElementById("q");
    if (field) {
      field.focus();
      var end = field.value.length;
      if (field.setSelectionRange) field.setSelectionRange(end, end);
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
