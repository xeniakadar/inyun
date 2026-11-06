Photos the app uses. Replace a file with another of the same name to swap it.

  me.jpg                    your face: avatar, photo strip, licence, recap walker
  me2.jpg, me3.jpg          friends' profile pictures (Xenia, Ella; set with `photo:` in src/store.js)
  budapest.jpg, budapest2.jpg, nyc.jpg
  friends.jpg, friends2.jpg, friends3.jpg
  drinks.jpg, sushi.jpg, flowers.jpg
  fun.jpg, fun1.jpg, fun2.jpg, cat.jpg, dog.jpg

To add a new photo, save it here as a .jpg and use its name (without .jpg) as
`art: 'name'` on a pin in src/store.js, or add it to GALLERY in src/compose.jsx.
Keep them around 1000px on the long side so the app loads fast on a phone.
