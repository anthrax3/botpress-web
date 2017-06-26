import util from 'util'
import _ from 'lodash'
import Promise from 'bluebird'

// TODO Extract this logic directly to botpress's UMM
function getUserId(event) {
  const userId = _.get(event, 'user.id')
    || _.get(event, 'user.userId')
    || _.get(event, 'userId')
    || _.get(event, 'raw.from')
    || _.get(event, 'raw.userId')
    || _.get(event, 'raw.user.id')

  if (!userId) {
    throw new Error('Could not find userId in the incoming event.')
  }

  return userId
}

function PromisifyEvent(event) {
  if (!event._promise) {
    event._promise = new Promise((resolve, reject) => {
      event._resolve = resolve
      event._reject = reject
    })
  }

  return event
}

function processOutgoing({ event, blocName, instruction }) {
  const ins = Object.assign({}, instruction) // Create a shallow copy of the instruction

  ////////
  // PRE-PROCESSING
  ////////
  
  const optionsList = ['typing']

  const options = _.pick(instruction, optionsList)
  
  for (let prop of optionsList) {
    delete ins[prop]
  }

  /////////
  /// Processing
  /////////

  if (!_.isNil(instruction.text)) {
    const user = getUserId(event)

    return PromisifyEvent({
      platform: 'web',
      type: 'text',
      user: { id: user },
      raw: Object.assign({ to: user, message: instruction.text }, options),
      text: instruction.text
    })
  }

  ////////////
  /// POST-PROCESSING
  ////////////
  
  // Nothing to post-process yet

  ////////////
  /// INVALID INSTRUCTION
  ////////////

  const strRep = util.inspect(instruction, false, 1)
  throw new Error(`Unrecognized instruction on Web in bloc '${blocName}': ${strRep}`)
}

module.exports = bp => {
  const [umm, registerConnector] = _.at(bp, ['umm', 'umm.registerConnector'])

  umm && registerConnector && registerConnector({
    platform: 'web',
    processOutgoing: args => processOutgoing(Object.assign({}, args, { bp })),
    templates: []
  })
}
