# Inyun

The long way counts. A shared board for the little things, built from the Corky Figma file for the UXC Designathon 2026.

## Run it

```bash
npm install
npm run dev
```

Open the "Local" link it prints (http://localhost:5173). To try it on a phone on the same Wi-Fi, open the "Network" link instead.

## What's in here

| File | Screens |
| --- | --- |
| `src/onboarding.jsx` | Splash, the four intro slides, account, purpose, invite, all set |
| `src/board.jsx` | Home, New board, the board and its + menu, pin detail, Settings |
| `src/compose.jsx` | Note, voice, photo and sticker pickers |
| `src/recap.jsx` | Month cards and the recap walk |
| `src/ui.jsx` | Icons, avatars, placeholder art, every pin type |
| `src/store.js` | Demo data (friends, seeded boards) and saving to the browser |
| `src/styles.css` | All styling. Colours and fonts are variables at the top |

## Good to know

- Everything saves in the browser (localStorage). **Settings > Reset the demo** starts over from the splash screen.
- The demo is frozen on Nov 30 so "Skip to Dec 1" and the November recap always work. Change `TODAY` and `MONTH` in `src/store.js` to move it.
- Photos are drawn placeholders. Drop real ones into `public/photos/` (see the README there) and they replace the drawings.
- Voice notes record from the microphone if the browser allows it; otherwise they just keep time.
- "Save" on a recap shows the toast only. It does not export a video.
