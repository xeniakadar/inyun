// Find friends and Activity (notifications): the two tabs either side of the + button.
import { useEffect, useState } from 'react'
import { PEOPLE, friend, timeIn } from './store.js'
import { Avatar, Icon, StatusBar, Toast } from './ui.jsx'
import { BottomNav } from './board.jsx'

function PersonRow({ id, action }) {
  const f = friend(id)
  return (
    <div className="person flat">
      <Avatar who={id} size={40} />
      <div><b>{f.name}</b><small>@{f.username} · {f.place} · {timeIn(f.tz)}</small></div>
      {action}
    </div>
  )
}

export function Friends({ state, dispatch, go }) {
  const [q, setQ] = useState('')
  const [toast, setToast] = useState('')
  const { friends, requests, sent } = state
  const isFriend = (id) => friends.includes(id)
  const suggested = PEOPLE.filter((p) => !isFriend(p.id) && !requests.includes(p.id)).map((p) => p.id)

  const accept = (id) => dispatch({ type: 'acceptRequest', id })
  const actionFor = (id) => {
    if (isFriend(id)) return <span className="pill ghost"><Icon name="check" size={13} stroke={2} /> Friends</span>
    if (requests.includes(id)) return (
      <span className="rowactions">
        <button className="pill on" onClick={() => accept(id)}>Accept</button>
        <button className="pill" onClick={() => dispatch({ type: 'declineRequest', id })} aria-label={`Decline ${friend(id).name}`}><Icon name="x" size={13} stroke={2} /></button>
      </span>
    )
    if (sent.includes(id)) return <button className="pill ghost" onClick={() => dispatch({ type: 'cancelRequest', id })}>Requested</button>
    return <button className="pill" onClick={() => dispatch({ type: 'sendRequest', id })}>Add</button>
  }
  const invite = async () => {
    try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}?invite=${state.user.username || 'me'}`) } catch {}
    setToast('Invite link copied'); setTimeout(() => setToast(''), 2200)
  }

  const term = q.trim().toLowerCase().replace(/^@/, '')
  const results = term ? PEOPLE.filter((p) => p.name.toLowerCase().includes(term) || p.username.includes(term)).map((p) => p.id) : null
  const section = (title, ids) => ids.length > 0 && (
    <section>
      <span className="caps">{title}</span>
      {ids.map((id) => <PersonRow key={id} id={id} action={actionFor(id)} />)}
    </section>
  )
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="home-head"><span className="spacer" /><h1 className="scrawl">Friends</h1><span className="spacer" /></header>
      <div className="pad scroll grow social">
        <label className="search">
          <Icon name="search" size={16} />
          <input value={q} placeholder="Search by name or @username" aria-label="Search by name or username" autoCapitalize="none" autoCorrect="off" onChange={(e) => setQ(e.target.value)} />
        </label>
        {results ? (
          results.length ? section('RESULTS', results) : <p className="muted empty">No one called "{q.trim()}" is on Inyun yet.</p>
        ) : (
          <>
            {section('WANTS TO PIN WITH YOU', requests)}
            {section('YOUR PEOPLE', friends)}
            {section('PEOPLE YOU MAY KNOW', suggested)}
          </>
        )}
        <button className="person pick dashed" onClick={invite}><Icon name="plus" size={18} /><b>Invite someone you miss</b></button>
      </div>
      <BottomNav state={state} go={go} current="friends" plusLabel="New board" onPlus={() => go('newboard')} />
      <Toast text={toast} />
    </div>
  )
}

export function Activity({ state, dispatch, go }) {
  // Remember what was unread when the screen opened, so it stays highlighted while you look at it.
  const [fresh] = useState(() => state.notifs.filter((n) => !n.read).map((n) => n.id))
  useEffect(() => { dispatch({ type: 'readNotifs' }) }, []) // eslint-disable-line
  const open = (n) => {
    if (n.recap) go('recaps', { id: n.boardId })
    else if (n.boardId && state.boards.some((b) => b.id === n.boardId)) go('board', { id: n.boardId })
    else if (n.who) go('friends')
  }
  const empty = !state.requests.length && !state.notifs.length
  return (
    <div className="screen paper">
      <StatusBar />
      <header className="home-head"><span className="spacer" /><h1 className="scrawl">Activity</h1><span className="spacer" /></header>
      <div className="pad scroll grow social">
        {empty && <p className="muted empty">Nothing yet. When someone pins something for you, it shows up here.</p>}
        {state.requests.map((id) => (
          <div className="notif fresh" key={id}>
            <Avatar who={id} size={40} />
            <div>
              <p><b>{friend(id).name}</b> wants to pin with you</p>
              <small>@{friend(id).username} · {friend(id).place}</small>
              <span className="rowactions">
                <button className="pill on" onClick={() => dispatch({ type: 'acceptRequest', id })}>Accept</button>
                <button className="pill" onClick={() => dispatch({ type: 'declineRequest', id })}>Decline</button>
              </span>
            </div>
          </div>
        ))}
        {state.notifs.map((n) => (
          <button className={`notif ${fresh.includes(n.id) ? 'fresh' : ''}`} key={n.id} onClick={() => open(n)}>
            {n.who ? <Avatar who={n.who} size={40} /> : <span className="fab small"><Icon name="play" size={14} /></span>}
            <div>
              <p>{n.who && <b>{friend(n.who).name} </b>}{n.text}</p>
              <small>{n.when}</small>
            </div>
            {fresh.includes(n.id) && <i className="dot" aria-label="New" />}
          </button>
        ))}
      </div>
      <BottomNav state={state} go={go} current="activity" plusLabel="New board" onPlus={() => go('newboard')} />
    </div>
  )
}
