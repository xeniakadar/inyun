// Home, New board, the board itself (with the + menu), pin detail, and Settings.
import { useEffect, useRef, useState } from 'react'
import { MONTH, NEXT_MONTH, TODAY, boardTitle, fileToDataUrl, friend, hasNews, timeIn, uid } from './store.js'
import { Art, Avatar, DateSticker, Icon, Logo, PinView, StatusBar } from './ui.jsx'

// Home · Friends · + · Activity · Settings.
export function BottomNav({ state, go, onPlus, open, closing, current, plusLabel = 'Pin something' }) {
  const tab = (name, icon, label, extra) => (
    <button className={`tab t-${name}`} onClick={() => go(name)} aria-current={current === name ? 'page' : undefined}>
      <span className="tabicon"><Icon name={icon} size={19} />{extra}</span><span>{label}</span>
    </button>
  )
  return (
    <nav className={`bottomnav ${open || closing ? 'open' : ''}`}>
      {tab('home', 'home', 'HOME')}
      {tab('friends', 'friends', 'FRIENDS')}
      <button className="fab" onClick={onPlus} aria-label={open ? 'Close' : plusLabel}><Icon name={open ? 'x' : 'plus'} size={20} /></button>
      {tab('activity', 'bell', 'ACTIVITY', state && hasNews(state) && <i className="dot" aria-label="New activity" />)}
      {tab('settings', 'settings', 'SETTINGS')}
    </nav>
  )
}

function Members({ board, user, size = 30 }) {
  return (
    <span className="members">
      <Avatar who="me" user={user} size={size} ring />
      {board.members.map((m) => <Avatar key={m} who={m} size={size} ring />)}
    </span>
  )
}

// A board's card on Home. Each pin knows which way is "outward" from the middle of the card (--ox, --oy),
// so on hover or press the collage can ease apart a few pixels while the card itself lifts.
function Thumb({ board, user }) {
  return (
    <span className={`thumb hue-${board.hue}`}>
      <span className="thumb-inner">
        {board.pins.slice(0, 6).map((p) => {
          const dx = p.x + 55 - 180, dy = p.y + 55 - 180 // rough centre of the pin, relative to the card's centre
          const len = Math.hypot(dx, dy) || 1
          return (
            <span
              key={p.id} className="pin"
              style={{ left: p.x, top: p.y, '--ox': (dx / len).toFixed(2), '--oy': (dy / len).toFixed(2), '--rot': `${p.rot}deg` }}
            >
              <PinView pin={p} user={user} />
            </span>
          )
        })}
      </span>
    </span>
  )
}

export function Home({ state, go }) {
  const { user, boards } = state
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="home-head">
        <span className="spacer"><Logo size={34} color="#1f2128" /></span>
        <h1 className="scrawl">Home</h1>
        <button className="plain" onClick={() => go('settings')} aria-label="Settings"><Avatar who="me" user={user} size={34} /></button>
      </header>
      <div className="boards scroll">
        {boards.map((b, i) => (
          <button key={b.id} className={`boardcard tilt${i % 3}`} style={{ '--i': i }} onClick={() => go('board', { id: b.id })}>
            <Thumb board={b} user={user} />
            {b.members.length > 1 && <Members board={b} user={user} size={16} />}
            <span className="scrawl-sm">{boardTitle(b, user)}</span>
          </button>
        ))}
        <button className="boardcard" style={{ '--i': boards.length }} onClick={() => go('newboard')}>
          <span className="thumb new"><span className="fab"><Icon name="plus" size={18} /></span></span>
          <span className="scrawl-sm">New Board</span>
        </button>
      </div>
      <BottomNav state={state} go={go} current="home" plusLabel="New board" onPlus={() => go('newboard')} />
    </div>
  )
}

export function NewBoard({ state, dispatch, go, back }) {
  const [picked, setPicked] = useState(['alex'])
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const create = () => {
    const id = uid()
    dispatch({ type: 'addBoard', board: { id, members: picked, hue: ['peach', 'lilac', 'pink'][picked.length % 3], pins: [] } })
    go('board', { id }, true)
  }
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="bar"><button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button></header>
      <h2 className="serif pad">Who's this board with?</h2>
      <div className="people pad scroll">
        {state.friends.map(friend).map((f) => {
          const on = picked.includes(f.id)
          return (
            <button className={`person pick ${on ? 'on' : ''}`} key={f.id} aria-pressed={on} onClick={() => toggle(f.id)}>
              <Avatar who={f.id} size={34} />
              <b>{f.name}</b>
              <span className="tick">{on && <Icon name="check" size={14} stroke={2} />}</span>
            </button>
          )
        })}
        <button className="person pick dashed" onClick={() => setPicked([])}>
          <Icon name="plus" size={18} /><b>{picked.length ? 'Or keep it just for you' : 'Just for you'}</b>
        </button>
      </div>
      <div className="grow" />
      <div className="foot"><button className="btn dark" onClick={create}>Create board</button></div>
    </div>
  )
}

function DraggablePin({ pin, user, onMove, onOpen, onVote }) {
  const [pos, setPos] = useState(null)
  const start = useRef(null)
  const down = (e) => {
    start.current = { px: e.clientX, py: e.clientY, x: pin.x, y: pin.y, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e) => {
    const s = start.current
    if (!s) return
    const dx = (e.clientX - s.px) / BOARD_ZOOM, dy = (e.clientY - s.py) / BOARD_ZOOM
    if (!s.moved && Math.hypot(dx, dy) < 4) return
    s.moved = true
    setPos({ x: Math.max(-10, Math.min(1290, s.x + dx)), y: Math.max(0, Math.min(400, s.y + dy)) })
  }
  const up = () => {
    const s = start.current
    start.current = null
    if (!s) return
    if (s.moved && pos) onMove(pos.x, pos.y)
    else onOpen()
    setPos(null)
  }
  const p = pos || pin
  return (
    <div
      className={`pin ${pos ? 'dragging' : ''}`}
      style={{ left: p.x, top: p.y, transform: `rotate(${pos ? 0 : pin.rot}deg)` }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
    >
      <PinView pin={pin} user={user} onVote={onVote} />
    </div>
  )
}

// Measures where each menu option ends up relative to the + button and stores the offset on it,
// so the open animation can start every option exactly on the button and let it fly out from there.
function placeBurst(el) {
  if (!el) return
  const fab = el.parentElement.querySelector('.bottomnav .fab')?.getBoundingClientRect()
  if (!fab) return
  el.querySelectorAll('.menuitem').forEach((item) => {
    const icon = item.querySelector('.fab').getBoundingClientRect()
    item.style.setProperty('--fx', `${fab.left + fab.width / 2 - (icon.left + icon.width / 2)}px`)
    item.style.setProperty('--fy', `${fab.top + fab.height / 2 - (icon.top + icon.height / 2)}px`)
    item.classList.add('go')
  })
}

// Everything on the board is drawn at this scale so notes and lists are readable; pin positions stay in unscaled units.
export const BOARD_ZOOM = 1.4
const PAGE = 350 // the demo boards are laid out in 350-unit columns; a swipe settles on the next column

const MENU = [
  { key: 'photo', icon: 'image', label: 'PHOTO' },
  { key: 'voice', icon: 'mic', label: 'VOICE' },
  { key: 'note', icon: 'note', label: 'NOTE' },
  { key: 'sticker', icon: 'star', label: 'STICKER' },
]

export function Board({ state, dispatch, id, go, back, newMonth }) {
  const [menu, setMenu] = useState(false) // false | 'open' | 'closing'
  const openMenu = () => setMenu('open')
  const closeMenu = () => { setMenu('closing'); setTimeout(() => setMenu((m) => (m === 'closing' ? false : m)), 260) }
  const canvas = useRef(null)
  const [more, setMore] = useState(true) // is there board to the right of what is showing?
  const checkMore = () => { const c = canvas.current; if (c) setMore(c.scrollLeft + c.clientWidth < c.scrollWidth - 8) }
  useEffect(checkMore, [id])
  const board = state.boards.find((b) => b.id === id)
  const { user } = state
  const pins = newMonth || !board ? [] : board.pins
  // Shown once, after the first thing you pin yourself. Any touch on a pin (or 8 seconds) retires it for good.
  const showHint = state.dragHint === 'show' && pins.length > 0 && !menu
  const hintDone = () => state.dragHint === 'show' && dispatch({ type: 'set', patch: { dragHint: 'done' } })
  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(hintDone, 8000)
    return () => clearTimeout(t)
  }, [showHint]) // eslint-disable-line
  if (!board) return null
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="board-head">
        <button className="plain" onClick={() => go('recaps', { id })} aria-label="Recaps"><Members board={board} user={user} /></button>
        <h1 className="serif spaced">{boardTitle(board, user)}</h1>
      </header>
      <div className={`canvas ${menu ? 'blurred' : ''} ${more ? 'has-more' : ''}`} ref={canvas} onScroll={checkMore}>
        <div className="canvas-inner" style={{ zoom: BOARD_ZOOM }}>
          {/* snap points every page width, so a swipe lands with a sliver of the next page showing */}
          {[0, 1, 2, 3].map((n) => <i key={n} className="snap" style={{ left: n * PAGE }} />)}
          <button className="plain datebtn" onClick={() => go('recaps', { id })} aria-label="Open recaps">
            <DateSticker month={newMonth ? NEXT_MONTH : MONTH} day={newMonth ? 1 : TODAY} />
          </button>
          {pins.map((p) => (
            <DraggablePin
              key={p.id} pin={p} user={user}
              onMove={(x, y) => { hintDone(); dispatch({ type: 'movePin', boardId: id, pinId: p.id, x, y }) }}
              onOpen={() => { hintDone(); go('pin', { id, pinId: p.id }) }}
              onVote={(option) => dispatch({ type: 'vote', boardId: id, pinId: p.id, option })}
            />
          ))}
        </div>
      </div>
      <div className={`hintrow ${menu ? 'blurred' : ''}`}>
        <span className="caps">{pins.length ? 'TAP TO ZOOM · SWIPE FOR MORE' : 'PRESS + TO PIN SOMETHING'}</span>
        {newMonth
          ? <button className="pill float honey" onClick={() => go('recaps', { id })}>Your {MONTH} recap <Icon name="arrow" size={12} stroke={2} /></button>
          : <button className="pill float honey" onClick={() => go('recaps', { id })}><Icon name="arrow" size={12} stroke={2} /> Recaps</button>}
      </div>
      {showHint && <button className="toast hint" onClick={hintDone}>Drag to move · tap to open</button>}
      {menu && (
        <div className={`addmenu ${menu === 'closing' ? 'closing' : ''}`} onClick={closeMenu} ref={placeBurst}>
          {MENU.map((m, i) => (
            <button key={m.key} className={`menuitem m${i}`} style={{ '--n': [1, 2, 0, 3][i] }} onClick={() => go(m.key, { id })}>
              <span className="fab"><Icon name={m.icon} size={18} /></span>
              <span className="caps">{m.label}</span>
            </button>
          ))}
        </div>
      )}
      <BottomNav state={state} go={go} open={menu === 'open'} closing={menu === 'closing'} onPlus={() => (menu === 'open' ? closeMenu() : openMenu())} />
    </div>
  )
}

export function PinDetail({ state, dispatch, id, pinId, go, back }) {
  const [text, setText] = useState('')
  const board = state.boards.find((b) => b.id === id)
  const pin = board?.pins.find((p) => p.id === pinId)
  if (!pin) return null
  const { user } = state
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const meta = `${(user.name || 'You').toUpperCase()} · NEW YORK · ${timeIn('America/New_York')}`
    dispatch({ type: 'comment', boardId: id, pinId, comment: { by: 'me', text: text.trim(), meta } })
    setText('')
  }
  const isPhoto = pin.type === 'photo'
  return (
    <div className="screen paper detail">
      <StatusBar light={isPhoto} />
      <div className={`detail-top ${isPhoto ? 'photo' : ''}`}>
        {isPhoto ? <Art kind={pin.art} src={pin.src} /> : <div className="detail-pin"><PinView pin={pin} user={user} /></div>}
        <button className="round overlay" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
      </div>
      <div className="detail-notes scroll">
        <span className="caps">NOTES</span>
        {(pin.comments || []).map((c, i) => (
          <div className="comment" key={i}>
            <Avatar who={c.by} user={user} size={26} />
            <div><p>{c.text}</p><span className="caps">{c.meta}</span></div>
          </div>
        ))}
        <form onSubmit={send}>
          <input className="writeback serif" value={text} placeholder="Write back..." onChange={(e) => setText(e.target.value)} />
        </form>
        <hr /><hr />
        {pin.by === 'me' && pin.type === 'receipt' && (
          <button className="pill float edit" onClick={() => go('list', { id, pinId })}>Edit list</button>
        )}
        {pin.by === 'me' && pin.type === 'poll' && (
          <button className="pill float edit" onClick={() => go('poll', { id, pinId })}>Edit poll</button>
        )}
        {pin.by === 'me' && pin.type === 'ticket' && (
          <button className="pill float edit" onClick={() => go('ticket', { id, pinId })}>Edit ticket</button>
        )}
        {pin.by === 'me' && (
          <button className="plain tiny danger" onClick={() => { dispatch({ type: 'removePin', boardId: id, pinId }); back() }}>Take this off the board</button>
        )}
      </div>
    </div>
  )
}

export function Settings({ state, dispatch, go, back }) {
  const file = useRef(null)
  const { user } = state
  const onBoards = [...new Set(state.boards.flatMap((b) => b.members))]
  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (f) dispatch({ type: 'user', patch: { photo: await fileToDataUrl(f, 500) } })
  }
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="bar"><button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button></header>
      <div className="pad scroll">
        <h2 className="sans-title">Your face</h2>
        <p className="muted">This photo is the head that walks across your recaps.</p>
        <div className="face">
          <Avatar who="me" user={user} size={96} />
          {(user.name || user.username) && <p className="whoami"><b>{user.name}</b>{user.username && <small>@{user.username}</small>}</p>}
          <button className="pill float" onClick={() => file.current.click()}>Change photo</button>
          <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
        </div>
        <span className="caps">ON YOUR BOARDS</span>
        {onBoards.map((m) => {
          const f = friend(m)
          return (
            <div className="person flat" key={m}>
              <Avatar who={m} size={30} />
              <div><b>{f.name}</b><small>{f.place} · {f.offset}</small></div>
            </div>
          )
        })}
        <button className="plain tiny danger" onClick={() => { dispatch({ type: 'reset' }); go('splash', {}, true) }}>Reset the demo</button>
      </div>
    </div>
  )
}
