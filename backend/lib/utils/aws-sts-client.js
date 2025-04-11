const _ = require('lodash')
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts')
const { getUuid } = require('./uuid')

const EXP_SEC = 60 * 5

const expire = () => {
  const d = new Date()
  d.setSeconds(d.getSeconds() + EXP_SEC)
  return d
}

// expirationを除外しつつ、引数オブジェクトが書き変わらないよう新しインスタンスを生成
const credent = ({ accessKeyId, secretAccessKey, sessionToken }) => ({
  accessKeyId,
  secretAccessKey,
  sessionToken
})

class AssumeRole {
  constructor({
    region,
    roleArn,
    duration,
    accessKeyId,
    secretAccessKey,
    sessionToken
  }) {
    this.config = {
      region,
      roleArn,
      accessKeyId,
      secretAccessKey,
      sessionToken
    }
    this.client = new STSClient({
      region,
      credentials: { accessKeyId, secretAccessKey, sessionToken }
    })
    this.command = {
      RoleArn: roleArn,
      RoleSessionName: getUuid(),
      DurationSeconds: duration
    }
    this.creds = null
  }

  isMatch(config) {
    return _.isMatch(config, this.config)
  }

  async assume(force = false) {
    if (!force) {
      const creds = this.creds
      const exp = creds?.expiration
      if (exp && exp > expire()) {
        return credent(creds)
      }
    }

    const { Credentials: c } = await this.client.send(
      new AssumeRoleCommand(this.command)
    )
    const creds = {
      accessKeyId: c.AccessKeyId,
      secretAccessKey: c.SecretAccessKey,
      sessionToken: c.SessionToken,
      expiration: c.Expiration
    }
    this.creds = creds

    return credent(creds)
  }
}

let instance = null

const assume = config => {
  if (!config.roleArn) {
    const creds = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      sessionToken: config.sessionToken
    }
    return () => creds
  }

  if (instance) {
    if (!instance.isMatch(config)) {
      throw new Error('異なるアクセスキーは対応していません。')
    }
  } else {
    instance = new AssumeRole(config)
  }

  return instance.assume.bind(instance)
}

module.exports = {
  instance,
  assume
}
