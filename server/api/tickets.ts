const tickets = [
  {
    id: 1,
    title: 'Bijbestelling',
    vendor: {
      id: 1,
      name: 'Spooky Stuff'
    },
    messages: [
      {
        id: 222,
        type: 'message',
        author: {
          id: 2,
          name: 'Roelof',
          avatar: ''
        }
      }
    ]
  }
]

export default eventHandler(async () => {
  return tickets
})
