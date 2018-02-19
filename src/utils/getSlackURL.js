function getSlackURL({ slack }) {
  return slack && `slack://user?team=${slack.teamId}&id=${slack.id}`
}

export default getSlackURL
