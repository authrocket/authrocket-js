import ar from '../../authrocket-node/test/helper.js'

suiteTeardown('cleanup stale realms', async ()=>{
  await ar.deleteStaleRealms()
})
