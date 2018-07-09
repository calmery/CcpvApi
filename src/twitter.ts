import Twit from 'twit'
import * as Constants from './constants'

const search = (client: Twit, query: string): Promise<Twit.Twitter.SearchResults> => {
  return new Promise((resolve, reject) => {
    client.get('search/tweets', {
      q: `${query} -RT`,
      count: 10
    }, (error, data, response) => {
      if (error) {
        return reject(error)
      }

      return resolve(data as Twit.Twitter.SearchResults)
    })
  })
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
