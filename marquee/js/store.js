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
    if (!saved || saved.version !== 3 || !Array.isArray(saved.users) || !Array.isArray(saved.films) || !Array.isArray(saved.reviews)) {
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
      return { ok: false, error: "That email and password do not match an account." };
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
      return { ok: false, error: "This account can read reviews, not write them." };
    }
    if (!filmById(filmId)) return { ok: false, error: "That movie is not in the catalog." };
    var rating = Number(input.rating);
    var title = String(input.title || "").trim();
    var body = String(input.body || "").trim();
    if (![1, 2, 3, 4, 5].includes(rating)) return { ok: false, error: "Choose a rating from 1 to 5." };
    if (!body) return { ok: false, error: "Write the review before saving." };
    if (title.length > 80 || body.length > 1200) return { ok: false, error: "Keep the review shorter." };
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

  function isFavorite(userId, filmId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    return !!(user && Array.isArray(user.favorites) && user.favorites.indexOf(filmId) !== -1);
  }

  function favoritesFor(userId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    var ids = user && Array.isArray(user.favorites) ? user.favorites : [];
    return ids.map(function (id) { return filmById(id); }).filter(Boolean);
  }

  function toggleFavorite(userId, filmId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    if (!user) return { ok: false, error: "Sign in to save a movie." };
    if (!filmById(filmId)) return { ok: false, error: "That movie is not in the catalog." };
    if (!Array.isArray(user.favorites)) user.favorites = [];
    var index = user.favorites.indexOf(filmId);
    if (index === -1) user.favorites.push(filmId);
    else user.favorites.splice(index, 1);
    persist();
    return { ok: true, saved: index === -1 };
  }

  function setPreference(userId, key, value) {
    var user = state.users.find(function (u) { return u.id === userId; });
    if (!user) return { ok: false };
    if (key !== "reminders" && key !== "quiet") return { ok: false };
    if (!user.preferences) user.preferences = { reminders: false, quiet: true };
    user.preferences[key] = !!value;
    persist();
    return { ok: true };
  }

  function setPassword(email, password, confirm) {
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();
    confirm = String(confirm || "").trim();
    var user = state.users.find(function (u) { return u.email.toLowerCase() === email; });
    if (!user) return { ok: false, error: "That address is not an account here." };
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
    setPassword: setPassword,
    isFavorite: isFavorite,
    favoritesFor: favoritesFor,
    toggleFavorite: toggleFavorite,
    setPreference: setPreference
  };
})();
