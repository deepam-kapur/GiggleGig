export default {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '🏁 *GiggleGig has ended!* 🏁',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'It looks like everyone missed their chance to join this round. 😅 No worries, though—there’s always another opportunity!\nLet’s get creative and have some fun in the next round! 🚀',
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
          text: '🎉 *Ready to give it a go?* Type `/gg` to start a new game and see if you can top the leaderboard this time. Don’t miss out!',
        },
      ],
    },
  ],
};
