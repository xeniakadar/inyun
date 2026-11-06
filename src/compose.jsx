// The four things you can pin: note, voice, photo, sticker.
import { useEffect, useRef, useState } from 'react'
import { NOTE_COLORS, STICKERS, TODAY, fileToDataUrl, timeIn, uid } from './store.js'
import { Art, Icon, PinView, StatusBar, Wave, clock } from './ui.jsx'

const drop = (extra) => ({
  id: uid(), by: 'me', day: TODAY,
  x: Math.round(30 + Math.random() * 180), y: Math.round(70 + Math.random() * 170), rot: Math.round(Math.random() * 8 - 4),
  ...extra,
})

function Header({ back, title }) {
  return (
    <header className="bar">
      <button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
      {title && <h1 className="serif spaced">{title}</h1>}
    </header>
  )
}

// Records from the microphone when the browser allows it; otherwise just keeps time so the demo still works.
function useRecorder() {
  const [secs, setSecs] = useState(0)
  const [on, setOn] = useState(false)
  const rec = useRef(null), chunks = useRef([]), tick = useRef(null), t0 = useRef(0)
  const start = async () => {
    if (on) return
    setOn(true); setSecs(0); t0.current = Date.now()
    tick.current = setInterval(() => setSecs((Date.now() - t0.current) / 1000), 200)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      rec.current = new MediaRecorder(stream)
      rec.current.ondataavailable = (e) => chunks.current.push(e.data)
      rec.current.start()
    } catch { rec.current = null }
  }
  const stop = () =>
    new Promise((resolve) => {
      clearInterval(tick.current); setOn(false)
      const dur = Math.max(1, Math.round((Date.now() - t0.current) / 1000))
      const r = rec.current
      if (!r || r.state === 'inactive') return resolve({ dur, audio: null })
      r.onstop = () => {
        r.stream.getTracks().forEach((t) => t.stop())
        const reader = new FileReader()
        reader.onload = () => resolve({ dur, audio: reader.result.length < 1_500_000 ? reader.result : null })
        reader.readAsDataURL(new Blob(chunks.current, { type: r.mimeType }))
      }
      r.stop()
    })
  useEffect(() => () => { clearInterval(tick.current); rec.current?.stream?.getTracks().forEach((t) => t.stop()) }, [])
  return { on, secs, start, stop }
}

export function NoteComposer({ dispatch, id, back, voiceFirst }) {
  const [text, setText] = useState('')
  const [color, setColor] = useState(NOTE_COLORS[0])
  const rec = useRecorder()
  useEffect(() => { if (voiceFirst) rec.start() }, []) // eslint-disable-line

  const pinNote = () => text.trim() && dispatch({ type: 'addPin', boardId: id, pin: drop({ type: 'note', text: text.trim(), color }) })
  const finish = async () => {
    if (rec.on) {
      const { dur, audio } = await rec.stop()
      dispatch({ type: 'addPin', boardId: id, pin: drop({ type: 'voice', dur, audio }) })
    }
    pinNote()
    back()
  }
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="bar swatches">
        <button className="round" onClick={back} aria-label="Back"><Icon name="back" size={18} /></button>
        {NOTE_COLORS.map((c) => (
          <button key={c} className={`swatch ${c === color ? 'on' : ''}`} style={{ background: c }} aria-label="Note colour" aria-pressed={c === color} onClick={() => setColor(c)} />
        ))}
      </header>
      <textarea
        className="sticky hand" style={{ background: color }} value={text} autoFocus={!voiceFirst}
        placeholder={voiceFirst ? 'Add a note to go with it...' : 'I miss you...'} maxLength={140}
        onChange={(e) => setText(e.target.value)}
      />
      {rec.on ? (
        <div className="recrow">
          <div className="recbar"><i className="recdot" /><small>{clock(rec.secs)}</small><Wave active count={17} /></div>
          <button className="stopbtn" onClick={finish} aria-label="Stop and pin"><Icon name="stop" size={18} /></button>
        </div>
      ) : (
        <div className="recrow">
          <button className="btn dark" disabled={!text.trim()} onClick={finish}>Pin to board</button>
          <button className="round big" onClick={rec.start} aria-label="Record a voice note"><Icon name="mic" size={18} /></button>
        </div>
      )}
    </div>
  )
}

const GALLERY = ['friends', 'budapest', 'drinks', 'nyc']

export function PhotoPicker({ dispatch, id, back }) {
  const [sel, setSel] = useState({ art: 'friends' })
  const [uploads, setUploads] = useState([])
  const file = useRef(null)
  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const src = await fileToDataUrl(f)
    setUploads((u) => [...u, src]); setSel({ src })
  }
  return (
    <div className="screen paper">
      <StatusBar />
      <Header back={back} title="Pick a photo" />
      <div className="preview"><div className="pin-photo large"><span className="tack" /><Art kind={sel.art} src={sel.src} /></div></div>
      <div className="pad"><button className="btn dark" onClick={() => { dispatch({ type: 'addPin', boardId: id, pin: drop({ type: 'photo', ...sel }) }); back() }}>Pin to board</button></div>
      <div className="gallery">
        {GALLERY.map((g) => (
          <button key={g} className={sel.art === g ? 'on' : ''} onClick={() => setSel({ art: g })} aria-label={`Photo: ${g}`}><Art kind={g} /></button>
        ))}
        {uploads.map((src) => (
          <button key={src.slice(-24)} className={sel.src === src ? 'on' : ''} onClick={() => setSel({ src })} aria-label="Your upload"><Art src={src} /></button>
        ))}
        <button className="upload caps" onClick={() => file.current.click()}>UPLOAD</button>
        <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
      </div>
    </div>
  )
}

export function StickerPicker({ dispatch, id, back }) {
  const [sel, setSel] = useState({ type: 'poll', q: 'miss me?', options: ['yes', 'also yes'] })
  const ask = (label, fallback) => (window.prompt(label, fallback) || '').trim()
  const extras = [
    { key: 'song', node: <><Icon name="music" size={13} /> add song</>, make: () => { const l = ask('Which song?', 'our song'); return l && { type: 'song', label: l } } },
    { key: 'link', node: <><Icon name="link" size={13} /> add link</>, make: () => { const l = ask('Paste a link', 'inyun.app'); return l && { type: 'link', label: l } } },
    { key: 'time', node: <b>{timeIn('America/New_York')}</b>, cls: 'time', make: () => ({ type: 'time', label: timeIn('America/New_York') }) },
    { key: 'place', node: <><Icon name="place" size={13} /> NEW YORK</>, cls: 'place', make: () => ({ type: 'place', label: 'NEW YORK' }) },
  ]
  return (
    <div className="screen paper">
      <StatusBar />
      <Header back={back} title="Pick a sticker" />
      <div className="preview dotted"><div className="preview-pin"><PinView pin={sel} /></div></div>
      <div className="pad"><button className="btn dark" onClick={() => { dispatch({ type: 'addPin', boardId: id, pin: drop(sel) }); back() }}>Pin to board</button></div>
      <div className="extras">
        {extras.map((x) => (
          <button key={x.key} className={`pin-chip ${x.cls || ''}`} onClick={() => { const s = x.make(); if (s) setSel(s) }}>{x.node}</button>
        ))}
        <button className="pin-chip" onClick={() => setSel({ type: 'poll', q: 'miss me?', options: ['yes', 'also yes'] })}>miss me?</button>
      </div>
      <div className="stickergrid">
        {STICKERS.map((s) => (
          <button key={s} className={`pin-sticker ${sel.emoji === s ? 'on' : ''}`} onClick={() => setSel({ type: 'sticker', emoji: s })} aria-label={`Sticker ${s}`}>{s}</button>
        ))}
      </div>
    </div>
  )
}
