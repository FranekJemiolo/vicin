const { withInfoPlist } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to enable iOS Live Activities (ActivityKit)
 * Sets NSSupportsLiveActivities to true in Info.plist.
 */
const withLiveActivities = config => {
  return withInfoPlist(config, config => {
    config.modResults.NSSupportsLiveActivities = true;
    config.modResults.NSSupportsLiveActivitiesFrequentUpdates = true;
    return config;
  });
};

module.exports = withLiveActivities;
