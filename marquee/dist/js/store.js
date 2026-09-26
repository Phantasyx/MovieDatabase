/* Browser-only state. Reviews never leave this browser. */
(function () {
  var KEY = "marquee-demo-v1";
  var SESSION = "marquee-demo-session";
  var PLANS = {
    basic: { id: "basic", name: "Basic", price: 8.99, screens: "1 screen", quality: "SD" },
    standard: { id: "standard", name: "Standard", price: 15.49, screens: "2 screens", quality: "HD" },
    premium: { id: "premium", name: "Premium", price: 22.99, screens: "4 screens", quality: "Ultra HD" }
  };
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
    var repaired = false;
    state.users.forEach(function (user) {
      if (!user.subscription || typeof user.subscription !== "object") {
        user.subscription = { plan: null, status: "none", nextBilling: null, last4: null, cardName: null, invoices: [] };
        repaired = true;
      }
      if (!Array.isArray(user.subscription.invoices)) {
        user.subscription.invoices = [];
        repaired = true;
      }
    });
    if (repaired) persist();
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

  function planList() {
    return [PLANS.basic, PLANS.standard, PLANS.premium];
  }

  function planById(id) {
    return PLANS[id] || null;
  }

  function blankSub() {
    return { plan: null, status: "none", nextBilling: null, last4: null, cardName: null, invoices: [] };
  }

  function two(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function dayStamp(offset) {
    var date = new Date();
    date.setDate(date.getDate() + offset);
    return date.getFullYear() + "-" + two(date.getMonth() + 1) + "-" + two(date.getDate());
  }

  function addInvoice(sub, plan, last4, offsetDays) {
    sub.invoices.unshift({
      id: nid("inv"),
      at: dayStamp(offsetDays),
      plan: plan.name,
      planId: plan.id,
      amount: plan.price,
      status: "Paid",
      last4: last4
    });
  }

  var SAMPLE_CARD = {
    name: "Demo User",
    number: "4242 4242 4242 4242",
    digits: "4242424242424242",
    expiry: "12/34",
    cvc: "123",
    street: "1 Sample Street",
    city: "Sample City",
    region: "CA",
    postal: "42424",
    last4: "4242"
  };

  function sampleBilling() {
    return {
      name: SAMPLE_CARD.name,
      number: SAMPLE_CARD.number,
      expiry: SAMPLE_CARD.expiry,
      cvc: SAMPLE_CARD.cvc,
      street: SAMPLE_CARD.street,
      city: SAMPLE_CARD.city,
      region: SAMPLE_CARD.region,
      postal: SAMPLE_CARD.postal,
      last4: SAMPLE_CARD.last4
    };
  }

  function isSampleBilling(input) {
    if (!input) return true;
    function text(value) { return String(value == null ? "" : value).trim(); }
    var fields = ["name", "card", "expiry", "cvc", "street", "city", "region", "postal"];
    var provided = fields.some(function (key) { return text(input[key]) !== ""; });
    if (!provided) return true;
    return text(input.name) === SAMPLE_CARD.name &&
      text(input.card).replace(/\D/g, "") === SAMPLE_CARD.digits &&
      text(input.expiry).replace(/\s/g, "") === SAMPLE_CARD.expiry &&
      text(input.cvc) === SAMPLE_CARD.cvc &&
      text(input.street) === SAMPLE_CARD.street &&
      text(input.city) === SAMPLE_CARD.city &&
      text(input.region) === SAMPLE_CARD.region &&
      text(input.postal) === SAMPLE_CARD.postal;
  }

  function hasCatalog(user) {
    var sub = user && user.subscription;
    return !!(sub && sub.status === "active" && sub.plan && planById(sub.plan));
  }

  function subscribe(userId, planId, input) {
    var user = state.users.find(function (u) { return u.id === userId; });
    var plan = planById(planId);
    if (!user) return { ok: false, error: "Sign in before choosing a plan." };
    if (!plan) return { ok: false, error: "Choose Basic, Standard, or Premium." };
    if (!isSampleBilling(input)) return { ok: false, error: "Only the sample card can be used. Nothing is charged." };
    if (!user.subscription) user.subscription = blankSub();
    var sub = user.subscription;
    var first = !sub.invoices.length;
    sub.plan = plan.id;
    sub.status = "active";
    sub.nextBilling = dayStamp(30);
    sub.last4 = SAMPLE_CARD.last4;
    sub.cardName = SAMPLE_CARD.name;
    if (first) {
      addInvoice(sub, plan, SAMPLE_CARD.last4, -60);
      addInvoice(sub, plan, SAMPLE_CARD.last4, -30);
    }
    addInvoice(sub, plan, SAMPLE_CARD.last4, 0);
    persist();
    return { ok: true, plan: plan };
  }

  function changePlan(userId, planId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    var plan = planById(planId);
    if (!user || !user.subscription || user.subscription.status !== "active" || !user.subscription.last4) {
      return { ok: false, error: "Subscribe before changing a plan." };
    }
    if (!plan) return { ok: false, error: "Choose Basic, Standard, or Premium." };
    if (user.subscription.plan === plan.id) return { ok: false, error: "You are already on that plan." };
    user.subscription.plan = plan.id;
    user.subscription.nextBilling = dayStamp(30);
    addInvoice(user.subscription, plan, user.subscription.last4, 0);
    persist();
    return { ok: true, plan: plan };
  }

  function pausePlan(userId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    if (!user || !user.subscription || user.subscription.status !== "active") {
      return { ok: false, error: "There is no active plan to pause." };
    }
    user.subscription.status = "paused";
    persist();
    return { ok: true };
  }

  function resumePlan(userId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    if (!user || !user.subscription || user.subscription.status !== "paused" || !user.subscription.plan) {
      return { ok: false, error: "There is no paused plan to resume." };
    }
    user.subscription.status = "active";
    user.subscription.nextBilling = dayStamp(30);
    persist();
    return { ok: true };
  }

  function cancelPlan(userId) {
    var user = state.users.find(function (u) { return u.id === userId; });
    if (!user || !user.subscription || (user.subscription.status !== "active" && user.subscription.status !== "paused")) {
      return { ok: false, error: "There is no plan to cancel." };
    }
    user.subscription.status = "cancelled";
    user.subscription.nextBilling = null;
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
    setPreference: setPreference,
    plans: planList,
    planById: planById,
    hasCatalog: hasCatalog,
    sampleBilling: sampleBilling,
    subscribe: subscribe,
    changePlan: changePlan,
    pausePlan: pausePlan,
    resumePlan: resumePlan,
    cancelPlan: cancelPlan
  };
})();
