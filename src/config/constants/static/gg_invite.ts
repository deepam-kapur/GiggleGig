export default {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'GiggleGig is not present in this channel. Please invite first to play the game',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '1. In a Slack channel, click the Members icon \n2. Select the Integrations tab \n3. Click Add an App or Add apps \n4. Find the app you want to add and click Add \n5. Slack will confirm that the app has joined the channel ',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '🚀 *After inviting, ready to start your own game? Just type `/gg start` to get started!* 🚀',
        },
      ],
    },
  ],
};
