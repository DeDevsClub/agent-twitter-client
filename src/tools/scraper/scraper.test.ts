import { getScraper } from '../../utils';
import { Scraper } from './scraper';

test('scraper can fetch home timeline', async () => {
  const scraper = await getScraper();

  const count = 20;
  const seenTweetIds: string[] = [];

  const homeTimeline = await scraper.fetchHomeTimeline(count, seenTweetIds);
  // console.log(homeTimeline);
  expect(homeTimeline).toBeDefined();
  expect(homeTimeline?.length).toBeGreaterThan(0);
  expect(homeTimeline[0]?.rest_id).toBeDefined();
}, 60_000); // 60 seconds

test('scraper can fetch following timeline', async () => {
  const scraper = await getScraper();

  const count = 20;
  const seenTweetIds: string[] = [];

  const homeTimeline = await scraper.fetchFollowingTimeline(
    count,
    seenTweetIds,
  );
  // console.log(homeTimeline);
  expect(homeTimeline).toBeDefined();
  expect(homeTimeline?.length).toBeGreaterThan(0);
  expect(homeTimeline[0]?.rest_id).toBeDefined();
}, 60_000); // 60 seconds

test('scraper uses response transform when provided', async () => {
  const scraper = new Scraper({
    transform: {
      response: (response) =>
        new Proxy(response, {
          get(target, p, receiver) {
            if (p === 'status') {
              return 400;
            }

            if (p === 'ok') {
              return false;
            }

            return Reflect.get(target, p, receiver);
          },
        }),
    },
  });

  await expect(scraper.getLatestTweet('twitter')).rejects.toThrow();
});
