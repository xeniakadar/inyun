// Recaps: the month cards, and the walk back through a month.
import { useEffect, useRef, useState } from 'react'
import { MONTH, MONTH_NAME, NEXT_MONTH, boardTitle, friend } from './store.js'
import { Avatar, DateSticker, Icon, PinView, StatusBar, Toast } from './ui.jsx'
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

const DURATION = 14000

export function RecapPlayer({ state, id, month, back }) {
  const board = state.boards.find((b) => b.id === id)
  const { user } = state
  const pins = (month === MONTH ? board.pins : board.archive?.[month] || []).slice().sort((a, b) => a.day - b.day)
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
        const next = Math.min(1, v + dt / DURATION)
        if (next >= 1) setPlaying(false)
        return next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const done = t >= 1
  const day = Math.max(1, Math.round(t * 30))
  const shown = pins.filter((p) => p.day <= day)
  const km = Math.max(0, ...board.members.map((m) => friend(m).km || 0))
  const save = () => { setToast('Recap saved to Photos'); setTimeout(() => setToast(''), 2200) }
  const again = () => { setT(0); setPlaying(true) }
  const walkers = ['me', ...board.members.slice(0, 2)]

  return (
    <div className="screen paper">
      <StatusBar />
      <header className="board-head">
        <button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
        <span className="members"><Avatar who="me" user={user} ring />{board.members.map((m) => <Avatar key={m} who={m} ring />)}</span>
        <h1 className="serif spaced">{boardTitle(board, user)}</h1>
      </header>
      <div className={`recap ${done ? 'dim' : ''}`}>
        <div className="recap-pins">
          <DateSticker month={month} day={day} tint />
          {shown.map((p) => (
            <span key={p.id} className="recap-pin" style={{ transform: `rotate(${p.rot}deg)` }}><PinView pin={p} user={user} /></span>
          ))}
        </div>
        <div className={`walk ${playing ? 'go' : ''}`}>
          <div className="walkers" style={{ left: `${8 + t * 52}%` }}>
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
          <span className="summary-art grad grad-splash" />
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
