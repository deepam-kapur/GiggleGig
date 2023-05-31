/* eslint-disable linebreak-style */
const standard = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [{
        title: 'Hi, Stranger! Good to see you on mixor.',
        subtitle: 'Please choose one of the below or click ☰ on top-right to see menu',
        image_url: 'https://github.com/fbsamples/original-coast-clothing/blob/main/public/looks/male-work.jpg',
        // default_action: {
        //   type: 'web_url',
        //   url: 'https://www.originalcoastclothing.com',
        // },
        buttons: [
          {
            type: 'postback',
            title: 'Join Waitlist',
            payload: 'join_waitlist',
          },
          {
            type: 'postback',
            title: 'Know more about Mixor',
            payload: 'mixor',
          },
          {
            type: 'postback',
            title: 'Terms & Guidelines',
            payload: 'terms',
          },
        ],
      }],
    },
  },
};

const mixor = {
  text: `Have you ever wanted to connect with someone on Instagram without revealing your identity? With Mixor, your wish becomes a reality. Mixor is an innovative Instagram bot designed to facilitate anonymous conversations between two strangers. Whether you're seeking a new friend, looking for advice, or simply want to engage in a casual conversation, Mixor is here to help.\n
        \nHow Does Mixor Work?
        \nMixor acts as a middleman between two individuals who wish to engage in an anonymous chat on Instagram. It creates a secure and confidential environment, ensuring that both participants can communicate freely without any fear of revealing their true identities. Mixor's primary goal is to foster genuine connections, encourage open conversations, and promote empathy and understanding.
        \n\nTo use Mixor you can click ☰ on top-right to join a stranger.`,
};

const terms = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [{
        title: 'Terms & Guidelines',
        subtitle: 'We recommend you to go through all our guidelines. Before using mixor.',
        image_url: 'https://mixor.club/terms.png',
      }],
    },
  },
};

export default {
  standard,
  mixor,
  terms,
};
