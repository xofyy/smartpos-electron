export const IPC_CHANNELS = {
  PRODUCTS: {
    GET_ALL: 'products:getAll',
    ADD: 'products:add',
    UPDATE: 'products:update',
    DELETE: 'products:delete',
    GET_BY_BARCODE: 'products:getByBarcode',
  },
  SALES: {
    PROCESS: 'sales:process',
  },
  REPORTS: {
    GET_DAILY_SALES: 'reports:getDailySales',
    GET_TOP_PRODUCTS: 'reports:getTopProducts',
    GET_SUMMARY_STATS: 'reports:getSummaryStats',
    EXPORT: 'reports:export',
  },
  SETTINGS: {
    GET_ALL: 'settings:getAll',
    SET: 'settings:set',
  },
  SYSTEM: {
    CHECK_FOR_UPDATES: 'system:checkForUpdates',
    START_DOWNLOAD: 'system:startDownload',
    INSTALL_UPDATE: 'system:installUpdate',
    GET_VERSION: 'system:getVersion',
    FACTORY_RESET: 'system:factoryReset',
    BACKUP: 'system:backup',
    CONFIRM: 'system:confirm',
    ON_UPDATE_STATUS: 'update-status',
    ON_UPDATE_PROGRESS: 'update-progress',
  },
  HARDWARE: {
    LIST_PORTS: 'hardware:listPorts',
  },
  WINDOW: {
    MINIMIZE: 'window-minimize',
    MAXIMIZE: 'window-maximize',
    CLOSE: 'window-close',
  },
} as const
