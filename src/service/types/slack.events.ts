import type { Channels } from '../../database/entity/Channels';
import type { ChannelUsers } from '../../database/entity/ChannelUsers';
import type { Teams } from '../../database/entity/Teams';
import type { Users } from '../../database/entity/Users';

export type AuthorizeUserDataRequest = {
  slack_user_id: string;
  slack_team_id: string;
  slack_enterprise_id: string;
  slack_channel_id: string;
  slack_channel_name: string;
};

export type AuthorizeUserDataResponse = {
  user: Users;
  team: Teams;
  channel: Channels;
  channelUser: ChannelUsers;
};
