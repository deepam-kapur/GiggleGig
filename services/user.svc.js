import Moment from 'moment';

import User from '../db/models/user.models.js';
import InstagramUtils from '../utils/instagram.utils.js';

import { USER_FETCH_AGAIN } from '../config/constants/user.constants.js';

const fetchExternalUser = async (externalId) => {
  const profile = await InstagramUtils.fetchProfile(externalId);
  const user = {
    name: profile.name,
    username: profile.username,
    profile_pic: profile.profile_pic,
    follower_count: profile.follower_count,
    is_verified_user: profile.is_verified_user ? 1 : 0,
    is_user_follow_business: profile.is_user_follow_business,
    last_fetched_at: Date.now(),
  };

  const newUser = await User.upsert(user);
  user.id = newUser.id;

  return user;
};

const fetchEligibleUser = async (user) => {
  const { external_id: externalId, last_fetched_at: lastFetchedAt } = user;
  if (Moment().diff(Moment(lastFetchedAt), 'days') < USER_FETCH_AGAIN.days) {
    return user;
  }

  return fetchExternalUser(externalId);
};

const processUser = async (externalId) => {
  const user = await User.findOne({
    attributes: ['id', 'external_id', 'last_fetched_at'],
    where: {
      external_id: externalId,
    },
  });

  if (user) {
    return fetchEligibleUser(user);
  }

  return fetchExternalUser(user);
};

export default {
  processUser,
};
