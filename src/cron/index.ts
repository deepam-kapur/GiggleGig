import cron from 'node-cron';

import { initializeApp } from '../common/initialize';
import slackService from '../service/slack.service';

let alreadyRunning = false;

// Define your task to be executed every 30 seconds
const task = async () => {
  console.log('Cron is starting - ', new Date().toISOString());

  try {
    if (alreadyRunning) {
      console.log('Cron is already running.');

      return;
    }

    alreadyRunning = true;

    await initializeApp();
    await slackService.runCron();
  } catch (e) {
    console.error(e);
  } finally {
    alreadyRunning = false;
    console.log('Cron completed - ', new Date().toISOString());
  }
};

// Schedule the task to run every 2 minutes
cron.schedule('*/2 * * * *', task);

task();

console.log('Cron job started.');
