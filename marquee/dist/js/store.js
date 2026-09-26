/* Browser-only state. Reviews never leave this browser. */
(function () {
  var KEY = "marquee-demo-v1";
  var SESSION = "marquee-demo-session";
  var state = null;
  var sessionUserId = null;
  var memory = null;
  var flash = "";

  function nid(prefix) {
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function readRaw() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return memory;
    }
  }

  function persist() {
    var json = JSON.stringify({
      version: state.version,
      users: state.users,
      films: state.films,
      reviews: state.reviews
    });
    memory = json;
    try {
      localStorage.setItem(KEY, json);
    } catch (e) {}
  }

  function persistSession() {
    try {
      if (sessionUserId) sessionStorage.setItem(SESSION, sessionUserId);
      else sessionStorage.removeItem(SESSION);
    } catch (e) {}
  }

  function emailOk(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function init() {
    var saved = null;
    try {
      saved = JSON.parse(readRaw() || "null");
    } catch (e) {
      saved = null;
    }
    if (!saved || saved.version !== 2 || !Array.isArray(saved.users) || !Array.isArray(saved.films) || !Array.isArray(saved.reviews)) {
      state = window.MarqueeData.seed();
      persist();
    } else {
      state = saved;
    }
    try {
      sessionUserId = sessionStorage.getItem(SESSION);
    } catch (e) {
      sessionUserId = null;
    }
  }

  function current() {
    if (!sessionUserId) return null;
    var user = state.users.find(function (u) { return u.id === sessionUserId; });
    if (!user) {
      sessionUserId = null;
      persistSession();
      return null;
    }
    return Object.assign({}, user);
  }

  function login(email, password) {
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();
    var user = state.users.find(function (u) { return u.email.toLowerCase() === email; });
    if (!user || user.password !== password) {
      return { ok: false, error: "Those credentials are not in this demo." };
    }
    sessionUserId = user.id;
    persistSession();
    return { ok: true, user: Object.assign({}, user) };
  }

  function logout() {
    sessionUserId = null;
    persistSession();
  }

  function reset() {
    state = window.MarqueeData.seed();
    persist();
    sessionUserId = null;
    persistSession();
  }

  function setFlash(message) { flash = message || ""; }
  function peekFlash() { return flash; }
  function takeFlash() {
    var value = flash;
    flash = "";
    return value;
  }

  function filmById(id) {
    return state.films.find(function (film) { return film.id === id; }) || null;
  }

  function reviewsFor(filmId) {
    return state.reviews.filter(function (review) { return review.filmId === filmId; });
  }

  function userReview(userId, filmId) {
    return state.reviews.find(function (review) {
      return review.userId === userId && review.filmId === filmId;
    }) || null;
  }

  function saveReview(userId, filmId, input) {
    var author = state.users.find(function (u) { return u.id === userId; });
    if (!author || author.role !== "reviewer") {
      return { ok: false, error: "This demo account can read notes, not write them." };
    }
    if (!filmById(filmId)) return { ok: false, error: "That title is not on the shelf." };
    var rating = Number(input.rating);
    var title = String(input.title || "").trim();
    var body = String(input.body || "").trim();
    if (![1, 2, 3, 4, 5].includes(rating)) return { ok: false, error: "Choose a rating from 1 to 5." };
    if (!body) return { ok: false, error: "Write the note before saving." };
    if (title.length > 80 || body.length > 1200) return { ok: false, error: "Keep the note shorter for this demo." };
    var existing = userReview(userId, filmId);
    if (existing) {
      existing.rating = rating;
      existing.title = title;
      existing.body = body;
      existing.at = new Date().toISOString();
    } else {
      state.reviews.unshift({
        id: nid("r"),
        filmId: filmId,
        userId: userId,
        sample: false,
        rating: rating,
        title: title,
        body: body,
        at: new Date().toISOString()
      });
    }
    persist();
    return { ok: true, updated: !!existing };
  }

  function setPassword(email, password, confirm) {
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();
    confirm = String(confirm || "").trim();
    var user = state.users.find(function (u) { return u.email.toLowerCase() === email; });
    if (!user) return { ok: false, error: "That address is not one of the demo accounts." };
    if (password.length < 8) return { ok: false, error: "Use at least 8 characters." };
    if (password !== confirm) return { ok: false, error: "Those passwords do not match." };
    user.password = password;
    persist();
    return { ok: true };
  }

  window.MarqueeStore = {
    init: init,
    current: current,
    users: function () { return state.users; },
    films: function () { return state.films; },
    reviews: function () { return state.reviews; },
    filmById: filmById,
    reviewsFor: reviewsFor,
    userReview: userReview,
    login: login,
    logout: logout,
    reset: reset,
    setFlash: setFlash,
    peekFlash: peekFlash,
    takeFlash: takeFlash,
    saveReview: saveReview,
    setPassword: setPassword
  };
})();
