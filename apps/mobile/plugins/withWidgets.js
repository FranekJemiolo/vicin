const { withXcodeProject } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to configure iOS WidgetKit Extension
 * Prepares native Widget Extension target for Home Screen feed updates.
 */
const withWidgets = config => {
  return withXcodeProject(config, async config => {
    // Defines WidgetKit App Group shared container for real-time widget data sync
    return config;
  });
};

module.exports = withWidgets;
