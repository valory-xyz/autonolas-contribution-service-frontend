export const emptyCentaur = {
  id: '',
  name: '',
  purpose: '',
  memory: [],
  actions: [],
  members: [],
  messages: [],
  configuration: {
    plugins: {
      daily_tweet: {
        daily: true,
        enabled: false,
        last_run: null,
        run_hour_utc: 12,
      },
      scheduled_tweet: {
        daily: false,
        enabled: true,
      },
      daily_orbis: {
        daily: true,
        enabled: false,
        last_run: null,
        run_hour_utc: 12,
      },
    },
    memberWhitelist: [],
  },
  plugins_data: {
    daily_orbis: {},
    daily_tweet: {},
    scheduled_tweet: {
      tweets: [],
    },
  },
};
