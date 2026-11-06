// Shared building blocks: icons, avatars, placeholder art, and every kind of pin.
import { useEffect, useRef, useState } from 'react'
import { friend } from './store.js'

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

export function Art({ kind, src, className = '' }) {
  const [failed, setFailed] = useState(false)
  const url = src || `/photos/${kind === 'portrait' ? 'me' : kind}.jpg`
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

const Tack = () => <span className="tack" aria-hidden="true" />

export function PinView({ pin, user, onVote }) {
  switch (pin.type) {
    case 'note':
      return <div className="pin-note hand" style={{ background: pin.color }}><Tack />{pin.text}</div>
    case 'lined':
      return (
        <div className="pin-lined">
          <small>060805</small>
          <b>{pin.title}</b>
          <p>{pin.text}</p>
        </div>
      )
    case 'photo':
      return <div className="pin-photo"><Tack /><Art kind={pin.art} src={pin.src} /></div>
    case 'voice':
      return <Voice pin={pin} />
    case 'ticket':
      return (
        <div className="pin-ticket">
          <b>{pin.from}→{pin.to}</b>
          <span>{pin.line}</span>
          <span className="blue">{pin.seat}</span>
        </div>
      )
    case 'receipt':
      return (
        <div className="pin-receipt">
          <span>TO TRY WHEN I VISIT</span><hr />
          <span>1x PIZZA, THAT ONE</span><span>1x DANUBE, NIGHT</span><span>1x YOUR GOOD CAFE</span><span>1x FLOWERS (AGAIN)</span><hr />
          <span>TOTAL&nbsp;&nbsp;&nbsp;&nbsp;1 VISIT</span><span>SOON, PLEASE</span>
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
          <span className="lic-text">LICENSE TO VISIT<br />NO. 7704-11<br />HOLDER: {(user?.name || 'YOU').toUpperCase()}<br />GOOD FOR: ALEX<br />EXP: NEVER</span>
        </div>
      )
    case 'sticker':
      return <div className="pin-sticker">{pin.emoji}</div>
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
