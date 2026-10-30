# Pondwatch — Pond Monitoring Website

A static, browser-based interface for monitoring pond water and controlling an ESP32 camera/stepper setup. The site uses Firebase Authentication and Realtime Database for sign-in and sensor/control data, and embeds a ThingSpeak chart for temperature history.

**Firebase Hosting:** [pond-water-monitoring.web.app](https://pond-water-monitoring.web.app)

The site is deployed to this Firebase Hosting address.

## Pages

- `index.html` — Firebase email/password sign-in and account creation.
- `home.html` — entry point for the monitoring tools.
- `dashboard.html` — live water temperature and the connected/not-connected status of planned sensors.
- `water-temp.html` — live water-temperature value and ThingSpeak history chart.
- `about.html` — ESP32-CAM stream and stepper position/direction controls.
- `TEMP.HTML` — redirects the previous temperature-page URL to `water-temp.html`.

Shared styles and browser modules are in `assets/css/` and `assets/js/`.

## Data and integrations

### Pond readings

The main Firebase project is configured in `assets/js/firebase.js`. The dashboard currently subscribes to this Realtime Database path:

```text
sensor/temperature
```

The browser shows a live value only when that path has a reading. pH, turbidity, total dissolved solids, air temperature, humidity and pressure are displayed as not connected until the matching sensors and database listeners are implemented. The temperature trend embeds ThingSpeak channel `2906260`, chart `1`.

### Camera and stepper

The camera-control page retains the separate Firebase project used by the original stepper integration. It writes:

```text
direction/position  # integer from 1 to 8
direction/move      # "left" or "right"
```

Set the ESP32-CAM stream URL on the camera page. The URL is stored in that browser's local storage; it is not committed to the repository. The expected stream is an MJPEG-compatible URL, commonly `http://<camera-ip>:81/stream`. A browser served over HTTPS may block a camera stream served over HTTP, and the camera must be reachable on the same network or otherwise exposed securely.

## Run locally

This site uses ES modules, so open it through a local HTTP server rather than directly as a `file://` URL. From the project directory:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. No package installation or build step is required.

## Deploy

Firebase Hosting is configured in `firebase.json`, with `pond-water-monitoring` as the default project in `.firebaserc`. After signing in to an account with Hosting access to that Firebase project, deploy from the repository root:

```powershell
firebase login
firebase deploy --only hosting --project pond-water-monitoring
```

Configure the deployed domain in Firebase Authentication's authorized domains. Review both Firebase projects' Realtime Database rules before deployment: client-side page redirects are a user-interface guard, not database authorization.

The camera controller uses a separate Firebase project and does not sign in to that project's Authentication service. Its browser commands therefore do not inherit the user's main-project sign-in. If the camera database requires authenticated writes, configure authentication for that project or route commands through a trusted server; do not make the database publicly writable just to enable the page.

Firebase web configuration values are identifiers used by the browser SDK, not server-side secrets. Database security must be enforced by Firebase rules; never put service-account credentials or other private keys in this repository.
