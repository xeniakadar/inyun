// App data + persistence. Everything lives in localStorage so the demo survives a refresh.
import { useEffect, useReducer } from 'react'

const KEY = 'inyun-v1'

// The demo is frozen on the last day of the month so "Skip to Dec 1" and the recap make sense.
export const MONTH = 'NOV'
export const MONTH_NAME = 'November'
export const NEXT_MONTH = 'DEC'
export const TODAY = 30

export const FRIENDS = [
  { id: 'alex', name: 'Alex', color: '#2f5d62', place: 'Budapest', tz: 'Europe/Budapest', offset: '6 hours ahead', km: 7000 },
  { id: 'josh', name: 'Josh', color: '#4169d8', place: 'Brooklyn', tz: 'America/New_York', offset: 'same time', km: 0 },
  { id: 'priya', name: 'Priya', color: '#d9ccf5', light: true, place: 'Lisbon', tz: 'Europe/Lisbon', offset: '5 hours ahead', km: 5400 },
  { id: 'sam', name: 'Sam', color: '#f3cdb4', light: true, place: 'London', tz: 'Europe/London', offset: '5 hours ahead', km: 5600 },
]
export const friend = (id) => FRIENDS.find((f) => f.id === id)

// What a list pin shows until someone writes their own.
export const LIST_DEFAULT = {
  title: 'To try when I visit',
  items: ['Pizza, that one', 'Danube, night', 'Your good cafe', 'Flowers (again)'],
  total: '1 visit',
  footer: 'Soon, please',
}

export const TICKET_COLORS = ['#3f66d6', '#6f2f35', '#4f6b58', '#dcbb52', '#b9a2ad', '#1f2128']
export const NOTE_COLORS = ['#fdf8c9', '#f6d9c4', '#d9ead9', '#d6e3fb', '#e2d9f7']

let n = 0
export const uid = () => `${Date.now().toString(36)}${(n++).toString(36)}`

const novemberPins = () => [
  { id: 'p1', type: 'lined', title: 'Thank you.', text: 'i am so lucky you pick up at 3am. every time.', x: 12, y: 62, rot: -2, day: 3, by: 'alex' },
  { id: 'p2', type: 'ticket', from: 'NYC', to: 'BUD', date: '2026-12-19', dep: '18:40', arr: '08:55', seat: '14A', color: TICKET_COLORS[0], x: 14, y: 232, rot: -3, day: 3, by: 'me' },
  {
    id: 'p3', type: 'photo', art: 'budapest', x: 122, y: 34, rot: 3, day: 8, by: 'alex',
    comments: [{ by: 'alex', text: 'remember that night walk along the danube? i miss u', meta: 'ALEX · BUDAPEST · 2:14 AM' }],
  },
  { id: 'p4', type: 'voice', dur: 13, x: 108, y: 178, rot: 3, day: 8, by: 'alex' },
  { id: 'p5', type: 'note', text: 'I miss you...', color: NOTE_COLORS[0], x: 128, y: 226, rot: -3, day: 13, by: 'me' },
  { id: 'p6', type: 'photo', art: 'drinks', x: 252, y: 54, rot: -3, day: 18, by: 'me' },
  { id: 'p7', type: 'photo', art: 'friends', x: 262, y: 176, rot: 4, day: 18, by: 'alex' },
  { id: 'p8', type: 'strip', x: 384, y: 30, rot: 2, day: 24, by: 'me' },
  { id: 'p9', type: 'license', x: 382, y: 232, rot: -2, day: 24, by: 'alex' },
  { id: 'p10', type: 'poll', q: 'miss me?', options: ['yes', 'also yes'], x: 452, y: 40, rot: 3, day: 26, by: 'alex' },
  { id: 'p11', type: 'receipt', x: 470, y: 130, rot: 1, day: 28, by: 'me' },
  { id: 'p12', type: 'place', label: 'BUDAPEST', x: 596, y: 130, rot: -2, day: 30, by: 'alex' },
  { id: 'p13', type: 'sticker', name: 'heart', x: 610, y: 180, rot: 8, day: 30, by: 'me' },
  { id: 'p15', type: 'photo', art: 'nyc', x: 596, y: 4, rot: -2, day: 29, by: 'me',
    comments: [{ by: 'me', text: 'the sky did this tonight. wish you saw it', meta: 'NEW YORK · 5:02 PM' }] },
  { id: 'p14', type: 'sticker', name: 'asterisk', x: 650, y: 240, rot: 0, day: 30, by: 'alex' },
]

const octoberPins = () => [
  { id: 'o1', type: 'note', text: 'landed. it is so cold here', color: NOTE_COLORS[3], x: 20, y: 60, rot: -2, day: 2, by: 'alex' },
  { id: 'o2', type: 'photo', art: 'nyc', x: 150, y: 50, rot: 3, day: 6, by: 'me' },
  { id: 'o3', type: 'voice', dur: 21, x: 40, y: 190, rot: -2, day: 11, by: 'me' },
  { id: 'o4', type: 'sticker', name: 'moon', x: 250, y: 200, rot: 0, day: 15, by: 'alex' },
  { id: 'o5', type: 'note', text: 'first week at the new job. did not cry', color: NOTE_COLORS[4], x: 260, y: 60, rot: 2, day: 21, by: 'me' },
  { id: 'o6', type: 'photo', art: 'budapest', x: 160, y: 190, rot: -3, day: 27, by: 'alex' },
]

export function seed() {
  return {
    onboarded: false,
    user: { name: '', email: '', photo: null },
    purposes: ['Long distance besties'],
    invited: ['alex'],
    boards: [
      {
        id: 'solo', members: [], hue: 'pink',
        pins: [
          { id: 's1', type: 'photo', art: 'nyc', x: 150, y: 30, rot: 3, day: 5, by: 'me' },
          { id: 's2', type: 'note', text: 'first week at the new job. did not cry', color: NOTE_COLORS[4], x: 26, y: 150, rot: -2, day: 5, by: 'me' },
          { id: 's3', type: 'sticker', name: 'asterisk', x: 150, y: 190, rot: 0, day: 5, by: 'me' },
          { id: 's4', type: 'license', x: 96, y: 262, rot: 2, day: 5, by: 'me' },
        ],
      },
      { id: 'alex', members: ['alex'], hue: 'peach', pins: novemberPins(), archive: { OCT: octoberPins() } },
      {
        id: 'group', members: ['josh', 'priya', 'sam'], hue: 'lilac',
        pins: [
          { id: 'g1', type: 'photo', art: 'drinks', x: 150, y: 26, rot: 2, day: 5, by: 'priya' },
          { id: 'g2', type: 'note', text: 'this place. next time. your treat.', color: NOTE_COLORS[3], x: 28, y: 160, rot: -2, day: 5, by: 'josh' },
          { id: 'g3', type: 'voice', dur: 13, x: 16, y: 280, rot: 0, day: 5, by: 'sam' },
          { id: 'g4', type: 'receipt', x: 162, y: 190, rot: 2, day: 5, by: 'me' },
          { id: 'g5', type: 'poll', q: 'where do we meet up?', options: ['Lisbon', 'NYC'], x: 120, y: 344, rot: 0, day: 5, by: 'me' },
          { id: 'g6', type: 'strip', x: 300, y: 90, rot: 2, day: 5, by: 'me' },
        ],
      },
    ],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed()
}

const mapBoard = (state, id, fn) => ({ ...state, boards: state.boards.map((b) => (b.id === id ? fn(b) : b)) })
const mapPin = (state, boardId, pinId, fn) =>
  mapBoard(state, boardId, (b) => ({ ...b, pins: b.pins.map((p) => (p.id === pinId ? fn(p) : p)) }))

function reducer(state, a) {
  switch (a.type) {
    case 'user': return { ...state, user: { ...state.user, ...a.patch } }
    case 'set': return { ...state, ...a.patch }
    case 'addBoard': return { ...state, boards: [...state.boards, a.board] }
    case 'addPin': return { ...mapBoard(state, a.boardId, (b) => ({ ...b, pins: [...b.pins, a.pin] })), dragHint: state.dragHint || 'show' }
    case 'movePin': return mapPin(state, a.boardId, a.pinId, (p) => ({ ...p, x: a.x, y: a.y }))
    case 'updatePin': return mapPin(state, a.boardId, a.pinId, (p) => ({ ...p, ...a.patch }))
    case 'removePin': return mapBoard(state, a.boardId, (b) => ({ ...b, pins: b.pins.filter((p) => p.id !== a.pinId) }))
    case 'comment': return mapPin(state, a.boardId, a.pinId, (p) => ({ ...p, comments: [...(p.comments || []), a.comment] }))
    case 'vote': return mapPin(state, a.boardId, a.pinId, (p) => ({ ...p, vote: a.option }))
    case 'reset': return seed()
    default: return state
  }
}

export function useStore() {
  const [state, dispatch] = useReducer(reducer, null, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  }, [state])
  return [state, dispatch]
}

export function boardTitle(board, user) {
  const me = user.name || 'You'
  const names = [me, ...board.members.map((m) => friend(m).name)]
  if (names.length === 1) return names[0]
  if (names.length === 2) return names.join(' & ')
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

export const timeIn = (tz) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date())

// Shrink uploads so they fit in localStorage.
export function fileToDataUrl(file, max = 900) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * s)
      c.height = Math.round(img.height * s)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = url
  })
}
