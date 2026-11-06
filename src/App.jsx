import { useState } from 'react'
import { useStore } from './store.js'
import { AllSet, INTRO_COUNT, Intro, Invite, Purpose, Setup, Splash } from './onboarding.jsx'
import { Board, Home, NewBoard, PinDetail, Settings } from './board.jsx'
import { ListComposer, NoteComposer, PollComposer, TicketComposer, PhotoPicker, StickerPicker } from './compose.jsx'
import { RecapPlayer, Recaps } from './recap.jsx'
import { Activity, Friends } from './social.jsx'

// A tiny screen stack instead of a router: go() pushes a screen, back() pops it.
export default function App() {
  const [state, dispatch] = useStore()
  const [stack, setStack] = useState(() => [state.onboarded ? { name: 'home' } : { name: 'splash' }])
  const route = stack[stack.length - 1]

  const go = (name, params = {}, replace = false) =>
    setStack((s) => {
      if (name === 'home' || name === 'splash') return [{ name }]
      if (name === 'friends' || name === 'activity') return [{ name: 'home' }, { name }] // tabs sit directly on top of Home
      return [...(replace ? s.slice(0, -1) : s), { name, ...params }]
    })
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : [{ name: 'home' }]))
  const finish = () => { dispatch({ type: 'set', patch: { onboarded: true } }); go('home') }
  const p = { state, dispatch, go, back }

  let screen
  switch (route.name) {
    case 'splash': screen = <Splash onStart={() => go('intro', { i: 0 })} onHave={finish} />; break
    case 'intro':
      screen = (
        <Intro
          index={route.i}
          onNext={() => (route.i + 1 < INTRO_COUNT ? go('intro', { i: route.i + 1 }) : go('setup'))}
          onBack={back}
          onSkip={() => go('setup')}
        />
      )
      break
    case 'setup': screen = <Setup user={state.user} dispatch={dispatch} onNext={() => go('purpose')} onBack={back} />; break
    case 'purpose': screen = <Purpose {...p} onNext={() => go('invite')} onBack={back} />; break
    case 'invite': screen = <Invite {...p} onNext={() => go('allset')} onBack={back} />; break
    case 'allset': screen = <AllSet onOpen={finish} />; break
    case 'home': screen = <Home {...p} />; break
    case 'newboard': screen = <NewBoard {...p} />; break
    case 'board': screen = <Board {...p} id={route.id} />; break
    case 'newmonth': screen = <Board {...p} id={route.id} newMonth />; break
    case 'pin': screen = <PinDetail {...p} id={route.id} pinId={route.pinId} />; break
    case 'note': screen = <NoteComposer {...p} id={route.id} />; break
    case 'voice': screen = <NoteComposer {...p} id={route.id} voiceFirst />; break
    case 'photo': screen = <PhotoPicker {...p} id={route.id} />; break
    case 'sticker': screen = <StickerPicker {...p} id={route.id} />; break
    case 'list': screen = <ListComposer {...p} id={route.id} pinId={route.pinId} />; break
    case 'ticket': screen = <TicketComposer {...p} id={route.id} pinId={route.pinId} />; break
    case 'poll': screen = <PollComposer {...p} id={route.id} pinId={route.pinId} />; break
    case 'recaps': screen = <Recaps {...p} id={route.id} />; break
    case 'recap': screen = <RecapPlayer {...p} id={route.id} month={route.month} />; break
    case 'friends': screen = <Friends {...p} />; break
    case 'activity': screen = <Activity {...p} />; break
    case 'settings': screen = <Settings {...p} />; break
    default: screen = <Home {...p} />
  }

  return (
    <div className="stage">
      <div className="phone" key={`${route.name}-${route.i ?? ''}-${route.id ?? ''}`}>{screen}</div>
    </div>
  )
}
