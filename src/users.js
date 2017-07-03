import sillyname from 'sillyname'

module.exports = async (bp, config) => {

  const knex = bp.db.get()

  async function getOrCreateUser(userId, throwIfNotFound = false) {
    const user = await knex('users').where({
      platform: 'web',
      userId: userId
    }).then().get(0).then()

    if (!user) {
      if (throwIfNotFound) {
        throw new Error(`User ${userId} not found`)
      }

      await createNewUser(userId)
      return getOrCreateUser(userId, true)
    }

    return user
  }

  function createNewUser(userId) {
    const [first_name, last_name] = sillyname().split(' ')
    const user = {
      first_name: first_name,
      last_name: last_name,
      profile_pic: null,
      id: userId,
      platform: 'web'
    }

    return bp.db.saveUser(user)
  }

  async function patchUserInfo(userId, fields) {
    
  }

  return { getOrCreateUser }
}
