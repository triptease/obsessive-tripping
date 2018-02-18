import getSlackURL from './getSlackURL'

it('returns undefined when given an object without a "slack" property', () => {
  expect(getSlackURL({})).toBeUndefined()
  expect(
    getSlackURL({ displayName: 'Timmy Tester', email: 'timmy@example.com' })
  ).toBeUndefined()
})

it('returns a specifically formatted deep link to slack', () => {
  const user = {
    displayName: 'Timmy Tester',
    email: 'timmy@tester.com',
    slack: { id: 'slackId', teamId: 'slackTeamId' }
  }
  expect(getSlackURL(user)).toBe('slack://user?team=slackTeamId&id=slackId')

  const userB = {
    slack: { id: 'elena@slack', teamId: 'triptease@slack' }
  }
  expect(getSlackURL(userB)).toBe(
    'slack://user?team=triptease@slack&id=elena@slack'
  )
})
