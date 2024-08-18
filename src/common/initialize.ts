import { AppDataSource } from '../database/connection/data-source';

export const initializeApp = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
