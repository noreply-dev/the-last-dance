exports._200 = (res, msg, data = null) => {
  let message = 'Ok'

  if (msg) message += '. ' + msg

  res.status(200)
  return res.json({
    status: '200',
    msg: message,
    data: data
  })
}

exports._400 = (res, msg) => {
  let message = 'Bad request'

  if (msg) message += '. ' + msg

  res.status(400)
  return res.json({
    status: '400',
    msg: message
  })
}

exports._500 = (res, msg) => {
  let message = 'Internal server error'

  if (msg) message += '. ' + msg

  res.status(500)
  return res.json({
    status: '500',
    msg: message
  })
} 