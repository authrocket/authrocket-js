h = require('./helper')


suiteTeardown('cleanup stale realms', async ()=>{
  await h.deleteStaleRealms()
})
