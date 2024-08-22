export default {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '🎲 *JudgeGig says:*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "*<@user>*, you've been granted the following unique skills for this round of GiggleGig:",
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '\n1. *@jobSkill1*\n2. *@jobSkill2*\n3. *@jobSkill3*',
      },
    },
    {
      type: 'divider',
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
        text: "Now, use these skills wisely and convince me why you'd be perfect for the job! Good luck, and may the quirkiest candidate win! 🎉",
      },
    },
  ],
};
