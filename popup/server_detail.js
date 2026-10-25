"use strict";

const $ = (id) => document.getElementById(id);

const LOOKUPS = {
  "Info": [
    ["ipinfo.io", (ip) => `https://ipinfo.io/${ip}`],
    ["infobyip.com", (ip) => `https://www.infobyip.com/ip-${ip}.html`],
    ["whatismyipaddress.com", (ip) => `https://whatismyipaddress.com/ip/${ip}`],
  ],
  "Threat intel": [
    ["VirusTotal", (ip) => `https://www.virustotal.com/gui/ip-address/${ip}`],
    ["AbuseIPDB", (ip) => `https://www.abuseipdb.com/check/${ip}`],
    ["GreyNoise", (ip) => `https://viz.greynoise.io/ips/${ip}`],
    ["AlienVault OTX", (ip) => `https://otx.alienvault.com/indicator/ip/${ip}`],
    ["Talos", (ip) => `https://talosintelligence.com/reputation_center/lookup?search=${ip}`],
  ],
  "Exposure": [
    ["Censys", (ip) => `https://search.censys.io/hosts/${ip}`],
    ["Shodan", (ip) => `https://www.shodan.io/host/${ip}`],
    ["urlscan.io", (ip) => `https://urlscan.io/search/#ip:${ip}`],
    ["ViewDNS reverse IP", (ip) => `https://viewdns.info/reverseip/?host=${ip}&t=1`],
  ],
  "Network": [
    ["bgp.he.net", (ip) => `https://bgp.he.net/ip/${ip}`],
    ["RIPEstat", (ip) => `https://stat.ripe.net/resource/${ip}`],
  ],
};

function notice(text) {
  $("notice").textContent = text;
  $("notice").hidden = false;
}

function render(info) {
  const headerText = [info.statusLine, ...info.headers.map((h) => `${h.name}: ${h.value}`)].join("\n");

  $("url").textContent = info.url;
  $("headers").textContent = headerText;

  if (info.ip) {
    $("ip").textContent = info.ip;
    $("ip").href = `http://${info.ip.includes(":") ? `[${info.ip}]` : info.ip}/`;
    for (const [group, links] of Object.entries(LOOKUPS)) {
      const ul = document.createElement("ul");
      for (const [name, url] of links) {
        const a = Object.assign(document.createElement("a"), {
          href: url(info.ip), textContent: name, target: "_blank", rel: "noopener noreferrer",
        });
        ul.append(li(a));
      }
      const dd = document.createElement("dd");
      dd.append(ul);
      $("lookup-groups").append(Object.assign(document.createElement("dt"), { textContent: group }), dd);
    }
  } else {
    $("ip").replaceWith("unknown (cached response?)");
    $("lookups").hidden = true;
  }

  if (info.server) {
    $("server").textContent = info.server;
    $("server").href = `https://duckduckgo.com/?q=${encodeURIComponent(info.server)}`;
  } else {
    $("server").replaceWith("not disclosed");
  }

  $("copy").addEventListener("click", async () => {
    await navigator.clipboard.writeText(headerText);
    $("copy").textContent = "Copied";
    setTimeout(() => ($("copy").textContent = "Copy"), 1200);
  });

  $("qr").addEventListener("toggle", () => {
    if (!$("qr").open || $("qrcode").hasChildNodes()) return;
    new QRCode($("qrcode"), {
      text: info.url, width: 160, height: 160,
      colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M,
    });
  });

  $("details").hidden = false;
}

function li(child) {
  const el = document.createElement("li");
  el.append(child);
  return el;
}

async function main() {
  const origins = { origins: ["<all_urls>"] };
  if (!(await chrome.permissions.contains(origins))) {
    notice("Server Spy needs access to all sites to read response headers.");
    $("grant").hidden = false;
    $("grant").addEventListener("click", async () => {
      if (await chrome.permissions.request(origins)) notice("Access granted. Reload the page to capture its headers.");
      $("grant").hidden = true;
    });
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const key = `tab:${tab?.id}`;
  const { [key]: info } = await chrome.storage.session.get(key);
  if (info) render(info);
  else notice("No headers captured for this tab yet. Reload the page to capture them.");
}

main();
