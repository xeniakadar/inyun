// Shared building blocks: icons, avatars, placeholder art, and every kind of pin.
import { useEffect, useRef, useState } from 'react'
import { LIST_DEFAULT, TICKET_COLORS, friend, noteColor } from './store.js'
import { ObjectSticker, Sticker } from './stickers.jsx'

const paths = {
  back: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  home: <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="m5 18 5-5 3 3 2.5-2.5L20 18" /></>,
  note: <path d="M6 3.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5zM14.5 3.5V8H19" />,
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.300-4.100 5.900-.8z" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  lock: <><rect x="5.500" y="10.500" width="13" height="9.500" rx="2" /><path d="M8.500 10.500V8a3.500 3.500 0 0 1 7 0v2.500" /></>,
  check: <path d="m5 12.500 4.500 4.500L19 7.500" />,
  music: <><path d="M9 18V6l10-2v12" /><circle cx="6.500" cy="18" r="2.500" /><circle cx="16.500" cy="16" r="2.500" /></>,
  link: <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />,
  friends: <><circle cx="9" cy="8.500" r="3.200" /><path d="M2.500 19.500c.500-3.500 3-5.500 6.500-5.500s6 2 6.500 5.500M15.500 5.600a3.200 3.200 0 0 1 0 5.800M17.500 14.300c2.300.600 3.700 2.400 4 5.200" /></>,
  bell: <path d="M6 16.500V11a6 6 0 0 1 12 0v5.500l1.500 2h-15zM10 20.500a2 2 0 0 0 4 0" />,
  search: <><circle cx="11" cy="11" r="6.500" /><path d="m16 16 4.500 4.500" /></>,
  poll: <path d="M5 20V11M12 20V4M19 20v-6" />,
  rotate: <path d="M19.500 12a7.500 7.500 0 1 1-2.200-5.300M19.500 4v4.500H15" />,
  resize: <path d="M20 14v6h-6M20 20l-6-6M4 10V4h6" />,
  ticket: <path d="M3.500 9V6.500h17V9a3 3 0 0 0 0 6v2.500h-17V15a3 3 0 0 0 0-6zM14 6.500v11" />,
  list: <path d="M9 7h11M9 12h11M9 17h11M4.500 7h.01M4.500 12h.01M4.500 17h.01" />,
  place: <><path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.500" r="2.300" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.400 13.500a7.600 7.600 0 0 0 0-3l2-1.500-2-3.500-2.400 1a7.600 7.600 0 0 0-2.600-1.500L14 2.500h-4l-.4 2.500A7.600 7.600 0 0 0 7 6.500l-2.400-1-2 3.500 2 1.500a7.600 7.600 0 0 0 0 3l-2 1.500 2 3.500 2.400-1a7.600 7.600 0 0 0 2.600 1.500l.4 2.500h4l.4-2.500a7.600 7.600 0 0 0 2.600-1.500l2.400 1 2-3.500z" /></>,
}
const solid = {
  play: <path d="M8 5.500v13l11-6.500z" />,
  pause: <path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z" />,
  stop: <rect x="7" y="7" width="10" height="10" rx="2" />,
}

export function Icon({ name, size = 20, stroke = 1.600 }) {
  if (solid[name]) return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{solid[name]}</svg>
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

// The Inyeon mark, from the designer's exported SVG (inyeon-logo-ink.svg): thread and pin both in ink, as shipped.
// LOGO_CENTRE is the thread's centreline, used only to reveal the outline progressively in the opening animation.
export const LOGO_OUTLINE = 'M61.64 257.80 C52.21 306.77 42.78 355.73 32.65 404.57 C22.54 453.32 11.52 502.30 4.94 551.67 C-1.24 598.03 -4.13 649.34 11.56 694.14 C27.82 740.58 65.48 782.06 117.90 782.06 C174.89 782.06 224.90 732.80 255.88 689.58 C295.95 633.69 325.22 564.30 357.53 503.27 C380.25 460.35 414.66 400.65 452.83 369.92 C470.52 355.69 499.71 340.60 522.64 351.02 C544.50 360.95 555.21 392.17 558.72 413.96 C564.97 452.80 557.91 501.04 552.92 540.04 C547.19 584.75 541.30 630.95 547.10 675.94 C552.99 721.59 571.91 772.36 615.37 794.50 C657.30 815.87 706.80 804.72 750.66 796.33 C770.19 792.59 782.99 773.73 779.26 754.21 C775.52 734.68 756.66 721.88 737.13 725.61 C713.87 730.06 668.61 740.82 648.06 730.35 C629.20 720.74 620.95 685.61 618.51 666.73 C613.65 629.07 619.53 586.71 624.33 549.18 C630.41 501.74 637.45 450.02 629.80 402.53 C622.18 355.11 598.14 306.25 552.43 285.47 C502.93 262.97 447.95 281.43 407.69 313.84 C360.37 351.92 322.07 416.38 293.90 469.58 C263.61 526.79 234.68 595.58 197.37 647.63 C182.46 668.43 146.54 710.06 117.90 710.06 C98.80 710.06 84.94 685.83 79.51 670.34 C68.16 637.93 71.84 594.67 76.31 561.18 C82.65 513.62 93.40 466.17 103.15 419.19 C113.35 370.02 122.84 320.73 132.34 271.42 C136.10 251.89 123.32 233.02 103.80 229.26 C84.27 225.50 65.40 238.28 61.64 257.80 Z'
export const LOGO_CENTRE = 'M97 264 C95 272 90 295 87 311 C84 327 81 342 78 358 C75 374 72 389 69 405 C66 421 62 436 59 452 C56 468 52 483 49 499 C46 515 44 530 42 546 C40 562 38 577 37 593 C36 609 36 624 38 640 C40 656 41 672 48 687 C55 702 68 724 81 733 C94 742 112 743 128 741 C144 739 160 733 175 722 C190 711 206 692 219 677 C232 662 240 646 250 630 C260 614 268 599 276 583 C284 567 292 552 300 536 C308 520 316 505 324 489 C332 473 340 458 350 442 C360 426 369 410 381 395 C393 380 406 362 421 349 C436 336 452 326 468 320 C484 314 499 311 515 314 C531 317 550 324 562 336 C574 348 581 367 586 383 C591 399 593 414 594 430 C595 446 595 461 594 477 C593 493 592 508 590 524 C588 540 586 555 585 571 C584 587 582 602 582 618 C582 634 581 649 583 665 C585 681 586 697 593 712 C600 727 611 748 624 757 C637 766 655 767 671 768 C687 769 707 765 718 764 C729 763 735 762 738 761'
export const LOGO_VIEWBOX = '0 0 780 807'
let logoN = 0
export function Logo({ size = 40, color = '#1F2128', pin, animate = false, className = '' }) {
  const id = useState(() => `logo-${logoN++}`)[0]
  return (
    <svg className={`logo-mark ${animate ? 'draw' : ''} ${className}`} width={size} height={size * 807 / 780} viewBox={LOGO_VIEWBOX} role="img" aria-label="Inyeon">
      <defs>
        <radialGradient id={`${id}-coral`} gradientUnits="userSpaceOnUse" cx="116.54" cy="56" r="144"><stop stopColor="#F3B0A2" /><stop offset="1" stopColor="#E07F78" /></radialGradient>
        {animate && (
          <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x="0" y="0" width="780" height="807">
            <path className="reveal" d={LOGO_CENTRE} fill="none" stroke="#fff" strokeWidth="110" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
          </mask>
        )}
      </defs>
      <path d={LOGO_OUTLINE} fill={color} mask={animate ? `url(#${id}-reveal)` : undefined} />
      <circle cx="132.54" cy="80" r="80" fill={pin || color} />
    </svg>
  )
}

export function StatusBar({ light }) {
  return (
    <div className={`statusbar ${light ? 'light' : ''}`} aria-hidden="true">
      <span>9:41</span>
      <span className="statusicons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.600" y="5" width="3" height="6" rx="1" /><rect x="9.200" y="2.500" width="3" height="8.500" rx="1" /><rect x="13.800" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.700" strokeLinecap="round"><path d="M1 4a9.500 9.500 0 0 1 13 0M3.300 6.500a6 6 0 0 1 8.400 0" /><circle cx="7.500" cy="9.300" r="1" fill="currentColor" stroke="none" /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".500" y=".500" width="21" height="11" rx="3.500" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" /><rect x="23" y="4" width="1.500" height="4" rx=".75" fill="currentColor" opacity=".4" /></svg>
      </span>
    </div>
  )
}

// A drawn stand-in for each demo photo. If public/photos/<kind>.jpg exists it is shown on top.
function ArtSvg({ kind }) {
  const common = { viewBox: '0 0 100 100', preserveAspectRatio: 'xMidYMid slice', className: 'art-svg' }
  if (kind === 'parliament')
    return (
      <svg {...common}>
        <rect width="100" height="100" fill="#07070a" />
        <g fill="#e9b54a">
          <rect x="8" y="50" width="84" height="12" />
          <path d="M44 50V36q6-14 12 0v14z" />
          <path d="M49.300 24h1.400l.8 12h-3z" />
          {[12, 20, 28, 36, 62, 70, 78, 86].map((x) => <path key={x} d={`M${x} 50v-8l1-5 1 5v8z`} />)}
        </g>
        <g fill="#7a5512" opacity=".8">{Array.from({ length: 20 }, (_, i) => <rect key={i} x={10 + i * 4} y="54" width="1.500" height="5" />)}</g>
        <rect x="8" y="64" width="84" height="20" fill="url(#refl)" />
        <defs><linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9952f" stopOpacity=".85" /><stop offset="1" stopColor="#c9952f" stopOpacity="0" /></linearGradient></defs>
      </svg>
    )
  if (kind === 'pizza')
    return (
      <svg {...common}>
        <rect width="100" height="100" fill="#b98a5a" />
        <circle cx="50" cy="52" r="44" fill="#e8b96a" />
        <circle cx="50" cy="52" r="38" fill="#e9c98a" />
        {[[34, 36], [56, 30], [72, 46], [40, 58], [60, 54], [30, 72], [52, 76], [72, 70], [46, 44], [66, 62]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6.500" fill="#b5312a" stroke="#8f211c" strokeWidth="1" />
        ))}
      </svg>
    )
  if (kind === 'flowers')
    return (
      <svg {...common}>
        <rect width="100" height="100" fill="#3b4a52" />
        <path d="M18 100 38 34l46 6-22 60z" fill="#c9905a" />
        <path d="M40 40c8-26 34-30 44-16-4 20-22 34-40 30z" fill="#e2463a" />
        <circle cx="52" cy="62" r="13" fill="#7b2a55" />
        <circle cx="52" cy="62" r="7" fill="#9a3a6c" />
        <circle cx="74" cy="72" r="9" fill="#5f8f3e" />
      </svg>
    )
  if (kind === 'skyline')
    return (
      <svg {...common}>
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb4dc" /><stop offset="1" stopColor="#f3c9a0" /></linearGradient></defs>
        <rect width="100" height="100" fill="url(#sky)" />
        <g fill="#5b5f73"><rect x="6" y="56" width="14" height="44" /><rect x="24" y="44" width="12" height="56" /><path d="M42 100V30l6-14 6 14v70z" /><rect x="60" y="50" width="14" height="50" /><rect x="78" y="62" width="16" height="38" /></g>
      </svg>
    )
  // portrait
  return (
    <svg {...common}>
      <rect width="100" height="100" fill="#d9d9d6" />
      <path d="M18 100c2-24 16-32 32-32s30 8 32 32z" fill="#2a2a2c" />
      <path d="M26 46c0-20 10-30 24-30s24 10 24 30c0 10-2 22-6 28H32c-4-6-6-18-6-28z" fill="#1b1b1d" />
      <ellipse cx="50" cy="48" rx="15" ry="19" fill="#f1ece6" />
    </svg>
  )
}

// Which file in public/photos each photo name uses. The older names still work, so saved boards pick up the real photos too.
const PHOTO_FILES = { portrait: 'me', parliament: 'budapest2', pizza: 'drinks', skyline: 'nyc' }

export function Art({ kind, src, className = '' }) {
  const [failed, setFailed] = useState(false)
  const url = src || `${import.meta.env.BASE_URL}photos/${PHOTO_FILES[kind] || kind}.jpg`
  return (
    <span className={`art ${className}`}>
      {!src && <ArtSvg kind={kind} />}
      {!failed && <img src={url} alt="" draggable={false} onError={() => setFailed(true)} />}
    </span>
  )
}

export function Avatar({ who, user, size = 30, ring }) {
  const style = { width: size, height: size, fontSize: size * 0.4 }
  if (who === 'me') {
    return (
      <span className={`avatar me ${ring ? 'ring' : ''}`} style={style}>
        {user?.photo ? <img src={user.photo} alt="" draggable={false} /> : <Art kind="portrait" />}
      </span>
    )
  }
  const f = friend(who)
  if (f.photo) {
    return (
      <span className={`avatar ${ring ? 'ring' : ''}`} style={style}>
        <img src={`${import.meta.env.BASE_URL}photos/${f.photo}.jpg`} alt="" draggable={false} />
      </span>
    )
  }
  return (
    <span className={`avatar ${ring ? 'ring' : ''}`} style={{ ...style, background: f.color, color: f.light ? '#3b3350' : '#fff' }}>
      {f.name[0]}
    </span>
  )
}

const BARS = [5, 9, 14, 8, 12, 16, 7, 11, 15, 9, 6, 13, 10, 5, 8, 12, 6]
export function Wave({ active, count = BARS.length }) {
  return (
    <span className={`wave ${active ? 'active' : ''}`} aria-hidden="true">
      {BARS.slice(0, count).map((h, i) => <i key={i} style={{ height: h, animationDelay: `${i * 60}ms` }} />)}
    </span>
  )
}

export const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`

function Voice({ pin }) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef(null)
  const timer = useRef(null)
  useEffect(() => () => { audio.current?.pause(); clearTimeout(timer.current) }, [])
  const toggle = (e) => {
    e.stopPropagation()
    if (playing) {
      audio.current?.pause(); clearTimeout(timer.current); setPlaying(false)
      return
    }
    setPlaying(true)
    if (pin.audio) {
      audio.current = new Audio(pin.audio)
      audio.current.onended = () => setPlaying(false)
      audio.current.play().catch(() => setPlaying(false))
    } else {
      timer.current = setTimeout(() => setPlaying(false), Math.min(pin.dur, 6) * 1000)
    }
  }
  return (
    <div className="pin-voice">
      <button className="voice-play" onClick={toggle} onPointerDown={(e) => e.stopPropagation()} aria-label={playing ? 'Pause voice note' : 'Play voice note'}>
        <Icon name={playing ? 'pause' : 'play'} size={14} />
      </button>
      <Wave active={playing} />
      <small>{clock(pin.dur)}</small>
    </div>
  )
}

// "pizza" becomes "1x pizza"; a line that already starts with a count ("2x tickets") is left alone.
export const listLine = (item) => (/^\d+\s*x\b/i.test(item.trim()) ? item.trim() : `1x ${item.trim()}`)

// Tickets keep the raw form values ("2026-12-19", "18:40") so they can be edited later; these turn them into "DEC 19" and "6:40 PM".
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const ticketDate = (iso) => { const [, m, d] = (iso || '').split('-').map(Number); return m && d ? `${MONTHS[m - 1]} ${d}` : '' }
const ticketTime = (t) => { const [h, m] = (t || '').split(':').map(Number); return Number.isFinite(h) && Number.isFinite(m) ? `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` : '' }
export function ticketLine(pin) {
  if (pin.line) return pin.line // tickets saved before the ticket maker existed
  const dep = ticketTime(pin.dep), arr = ticketTime(pin.arr)
  return [ticketDate(pin.date), dep && arr ? `${dep} → ${arr}` : dep || arr].filter(Boolean).join(' · ')
}

const Tack = () => <span className="tack" aria-hidden="true" />

export function PinView({ pin, user, onVote }) {
  switch (pin.type) {
    case 'note':
      // The pin sits outside the paper so the torn edge (a clip-path) does not cut it off.
      return <div className="pin-note-wrap"><Tack /><div className="pin-note paperlines hand" style={{ backgroundColor: noteColor(pin.color) }}>{pin.text}</div></div>
    case 'lined':
      return (
        <div className="pin-lined">
          <small>060805</small>
          <b>{pin.title}</b>
          <p>{pin.text}</p>
        </div>
      )
    case 'photo':
      return <div className="pin-photo"><Art kind={pin.art} src={pin.src} /></div>
    case 'voice':
      return <Voice pin={pin} />
    case 'ticket':
      return (
        <div className="pin-ticket" style={{ borderLeftColor: pin.color || TICKET_COLORS[0] }}>
          <b>{pin.from || 'FROM'}→{pin.to || 'TO'}</b>
          {ticketLine(pin) && <span>{ticketLine(pin)}</span>}
          {pin.seat && <span style={{ color: pin.color || TICKET_COLORS[0] }}>{/^seat/i.test(pin.seat) ? pin.seat : `SEAT ${pin.seat}`}</span>}
        </div>
      )
    case 'receipt':
      return (
        <div className="pin-receipt">
          <span>{pin.title ?? LIST_DEFAULT.title}</span><hr />
          {(pin.items ?? LIST_DEFAULT.items).map((item, i) => <span key={i}>{listLine(item)}</span>)}<hr />
          <span className="total"><i>TOTAL</i>{pin.total ?? LIST_DEFAULT.total}</span>
          <span>{pin.footer ?? LIST_DEFAULT.footer}</span>
        </div>
      )
    case 'strip':
      return (
        <div className="pin-strip">
          {[0, 1, 2].map((i) => <span key={i}>{user?.photo ? <img src={user.photo} alt="" draggable={false} /> : <Art kind="portrait" />}</span>)}
        </div>
      )
    case 'license':
      return (
        <div className="pin-license">
          <span className="lic-photo">{user?.photo ? <img src={user.photo} alt="" draggable={false} /> : <Art kind="portrait" />}</span>
          <span className="lic-text">LICENSE TO VISIT<br />NO. 7704-11<br />HOLDER: {(user?.name || 'YOU').toUpperCase()}<br />GOOD FOR: {friend('alex').name.toUpperCase()}<br />EXP: NEVER</span>
        </div>
      )
    case 'sticker':
      return <div className="pin-sticker"><Sticker name={pin.name} emoji={pin.emoji} /></div>
    case 'object':
      return <div className="pin-object"><ObjectSticker name={pin.name} /></div>
    case 'countdown':
      return <div className="pin-countdown"><span>{pin.label}</span><b>{pin.n}</b></div>
    case 'place':
      return <div className="pin-chip place"><Icon name="place" size={12} />{pin.label}</div>
    case 'time':
      return <div className="pin-chip time">{pin.label}</div>
    case 'song':
      return <div className="pin-chip"><Icon name="music" size={12} />{pin.label}</div>
    case 'link':
      return <div className="pin-chip"><Icon name="link" size={12} />{pin.label}</div>
    case 'poll':
      return (
        <div className={`pin-poll ${pin.options.length > 2 || pin.q.length > 12 ? 'stacked' : ''}`}>
          <b>{pin.q}</b>
          <div>
            {pin.options.map((o, i) => (
              <button
                key={o}
                className={`${i % 2 ? 'blue' : 'yellow'} ${pin.vote === o ? 'voted' : ''}`}
                onPointerDown={(e) => onVote && e.stopPropagation()}
                onClick={(e) => { if (onVote) { e.stopPropagation(); onVote(o) } }}
              >
                {o}{pin.vote === o && <Avatar who="me" user={user} size={14} />}
              </button>
            ))}
          </div>
        </div>
      )
    default:
      return null
  }
}

export function DateSticker({ month, day, tint }) {
  return (
    <div className={`datesticker ${tint ? 'tint' : ''}`}>
      <span>{month}</span>
      <b>{String(day).padStart(2, '0')}</b>
    </div>
  )
}

export function Toast({ text }) {
  return text ? <div className="toast" role="status">{text}</div> : null
}
