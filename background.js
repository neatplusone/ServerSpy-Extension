"use strict";

const key = (tabId) => `tab:${tabId}`;

// Short product name for the badge, e.g. "nginx/1.25.3" -> "ngin".
function badgeText(server) {
  return server.split(/[\/\s]/)[0].slice(0, 4);
}

function showBadge(tabId, info) {
  const title = info.server
    ? `${info.server}${info.ip ? ` (${info.ip})` : ""}`
    : info.ip || "Server Spy";
  chrome.action.setBadgeText({ tabId, text: badgeText(info.server) });
  chrome.action.setTitle({ tabId, title });
}

chrome.action.setBadgeBackgroundColor({ color: "#4a5568" });

chrome.webRequest.onCompleted.addListener(
  (e) => {
    if (e.tabId < 0) return;
    const headers = (e.responseHeaders || []).map(({ name, value }) => ({ name, value }));
    const server = headers.find((h) => h.name.toLowerCase() === "server")?.value || "";
    const info = { statusLine: e.statusLine, headers, server, ip: e.ip || "", url: e.url, time: Date.now() };
    chrome.storage.session.set({ [key(e.tabId)]: info });
    showBadge(e.tabId, info);
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["responseHeaders"]
);

// Tab-specific badges can be reset when the page commits, so reapply once loaded.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;
  const { [key(tabId)]: info } = await chrome.storage.session.get(key(tabId));
  if (info) showBadge(tabId, info);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(key(tabId));
});
