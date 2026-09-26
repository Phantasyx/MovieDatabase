/* Browser-only state for the Felis demo. Nothing is sent to a server. */
(function () {
  var KEY = "felis-demo-v1";
  var SESSION = "felis-demo-session";
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
      cases: state.cases,
      requests: state.requests
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

  function isStaffRole(role) {
    return role === "A" || role === "S";
  }

  function emailOk(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function whenOk(value) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
  }

  function init() {
    var saved = null;
    try {
      saved = JSON.parse(readRaw() || "null");
    } catch (e) {
      saved = null;
    }
    if (!saved || saved.version !== 1 || !Array.isArray(saved.users) || !Array.isArray(saved.cases) || !Array.isArray(saved.requests)) {
      state = window.FelisData.seed();
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
      return { ok: false, error: "Those credentials are not in the demo." };
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
    state = window.FelisData.seed();
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

  function caseById(id) {
    return state.cases.find(function (c) { return c.id === id; }) || null;
  }

  function userById(id) {
    return state.users.find(function (u) { return u.id === id; }) || null;
  }

  function addRequest(input) {
    if (String(input.company || "").trim()) return { ok: true, ignored: true };
    var name = String(input.name || "").trim();
    var email = String(input.email || "").trim();
    var message = String(input.message || "").trim();
    if (!name || !email || !message) {
      return { ok: false, error: "Name, email, and a message are required." };
    }
    if (name.length > 120 || email.length > 160 || message.length > 2000) {
      return { ok: false, error: "That message is too long for the demo form." };
    }
    if (!emailOk(email)) return { ok: false, error: "Enter an email address." };
    state.requests.unshift({
      id: nid("q"),
      name: name,
      email: email,
      message: message,
      at: new Date().toISOString()
    });
    state.requests = state.requests.slice(0, 20);
    persist();
    return { ok: true };
  }

  function dismissRequest(id) {
    state.requests = state.requests.filter(function (r) { return r.id !== id; });
    persist();
  }

  function addCase(input) {
    var number = String(input.number || "").trim();
    var summary = String(input.summary || "").trim();
    if (!number || !summary) return { ok: false, error: "Case number and summary are required." };
    if (number.length > 40 || summary.length > 240) {
      return { ok: false, error: "Keep the case number and summary shorter." };
    }
    if (state.cases.some(function (c) { return c.number.toLowerCase() === number.toLowerCase(); })) {
      return { ok: false, error: "That case number is already in use." };
    }
    var client = state.users.find(function (u) { return u.id === input.clientId && u.role === "C"; });
    var agent = state.users.find(function (u) { return u.id === input.agentId && isStaffRole(u.role); });
    if (!client || !agent) return { ok: false, error: "Choose a client and a staff agent." };
    var row = {
      id: nid("c"),
      number: number,
      summary: summary,
      clientId: client.id,
      agentId: agent.id,
      status: "open",
      notes: [],
      reports: []
    };
    state.cases.unshift(row);
    persist();
    return { ok: true, id: row.id };
  }

  function updateCase(id, patch) {
    var row = caseById(id);
    if (!row) return { ok: false, error: "Case not found." };
    var number = String(patch.number || "").trim();
    var summary = String(patch.summary || "").trim();
    if (!number || !summary) return { ok: false, error: "Case number and summary are required." };
    if (state.cases.some(function (c) { return c.id !== id && c.number.toLowerCase() === number.toLowerCase(); })) {
      return { ok: false, error: "That case number is already in use." };
    }
    var agent = state.users.find(function (u) { return u.id === patch.agentId && isStaffRole(u.role); });
    if (!agent) return { ok: false, error: "Choose a staff agent." };
    if (patch.status !== "open" && patch.status !== "closed") {
      return { ok: false, error: "Status must be open or closed." };
    }
    row.number = number;
    row.summary = summary;
    row.agentId = agent.id;
    row.status = patch.status;
    persist();
    return { ok: true };
  }

  function addNote(caseId, body, agentId) {
    var row = caseById(caseId);
    if (!row) return { ok: false, error: "Case not found." };
    body = String(body || "").trim();
    if (!body) return { ok: false, error: "Write a note before adding it." };
    if (body.length > 2000) return { ok: false, error: "That note is too long." };
    row.notes.unshift({ id: nid("n"), at: new Date().toISOString(), agentId: agentId, body: body });
    persist();
    return { ok: true };
  }

  function addReport(caseId, input) {
    var row = caseById(caseId);
    if (!row) return { ok: false, error: "Case not found." };
    var summary = String(input.summary || "").trim();
    var detail = String(input.detail || "").trim();
    if (!summary) return { ok: false, error: "A report needs a summary." };
    if (!whenOk(input.at)) return { ok: false, error: "Use a date and time like 2016-02-12 01:35." };
    if (summary.length > 300 || detail.length > 4000) return { ok: false, error: "That report is too long." };
    var report = {
      id: nid("r"),
      at: input.at,
      agentId: input.agentId,
      summary: summary,
      detail: detail,
      photos: []
    };
    row.reports.unshift(report);
    persist();
    return { ok: true, id: report.id };
  }

  function updateReport(caseId, reportId, input) {
    var row = caseById(caseId);
    if (!row) return { ok: false, error: "Case not found." };
    var report = row.reports.find(function (r) { return r.id === reportId; });
    if (!report) return { ok: false, error: "Report not found." };
    var summary = String(input.summary || "").trim();
    var detail = String(input.detail || "").trim();
    if (!summary) return { ok: false, error: "A report needs a summary." };
    if (!whenOk(input.at)) return { ok: false, error: "Use a date and time like 2016-02-12 01:35." };
    report.at = input.at;
    report.summary = summary;
    report.detail = detail;
    persist();
    return { ok: true };
  }

  function addPhoto(caseId, reportId, input) {
    var row = caseById(caseId);
    if (!row) return { ok: false, error: "Case not found." };
    var report = row.reports.find(function (r) { return r.id === reportId; });
    if (!report) return { ok: false, error: "Report not found." };
    var caption = String(input.caption || "").trim();
    var time = String(input.time || "").trim() || "—";
    if (!caption) return { ok: false, error: "Add a caption for the photo note." };
    if (caption.length > 160) return { ok: false, error: "Keep the caption short." };
    report.photos.push({ caption: caption, time: time });
    persist();
    return { ok: true };
  }

  function deleteCase(id) {
    if (!caseById(id)) return { ok: false, error: "Case not found." };
    state.cases = state.cases.filter(function (c) { return c.id !== id; });
    persist();
    return { ok: true };
  }

  function addUser(input) {
    var name = String(input.name || "").trim();
    var email = String(input.email || "").trim();
    var role = input.role;
    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (!emailOk(email)) return { ok: false, error: "Enter an email address." };
    if (role !== "A" && role !== "S" && role !== "C") return { ok: false, error: "Choose a role." };
    if (state.users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
      return { ok: false, error: "That email is already on the desk." };
    }
    state.users.push({
      id: nid("u"),
      email: email,
      name: name,
      phone: String(input.phone || "").trim(),
      address: String(input.address || "").trim(),
      notes: String(input.notes || "").trim(),
      role: role,
      password: "demo-new-user",
      seedPassword: "demo-new-user",
      joined: new Date().toISOString()
    });
    persist();
    return { ok: true, password: "demo-new-user" };
  }

  function updateUser(id, input) {
    var user = userById(id);
    if (!user) return { ok: false, error: "User not found." };
    var name = String(input.name || "").trim();
    var email = String(input.email || "").trim();
    var role = input.role;
    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (!emailOk(email)) return { ok: false, error: "Enter an email address." };
    if (role !== "A" && role !== "S" && role !== "C") return { ok: false, error: "Choose a role." };
    if (state.users.some(function (u) { return u.id !== id && u.email.toLowerCase() === email.toLowerCase(); })) {
      return { ok: false, error: "That email is already on the desk." };
    }
    if (user.role === "A" && role !== "A" && state.users.filter(function (u) { return u.role === "A"; }).length <= 1) {
      return { ok: false, error: "Keep at least one admin on the desk." };
    }
    user.name = name;
    user.email = email;
    user.phone = String(input.phone || "").trim();
    user.address = String(input.address || "").trim();
    user.notes = String(input.notes || "").trim();
    user.role = role;
    persist();
    return { ok: true };
  }

  function deleteUser(id, actorId) {
    if (id === actorId) return { ok: false, error: "You cannot delete the account you are using." };
    var user = userById(id);
    if (!user) return { ok: false, error: "User not found." };
    if (user.role === "A" && state.users.filter(function (u) { return u.role === "A"; }).length <= 1) {
      return { ok: false, error: "Keep at least one admin on the desk." };
    }
    if (state.cases.some(function (c) { return c.clientId === id || c.agentId === id; })) {
      return { ok: false, error: "Reassign files tied to this person before deleting them." };
    }
    state.users = state.users.filter(function (u) { return u.id !== id; });
    persist();
    return { ok: true };
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

  window.FelisStore = {
    init: init,
    current: current,
    users: function () { return state.users; },
    cases: function () { return state.cases; },
    requests: function () { return state.requests; },
    caseById: caseById,
    userById: userById,
    login: login,
    logout: logout,
    reset: reset,
    setFlash: setFlash,
    peekFlash: peekFlash,
    takeFlash: takeFlash,
    addRequest: addRequest,
    dismissRequest: dismissRequest,
    addCase: addCase,
    updateCase: updateCase,
    addNote: addNote,
    addReport: addReport,
    updateReport: updateReport,
    addPhoto: addPhoto,
    deleteCase: deleteCase,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    setPassword: setPassword
  };
})();
