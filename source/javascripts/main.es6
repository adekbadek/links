import Bricks from 'bricks.js'

const instance = Bricks({
  container: '.categories-container',
  packed: 'packed',
  sizes: [
    { columns: 1, gutter: 20 },
    { mq: '940px', columns: 2, gutter: 20 }
  ]
})

setTimeout(() => {
  instance.resize(true)
  setTimeout(() => {
    instance.pack()
  }, 1)
}, 1)
