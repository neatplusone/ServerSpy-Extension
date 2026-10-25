# Server Spy

See the HTTP response headers, server software and IP of the site you're visiting.

- The toolbar badge shows the server software (e.g. `ngin` for nginx); hover it for the full name and IP.
- The popup lists all response headers (with a copy button), the server IP with lookup links grouped by purpose (general info, threat intel such as VirusTotal/AbuseIPDB/GreyNoise, exposure such as Censys/Shodan, and network/ASN) and a QR code of the page URL.

Manifest V3, no dependencies. Works in Chrome and Firefox 140+.

![server-spy](https://github.com/100apps/gfzj.us/raw/gh-pages/images/server-spy.png)

## Install

- Firefox: [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/server-spy2/) | [GitHub Release](https://github.com/dw5/ServerSpy-Extension/releases/latest)
- Chrome: <https://chrome.google.com/webstore/detail/server-spy/mcgbfbichapcffmamnmgcobomdpgeagf>

On Firefox, if the popup asks for access to all sites, grant it (MV3 makes host access opt-in) and reload the page.

## Development

- Chrome: `chrome://extensions` → Developer mode → Load unpacked → this folder.
- Firefox: `about:debugging` → This Firefox → Load Temporary Add-on → `manifest.json`.

```bash
npx web-ext lint     # check the manifest and code
npx web-ext build    # zip into web-ext-artifacts/
WEB_EXT_API_KEY=... WEB_EXT_API_SECRET=... ./build.sh   # sign for AMO
```

Originally by [100apps](https://github.com/100apps) ([blog post](http://www.gfzj.us/2016/10/01/publish-firefox-chrome-webextension.html)).
