function load(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

// Utility to save to localStorage
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load initial data or create empty structures
let urlMap = load("urlMap", {});
let clickStats = load("clickStats", {});

export function shortenUrl({ longUrl, validity, shortcode }) {
  const code = shortcode || Math.random().toString(36).substring(2, 8);
  const expiry = Date.now() + (validity || 30) * 60 * 1000;

  if (urlMap[code]) {
    throw new Error("Shortcode already exists");
  }

  urlMap[code] = { longUrl, expiry };
  clickStats[code] = [];

  save("urlMap", urlMap);
  save("clickStats", clickStats);

  return { shortcode: code, expiry };
}

export function resolveShortcode(code, source = "direct") {
  const data = urlMap[code];
  if (!data || Date.now() > data.expiry) throw new Error("Expired or invalid");

  const click = {
    timestamp: new Date().toISOString(),
    source,
    location: "India", // Placeholder for now
  };

  if (!clickStats[code]) clickStats[code] = [];
  clickStats[code].push(click);

  save("clickStats", clickStats);

  return data.longUrl;
}

export function getStats() {
  return Object.entries(urlMap).map(([code, info]) => ({
    shortcode: code,
    longUrl: info.longUrl,
    expiry: new Date(info.expiry).toLocaleString(),
    clicks: clickStats[code]?.length || 0,
    details: clickStats[code] || [],
  }));
}