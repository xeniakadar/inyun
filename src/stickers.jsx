// The sticker set from the Figma design system, drawn as SVG so they stay crisp at any size.
// The white sticker edge comes from the .pin-sticker CSS, not from the drawings.
const INK = '#2a2a2a'
const PLUM = '#6f2f35'
const HONEY = '#dcbb52'
const MAUVE = '#b9a2ad'
const BLUE = '#a9bcc6'
const PEACH = '#e9b98f'

const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' }

const ART = {
  heart: (
    <>
      <path {...line} fill={PLUM} d="M24 41C10 31 5 23 5 16a9 9 0 0 1 19-3.500A9 9 0 0 1 43 16c0 7-5 15-19 25z" />
      <path d="M11 15a4 4 0 0 1 4-4" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  laugh: (
    <>
      <circle {...line} cx="24" cy="24" r="17" fill={HONEY} />
      <path {...line} fill="none" d="M13 20q3.500-4.500 7 0M28 20q3.500-4.500 7 0" />
      <path {...line} fill={INK} d="M14 26h20a10 10 0 0 1-20 0z" />
      <path d="M16.500 27.200h15v2.300h-15z" fill="#fff" />
      <path {...line} strokeWidth="1.800" fill={BLUE} d="M7 24q-4 6-1 8.500 4 1 4-3zM41 24q4 6 1 8.500-4 1-4-3z" />
    </>
  ),
  smirk: (
    <>
      <circle {...line} cx="24" cy="24" r="17" fill={HONEY} />
      <path {...line} fill="none" d="M12 17.500l8 2.500M28 19.500l8-3M17 32q9 4 15-4" />
      <circle cx="17" cy="23.500" r="2.200" fill={INK} /><circle cx="31" cy="22.500" r="2.200" fill={INK} />
    </>
  ),
  flame: (
    <>
      <path {...line} fill={PLUM} d="M25 4c1 9 12 13 12 25a13 13 0 0 1-26 0c0-5 2-8 4.500-10.500.500 3 1.500 4.500 3.500 5.500C19 16 22 9 25 4z" />
      <path {...line} strokeWidth="2" fill={PEACH} d="M24 25c3 4 5.500 6.500 5.500 10.500a5.500 5.500 0 0 1-11 0c0-4 2.500-6.500 5.500-10.500z" />
    </>
  ),
  eyes: (
    <>
      <ellipse {...line} cx="15" cy="24" rx="9" ry="12" fill="#fff" />
      <ellipse {...line} cx="33" cy="24" rx="9" ry="12" fill="#fff" />
      <circle cx="18.500" cy="26" r="4.600" fill={INK} /><circle cx="29.500" cy="26" r="4.600" fill={INK} />
      <circle cx="17" cy="24.500" r="1.300" fill="#fff" /><circle cx="28" cy="24.500" r="1.300" fill="#fff" />
    </>
  ),
  quote: (
    <>
      <path {...line} fill={PLUM} d="M6 10h14v13c0 8-4 12.500-11 15l-2.500-5c3.500-1.500 5.500-3.500 5.500-8H6z" />
      <path {...line} fill={PLUM} d="M27 10h14v13c0 8-4 12.500-11 15l-2.500-5c3.500-1.500 5.500-3.500 5.500-8H27z" />
    </>
  ),
  plane: (
    <>
      <path {...line} fill="#fff" d="M4 21 44 5 31 43l-8-15z" />
      <path {...line} fill="none" d="M44 5 23 28" />
    </>
  ),
  chat: (
    <>
      <path {...line} fill="#fff" d="M11 7h26a6 6 0 0 1 6 6v15a6 6 0 0 1-6 6H23l-10 9v-9h-2a6 6 0 0 1-6-6V13a6 6 0 0 1 6-6z" />
      <circle cx="15.500" cy="20.500" r="2.500" fill={INK} /><circle cx="24" cy="20.500" r="2.500" fill={INK} /><circle cx="32.500" cy="20.500" r="2.500" fill={INK} />
    </>
  ),
  arrow: <path {...line} fill={PLUM} d="M4 17.500h21V8l19 16-19 16v-9.500H4z" />,
  moon: <path {...line} fill={HONEY} d="M31 4a20 20 0 1 0 13 31A17 17 0 0 1 31 4z" />,
  pizza: (
    <>
      <path {...line} fill={HONEY} d="M6 12q18-7 36 0L24 45z" />
      <path {...line} fill={PLUM} d="M4.500 9q19.500-8 39 0l-2.500 6q-17-6.500-34 0z" />
      <circle cx="20" cy="22" r="3" fill={PLUM} /><circle cx="28.500" cy="25" r="2.600" fill={PLUM} /><circle cx="23.500" cy="32" r="2.400" fill={PLUM} />
    </>
  ),
  asterisk: (
    <>
      <path d="M24 7v34M9.300 15.500l29.400 17M9.300 32.500l29.400-17" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M24 7v34M9.300 15.500l29.400 17M9.300 32.500l29.400-17" fill="none" stroke={MAUVE} strokeWidth="8.400" strokeLinecap="round" />
    </>
  ),
}

export const STICKER_NAMES = Object.keys(ART)

// Boards saved before the drawn set existed still hold emoji; show the matching drawing where there is one.
const FROM_EMOJI = { '❤️': 'heart', '😂': 'laugh', '😏': 'smirk', '🔥': 'flame', '👀': 'eyes', '❞': 'quote', '✈️': 'plane', '💬': 'chat', '✳️': 'asterisk', '➡️': 'arrow', '🌙': 'moon', '🍕': 'pizza' }

export function Sticker({ name, emoji, size = 40 }) {
  const key = name || FROM_EMOJI[emoji]
  if (!ART[key]) return <span style={{ fontSize: size * 0.8 }}>{emoji}</span>
  return <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={`${key} sticker`}>{ART[key]}</svg>
}

// Photo cut-outs from the design system: files in public/stickers/<name>.png, with the width each shows at on a board.
// To add one, save a transparent PNG there and add a line here.
export const OBJECTS = [
  { name: 'camera', w: 64 }, { name: 'tumbler', w: 50 }, { name: 'envelope', w: 62 }, { name: 'star', w: 30 },
  { name: 'stub', w: 66 }, { name: 'clip-blue', w: 78 }, { name: 'clip-silver', w: 70 }, { name: 'tape-green', w: 76 },
  { name: 'tape-gingham', w: 130 }, { name: 'tape-clear', w: 90 }, { name: 'clip-paper', w: 70 }, { name: 'lined-paper', w: 84 },
  { name: 'paper', w: 96 }, { name: 'clipboard', w: 96 }, { name: 'crumpled', w: 96 },
]

export function ObjectSticker({ name, width }) {
  const o = OBJECTS.find((x) => x.name === name)
  return <img className="object-img" src={`${import.meta.env.BASE_URL}stickers/${name}.png`} alt={`${name.replace('-', ' ')} sticker`} draggable={false} style={{ width: width || o?.w || 70 }} />
}
