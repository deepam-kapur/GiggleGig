import NodeCache from 'node-cache';
import Pages from '../db/models/pages.models.js';

const nodeCache = new NodeCache({ stdTTL: 3600 }); // Set the TTL to 60 minutes

const PAGES_CACHED_KEY = 'pages';

const cachePagesTable = async () => {
  const pages = await Pages.findAll({ attributes: ['id', 'external_page_id', 'username', 'display_name'] });
  pages.forEach((page) => page.external_page_id && nodeCache.set(`${PAGES_CACHED_KEY}:${page.external_page_id}`, page));
  nodeCache.set(PAGES_CACHED_KEY, true, 3300); // 55 minutes - So we don't miss any event
};

const getPage = async (externalPageId) => {
  if (!nodeCache.get(PAGES_CACHED_KEY)) {
    await cachePagesTable();
  }

  return nodeCache.get(`${PAGES_CACHED_KEY}:${externalPageId}`);
};

export default {
  getPage,
};
