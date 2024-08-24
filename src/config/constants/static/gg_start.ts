import { SLACK_INTERACTIVE_ACTIONS } from '../common.constants';

export default {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '🎉 *<@user>* has just started a game of *GiggleGig*! 🎉',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "*What's GiggleGig hiring for?*\nThis round, GiggleGig is hiring for the role of *@JobRole*!\nYou'll need to convince JudgeGig why your randomly assigned skills make you the perfect fit for this role.",
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'In the next hour, GiggleAI will announce the results. Want to join the fun? Click *"Count Me In"* to get your random skills and play along!',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '_If you’re new to GiggleGig or want more details, just type `/gg info` to learn about the game!_',
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Count Me In...',
          },
          style: 'primary',
          value: SLACK_INTERACTIVE_ACTIONS.YES,
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Not Interested!',
          },
          style: 'danger',
          value: SLACK_INTERACTIVE_ACTIONS.NO,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '🚀 *Ready to start your own game? Just type `/gg start` to get started!* 🚀',
        },
      ],
    },
  ],
};
