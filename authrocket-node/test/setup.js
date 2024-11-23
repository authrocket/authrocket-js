import h from './helper.js'


suiteTeardown('cleanup stale realms', async ()=>{
  await h.deleteStaleRealms()
})
