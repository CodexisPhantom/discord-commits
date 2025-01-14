const { MessageEmbed, WebhookClient } = require('discord.js')
const MAX_MESSAGE_LENGTH = 72

module.exports.send = (id, token, username, commits, size) => new Promise((resolve, reject) => {
  let client

  console.log('Preparing Webhook...')

  try {
    client = new WebhookClient({
      id: id,
      token: token,
    })
    client
      .send({
        username: username,
        embeds: [createEmbed(commits, size)],
      })
      .then(() => {
        console.log('Successfully sent the message!')
        resolve()
      }, reject)
  } catch (error) {
    console.log('Error creating Webhook')
    reject(error.message)
    return
  }
})

function createEmbed(commits, size) {
  console.log('Constructing Embed...')
  console.log('Commits :')
  console.log(commits)
  if (!commits) {
    console.log('No commits, skipping...')
    return
  }
  const latest = commits[0]
  return new MessageEmbed()
    .setColor(0xf1e542)
    .setAuthor({
      name: `⚡ pushed ${size} commit${
        size === 1 ? '' : 's'
      }`,
      iconURL: `https://github.com/CodexisPhantom.png?size=64`,
    })
    .setDescription(`${getChangeLog(commits, size)}`)
    .setTimestamp(Date.parse(latest.timestamp))
}

function getChangeLog(commits, size) {
  let changelog = ''
  for (const i in commits) {
    if (i > 7) {
      changelog += `+ ${size - i} more...\n`
      break
    }

    const commit = commits[i]
    const sha = commit.id.substring(0, 6)
    const message =
      commit.message.length > MAX_MESSAGE_LENGTH
        ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + '...'
        : commit.message
    changelog += `[\`${sha}\`](${commit.url}) — ${message} ([\`${commit.author.username}\`](https://github.com/${commit.author.username}))\n`
  }

  return changelog
}
