import { ConfigPlugin, withGradleProperties } from '@expo/config-plugins';

import { PluginConfigType } from '../pluginConfig';

/**
 * Update `android/gradle.properties`
 */

const PICK_FIRST_KEY = 'android.packagingOptions.pickFirsts';

export const withAndroidGradleProperties: ConfigPlugin<PluginConfigType> = (
  config
) => {
  return withGradleProperties(config, (config) => {
    const pickFirst = config.modResults.find(
      (item: any) => item.key === PICK_FIRST_KEY
    );
    if (!pickFirst) {
      config.modResults.push({
        type: 'property',
        key: PICK_FIRST_KEY,
        value: '**/libcrypto.so',
      });
    }

    return config;
  });
};
