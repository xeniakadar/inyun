// Recaps: the month cards, and the walk back through a month.
import { useEffect, useRef, useState } from 'react'
import { MONTH, MONTH_NAME, NEXT_MONTH, boardTitle, friend } from './store.js'
import { Avatar, DateSticker, Icon, Logo, PinView, StatusBar, Toast } from './ui.jsx'
import { BottomNav } from './board.jsx'

const things = (n) => `${n} little ${n === 1 ? 'thing' : 'things'}`

export function Recaps({ state, id, go, back }) {
  const board = state.boards.find((b) => b.id === id)
  const { user } = state
  const cards = [
    ...Object.entries(board.archive || {}).map(([m, pins]) => ({ month: m, pins, grad: 'grad-oct' })),
    { month: MONTH, pins: board.pins, grad: 'grad-splash' },
    { month: NEXT_MONTH, locked: true },
  ]
  const [idx, setIdx] = useState(cards.length - 2)
  const rail = useRef(null)
  useEffect(() => {
    const el = rail.current?.children[idx]
    el?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, []) // eslint-disable-line
  const onScroll = () => {
    const r = rail.current
    const mid = r.scrollLeft + r.clientWidth / 2
    let best = 0, d = Infinity
    ;[...r.children].forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid)
      if (dist < d) { d = dist; best = i }
    })
    setIdx(best)
  }
  const card = cards[idx]
  const play = (c) => !c.locked && c.pins.length > 0 && go('recap', { id, month: c.month })
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="board-head">
        <button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
        <span className="members"><Avatar who="me" user={user} ring />{board.members.map((m) => <Avatar key={m} who={m} ring />)}</span>
        <h1 className="serif spaced">{boardTitle(board, user)}</h1>
      </header>
      <div className="rail" ref={rail} onScroll={onScroll}>
        {cards.map((c, i) => (
          <button key={c.month} className={`monthcard ${i === idx ? 'on' : ''}`} onClick={() => (i === idx ? play(c) : rail.current.children[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }))}>
            <span className={`monthart ${c.locked ? 'locked' : `grad ${c.grad}`}`}>{c.locked && <span className="fab small"><Icon name="lock" size={14} /></span>}</span>
            <span className="serif monthname">{c.month}</span>
          </button>
        ))}
      </div>
      <div className="center">
        <button className="pill float" onClick={() => play(card)} disabled={card.locked || !card.pins.length}>
          {card.locked ? 'Opens Jan 1' : card.pins.length ? things(card.pins.length) : 'Nothing pinned yet'}
        </button>
      </div>
      <div className="grow" />
      <BottomNav state={state} go={go} plusLabel="Back to the board" onPlus={() => go('board', { id })} />
    </div>
  )
}

function Walker({ who, user, flip }) {
  return (
    <span className={`walker ${flip ? 'flip' : ''}`}>
      <Avatar who={who} user={user} size={38} ring />
      <svg width="46" height="70" viewBox="0 0 46 70" fill="none" stroke="#1f2128" strokeWidth="2" strokeLinecap="round">
        <path d="M23 0v36" />
        <path className="arm" d="M23 10 6 26" />
        <path d="M23 10l20 12" />
        <path className="leg l" d="M23 36 12 68" />
        <path className="leg r" d="M23 36l11 32" />
      </svg>
    </span>
  )
}

// The recap spaces a month's pins out so it reads as time passing: one lands, a day or three go by, the next lands.
// Order is kept (earliest first, then the order things were pinned); only the spacing is evened out, so a burst of
// pins added in one sitting does not all appear on the same day. First pin lands on day 2, last on day 30.
const GAPS = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1]
export function spreadOverMonth(pins) {
  const ordered = pins.map((p, i) => ({ p, i })).sort((a, b) => a.p.day - b.p.day || a.i - b.i).map((x) => x.p)
  if (ordered.length < 2) return ordered.map((p) => ({ ...p, day: 30 }))
  let sum = 0
  const at = ordered.map((_, k) => (sum += GAPS[k % GAPS.length]))
  const span = at[at.length - 1] - at[0]
  const days = at.map((a) => Math.round(2 + ((a - at[0]) / span) * 28))
  // With up to 29 pins there is room for each to have its own day: nudge any that rounded onto the same one.
  if (days.length <= 29) {
    for (let k = 1; k < days.length; k++) days[k] = Math.max(days[k], days[k - 1] + 1)
    for (let k = days.length - 1; k >= 0; k--) days[k] = Math.min(days[k], 30 - (days.length - 1 - k))
  }
  return ordered.map((p, k) => ({ ...p, day: days[k] }))
}

// About a second per pin, so a full month does not rush past and a quiet one does not drag.
const durationFor = (count) => Math.min(26000, Math.max(14000, count * 1000))
// Collage layout for the recap: three loose columns at near board size, each pin nudged and tilted a little.
// A month is taller than the screen, so as days pass the collage drifts upward, keeping the newest pins in view
// (the older ones slide off the top, like walking on). Deterministic, so a recap looks the same every time it plays.
const ROW = 150
const ZOOM = 0.95
function collage(pins) {
  const cols = 3, width = Math.round(390 / ZOOM), colW = (width - 150) / (cols - 1)
  return pins.map((p, k) => {
    const j = ((k * 7919) % 97) / 97 - 0.5 // a stable "random" in -0.5..0.5
    const row = Math.floor(k / cols), col = (k + (row % 2)) % cols
    return { ...p, cx: Math.min(width - 135, Math.max(4, 12 + col * colW + j * 22)), cy: 70 + row * ROW + j * 20, crot: p.rot + j * 8 }
  })
}

export function RecapPlayer({ state, id, month, back }) {
  const board = state.boards.find((b) => b.id === id)
  const { user } = state
  const month_pins = spreadOverMonth(month === MONTH ? board.pins : board.archive?.[month] || [])
  const area = useRef(null)
  const [areaH, setAreaH] = useState(420)
  useEffect(() => {
    const el = area.current
    if (!el) return
    const m = () => setAreaH(el.clientHeight)
    m()
    const ro = new ResizeObserver(m)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const pins = collage(month_pins)
  const duration = durationFor(pins.length)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [toast, setToast] = useState('')
  const last = useRef(0)

  useEffect(() => {
    if (!playing) return
    let raf
    last.current = performance.now()
    const step = (now) => {
      const dt = now - last.current
      last.current = now
      setT((v) => {
        const next = Math.min(1, v + dt / duration)
        if (next >= 1) setPlaying(false)
        return next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, duration])

  const done = t >= 1
  const day = Math.max(1, Math.round(t * 30))
  const shown = pins.filter((p) => p.day <= day)
  // keep the newest pin's row in view: once the collage outgrows the area, slide it up
  const lowest = shown.reduce((m, p) => Math.max(m, p.cy + 150), 0)
  const drift = Math.max(0, lowest - areaH / ZOOM + 10)
  const km = Math.max(0, ...board.members.map((m) => friend(m).km || 0))
  const save = () => { setToast('Recap saved to Photos'); setTimeout(() => setToast(''), 2200) }
  const again = () => { setT(0); setPlaying(true) }
  const walkers = ['me', ...board.members] // everyone on the board walks

  return (
    <div className="screen paper">
      <StatusBar />
      <header className="board-head">
        <button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
        <span className="members"><Avatar who="me" user={user} ring />{board.members.map((m) => <Avatar key={m} who={m} ring />)}</span>
        <h1 className="serif spaced">{boardTitle(board, user)}</h1>
      </header>
      <div className={`recap ${done ? 'dim' : ''}`}>
        <div className="recap-pins" ref={area}>
          <span className="datesticker-fixed"><DateSticker month={month} day={day} tint /></span>
          <div className="recap-collage" style={{ zoom: ZOOM, width: Math.round(390 / ZOOM), transform: `translateY(-${drift}px)` }}>
            {shown.map((p) => (
              <span key={p.id} className="recap-pin" style={{ left: p.cx, top: p.cy, transform: `rotate(${p.crot}deg)` }}><PinView pin={p} user={user} /></span>
            ))}
          </div>
        </div>
        <div className={`walk ${playing ? 'go' : ''}`}>
          <div className="walkers" style={{ transform: `translateX(${(6 + t * (walkers.length > 3 ? 38 : 52)) * 3.9}px)` }}>
            {walkers.map((w, i) => <Walker key={w} who={w} user={user} flip={i % 2 === 1} />)}
          </div>
          <svg className="ground" viewBox="0 0 390 60" preserveAspectRatio="none" fill="none" stroke="#1f2128" strokeWidth="1.800" strokeLinecap="round">
            <path d="M0 22c40-6 80 4 130 0s90-8 140-2 80 4 120 0" />
            {[40, 100, 150, 205, 250, 300, 345].map((x, i) => (
              <path key={x} className="sprout" style={{ opacity: t * 8 > i ? 1 : 0 }} d={`M${x} 20v-${10 + (i % 3) * 5}m0 ${6 + (i % 2) * 3}l-5-6m5 ${3}l5-6`} />
            ))}
            <ellipse cx="70" cy="38" rx="7" ry="2.500" /><ellipse cx="190" cy="42" rx="8" ry="2.500" /><ellipse cx="300" cy="36" rx="6" ry="2.500" />
          </svg>
        </div>
        <div className="player">
          <button className="playbtn" onClick={() => (done ? again() : setPlaying((p) => !p))} aria-label={playing ? 'Pause' : 'Play'}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
          <span className="track"><i style={{ width: `${t * 100}%` }} /></span>
          <button className="pill" onClick={save}><Icon name="download" size={14} /> Save</button>
        </div>
      </div>
      {done && (
        <div className="summary">
          <span className="summary-art grad grad-splash"><Logo size={44} color="#1f2128" /></span>
          <div>
            <small>Your {month === MONTH ? MONTH_NAME : month}</small>
            <p className="serif">{things(pins.length)}.{km > 0 && <><br />{km.toLocaleString()} km apart.</>}<br />Still walking.</p>
            <button className="pill float" onClick={again}>Watch again</button>
            <button className="pill float" onClick={back}>Done</button>
          </div>
        </div>
      )}
      <Toast text={toast} />
    </div>
  )
}
