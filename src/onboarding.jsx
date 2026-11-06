// Screens 00a–00i: splash, the four intro slides, account, purpose, invite, all set.
import { useRef, useState } from 'react'
import { FRIENDS, fileToDataUrl, timeIn, toUsername } from './store.js'
import { Art, Avatar, Icon, StatusBar } from './ui.jsx'

const STEPS = 7

// The moving background: six soft blobs in the given colours, drifting behind everything else on the screen.
// `fade` adds the wash to white used on the form screens, so the fields sit on a plain background.
const PALETTES = {
  splash: ['#a892f5', '#f284b6', '#ee962f', '#f392bf', '#f9cc50', '#94b6f7'],
  peach: ['#f2a0c0', '#f3a583', '#f7c49e', '#ee96b2', '#f8d4a4', '#ecaad2'],
  sea: ['#b3a6f0', '#93c9ee', '#9cdcbc', '#84bde8', '#c4baf4', '#a6e2c8'],
  lilac: ['#ba96ee', '#e4aaee', '#afa0f2', '#d4b8f6', '#f0bade', '#aea8f0'],
  sun: ['#f6c250', '#f39e5c', '#c8dc84', '#f8d470', '#f0ac78', '#dae494'],
  setup: ['#a892f5', '#f08fba', '#f6cf90', '#c2aef6', '#f4a0c4', '#f8dca4'],
  purpose: ['#9fc8e8', '#b8a8f3', '#aedcd8', '#94baec', '#cabdf6', '#b6e0ee'],
  invite: ['#f3b294', '#f092ba', '#f8ca9c', '#f29eae', '#f6bcd0', '#f8d6ac'],
  allset: ['#cfe070', '#f4eca0', '#bcdb9c', '#e2ea88', '#f6eeb8', '#c8e2a8'],
}
function Aurora({ palette, fade }) {
  return (
    <>
      <div className="aurora" aria-hidden="true">{PALETTES[palette].map((c, n) => <i key={n} className={`b${n + 1}`} style={{ '--c': c }} />)}</div>
      {fade && <div className="aurora-fade" aria-hidden="true" />}
    </>
  )
}

function Dots({ step }) {
  return (
    <div className="dots" aria-label={`Step ${step + 1} of ${STEPS}`}>
      {Array.from({ length: STEPS }, (_, i) => <i key={i} className={i === step ? 'on' : ''} />)}
    </div>
  )
}

function TopBar({ step, onBack, onSkip }) {
  return (
    <div className="ob-top">
      {onBack ? <button className="plain" onClick={onBack} aria-label="Back"><Icon name="back" /></button> : <span className="spacer" />}
      <Dots step={step} />
      {onSkip ? <button className="plain skip" onClick={onSkip}>Skip</button> : <span className="spacer" />}
    </div>
  )
}

export function Splash({ onStart, onHave }) {
  return (
    <div className="screen grad grad-live live">
      <Aurora palette="splash" />
      <StatusBar />
      <div className="splash-mid">
        <h1 className="serif logo">Inyun</h1>
        <p>For the little things,<br />and the people you share them with.</p>
      </div>
      <div className="foot">
        <button className="btn white" onClick={onStart}>Start your journey here <Icon name="arrow" size={14} stroke={2} /></button>
        <button className="plain tiny" onClick={onHave}>I already have a board</button>
      </div>
    </div>
  )
}

const SLIDES = [
  {
    grad: 'grad-peach', palette: 'peach', eyebrow: 'For the people far away', title: 'Stay close to your long distance besties.',
    body: 'Leave notes, voice notes and photos on a shared board, whatever time it is where they are.',
    art: () => (
      <div className="ill ill-besties">
        <span className="orb a" /><span className="orb b" />
        <span className="chip c1">{timeIn('America/New_York')} New York</span>
        <span className="chip c2">{timeIn('Europe/Budapest')} Budapest</span>
      </div>
    ),
  },
  {
    grad: 'grad-sea', palette: 'sea', eyebrow: 'For the group chat', title: 'Plan the trip before you land.',
    body: 'Pin restaurants, tickets and links in one place with your friends, then keep it all when you get home.',
    art: () => (
      <div className="ill ill-trip">
        <svg viewBox="0 0 390 300" fill="none" stroke="#6b7c8f" strokeDasharray="3 5" strokeWidth="1.200"><path d="M-10 250C80 110 250 80 400 120" /><path d="M-10 300C110 180 260 160 400 190" /></svg>
        {[[120, 150, '#7fc0a8'], [205, 125, '#7fb2d8'], [290, 135, '#8f95e6'], [55, 215, '#6fa4d6'], [178, 228, '#6fb0d0'], [272, 218, '#86cbb0'], [78, 280, '#7fc6a0']].map(([x, y, c], i) => (
          <span key={i} className="blob" style={{ left: x, top: y, background: c }} />
        ))}
        <span className="chip c1">Lisbon, in 43 days</span>
        <span className="chip c2">Dinner, 8 pm</span>
      </div>
    ),
  },
  {
    grad: 'grad-lilac', palette: 'lilac', eyebrow: 'For just you', title: 'Keep a journal worth looking at.',
    body: 'A visual diary, a vision board, or a place to track the months. Your own board, kept for you.',
    art: () => (
      <div className="ill ill-journal">
        <span className="card k1"><Art kind="nyc" /></span>
        <span className="card k2"><Art kind="friends" /></span>
        <span className="card k3"><Art kind="drinks" /></span>
      </div>
    ),
  },
  {
    grad: 'grad-sun', palette: 'sun', eyebrow: 'Every month', title: 'Then walk back through it together.',
    body: 'At the end of each month, your board becomes a recap of how far you came, and who came with you.',
    cta: 'Set up my board',
    art: () => (
      <div className="ill ill-recap">
        <svg viewBox="0 0 390 300" fill="none" stroke="#3a3528" strokeDasharray="2 5" strokeWidth="1.600" strokeLinecap="round"><path d="M0 232c60-8 90 14 150 2s70-52 130-58 80-10 110-14" /></svg>
        <span className="orb a" /><span className="orb b" />
        <span className="chip c1">OCT</span><span className="chip c2">NOV</span><span className="chip c3">DEC</span>
      </div>
    ),
  },
]

export function Intro({ index, onNext, onBack, onSkip }) {
  const s = SLIDES[index]
  return (
    <div className={`screen grad live ${s.grad}`}>
      <Aurora palette={s.palette} />
      <StatusBar />
      <TopBar step={index} onBack={index > 0 ? onBack : null} onSkip={onSkip} />
      {s.art()}
      <div className="ob-panel">
        <small>{s.eyebrow}</small>
        <h2 className="serif">{s.title}</h2>
        <p>{s.body}</p>
        <button className="btn dark" onClick={onNext}>{s.cta || 'Continue'}</button>
      </div>
    </div>
  )
}
export const INTRO_COUNT = SLIDES.length

export function Setup({ user, dispatch, onNext, onBack }) {
  const file = useRef(null)
  const [touched, setTouched] = useState(Boolean(user.username))
  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (f) dispatch({ type: 'user', patch: { photo: await fileToDataUrl(f, 500) } })
  }
  return (
    <div className="screen grad live grad-setup">
      <Aurora palette="setup" fade />
      <StatusBar />
      <TopBar step={4} onBack={onBack} />
      <div className="ob-head">
        <h2 className="serif">Let's set you up.</h2>
        <p>Your photo walks across your recaps.</p>
      </div>
      <button className="addphoto" onClick={() => file.current.click()}>
        {user.photo ? <img src={user.photo} alt="Your photo" /> : 'Add photo'}
      </button>
      <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
      <form className="fields scroll" onSubmit={(e) => { e.preventDefault(); onNext() }}>
        <label>Your name
          <input
            value={user.name} placeholder="Celine" autoComplete="given-name"
            // Until you type a username yourself, it follows your name.
            onChange={(e) => dispatch({ type: 'user', patch: { name: e.target.value, ...(touched ? {} : { username: toUsername(e.target.value) }) } })}
          />
        </label>
        <label>Username
          <span className="at">
            <input
              value={user.username || ''} placeholder="celine" autoComplete="username" autoCapitalize="none" autoCorrect="off" required
              onChange={(e) => { setTouched(true); dispatch({ type: 'user', patch: { username: toUsername(e.target.value) } }) }}
            />
          </span>
        </label>
        <label>Email
          <input type="email" value={user.email} placeholder="you@example.com" autoComplete="email" onChange={(e) => dispatch({ type: 'user', patch: { email: e.target.value } })} />
        </label>
        <label>Phone <i>optional, so friends can find you</i>
          <input type="tel" value={user.phone || ''} placeholder="+1 555 010 0199" autoComplete="tel" onChange={(e) => dispatch({ type: 'user', patch: { phone: e.target.value } })} />
        </label>
        <div className="grow" />
        <button className="btn dark">Create my account</button>
      </form>
    </div>
  )
}

const PURPOSES = ['Long distance besties', 'Family', 'A trip with friends', 'My own journal', 'A vision board', 'Tracking my months']

export function Purpose({ state, dispatch, onNext, onBack }) {
  const toggle = (p) => {
    const has = state.purposes.includes(p)
    dispatch({ type: 'set', patch: { purposes: has ? state.purposes.filter((x) => x !== p) : [...state.purposes, p] } })
  }
  return (
    <div className="screen grad live grad-purpose">
      <Aurora palette="purpose" fade />
      <StatusBar />
      <TopBar step={5} onBack={onBack} />
      <div className="ob-head">
        <h2 className="serif">What's your first board for?</h2>
        <p>Pick as many as you like. You can make more later.</p>
      </div>
      <div className="chips">
        {PURPOSES.map((p) => (
          <button key={p} className={state.purposes.includes(p) ? 'on' : ''} aria-pressed={state.purposes.includes(p)} onClick={() => toggle(p)}>{p}</button>
        ))}
      </div>
      <div className="grow" />
      <div className="foot"><button className="btn dark" onClick={onNext}>Continue</button></div>
    </div>
  )
}

export function Invite({ state, dispatch, onNext, onBack }) {
  const toggle = (id) => {
    const has = state.invited.includes(id)
    dispatch({ type: 'set', patch: { invited: has ? state.invited.filter((x) => x !== id) : [...state.invited, id] } })
  }
  return (
    <div className="screen grad live grad-invite">
      <Aurora palette="invite" fade />
      <StatusBar />
      <TopBar step={6} onBack={onBack} />
      <div className="ob-head">
        <h2 className="serif">Who are you missing?</h2>
        <p>Invite them now, or start on your own.</p>
      </div>
      <div className="people">
        {FRIENDS.slice(0, 3).map((f) => {
          const on = state.invited.includes(f.id)
          return (
            <div className="person" key={f.id}>
              <Avatar who={f.id} size={38} />
              <div><b>{f.name}</b><small>{f.place}, {f.offset}</small></div>
              <button className={`pill ${on ? 'on' : ''}`} onClick={() => toggle(f.id)}>{on ? 'Invited' : 'Invite'}</button>
            </div>
          )
        })}
      </div>
      <div className="grow" />
      <div className="foot"><button className="btn dark" onClick={onNext}>Continue</button></div>
    </div>
  )
}

export function AllSet({ onOpen }) {
  return (
    <div className="screen grad live grad-allset">
      <Aurora palette="allset" />
      <StatusBar />
      <div className="splash-mid">
        <h2 className="serif big">You're all set.</h2>
        <p>Your board is empty for now.<br />That's where the journey starts.</p>
      </div>
      <div className="foot"><button className="btn white" onClick={onOpen}>Open my boards</button></div>
    </div>
  )
}
