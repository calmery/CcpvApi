import Twit from 'twit'
import * as Constants from './constants'

import dummy from './dummy'

const search = (client: Twit, query: string): Promise<Twit.Twitter.SearchResults> => {
  // Dummy
  return new Promise((resolve, _) => {
    resolve(dummy as Twit.Twitter.SearchResults)
  })

  /*
  return new Promise((resolve, reject) => {
    client.get('search/tweets', {
      q: query,
      count: 10
    }, (error, data, response) => {
      if (error === undefined) {
        return resolve(data)
      }

      reject(error)
    })
  })
  */
}

export default async (accessToken: string, accessTokenSecret: string, query: string): Promise<Twit.Twitter.SearchResults> => {
  const client = new Twit({
    consumer_key: Constants.CONSUMER_KEY,
    consumer_secret: Constants.CONSUMER_SECRET,
    access_token: accessToken,
    access_token_secret: accessTokenSecret
  })

  return search(client, query)
}
