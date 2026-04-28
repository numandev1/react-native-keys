import { type ConfigPlugin, withAppBuildGradle } from '@expo/config-plugins';

import type { PluginConfigType } from '../pluginConfig';

/**
 * Update `<project>/build.gradle`
 */

function applyImplementation(
  appBuildGradle: string,
  defaultKeyFile: string = 'keys.development.json',
  IS_EXAMPLE: string,
) {
  const RnkeysImplementation = `
project.ext.IS_EXAMPLE = ${IS_EXAMPLE};
project.ext.DEFAULT_FILE_NAME = "${defaultKeyFile}"
apply from: project(':react-native-keys').projectDir.getPath() + "/RNKeys.gradle"
  `;
  if (!appBuildGradle.includes('project.ext.DEFAULT_FILE_NAME')) {
    const enableMinifyInReleaseBuildsLine = appBuildGradle.match(
      /def enableMinifyInReleaseBuilds.+/,
    )?.[0];
    if (
      enableMinifyInReleaseBuildsLine &&
      appBuildGradle.includes(enableMinifyInReleaseBuildsLine)
    ) {
      return appBuildGradle.replace(
        enableMinifyInReleaseBuildsLine,
        `${enableMinifyInReleaseBuildsLine}\n${RnkeysImplementation}`,
      );
    }
  } else {
    const regex = /(project\.ext\.DEFAULT_FILE_NAME\s*=\s*").*?"/;
    const projectExtKeyFilesLine = appBuildGradle.match(regex)?.[0];
    if (projectExtKeyFilesLine) {
      return appBuildGradle.replace(regex, `$1${defaultKeyFile}"`);
    }
  }
  return appBuildGradle;
}
export const withAndroidBuildscriptDependency: ConfigPlugin<
  PluginConfigType
> = (config, props) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = applyImplementation(
      config.modResults.contents,
      props?.android?.defaultKeyFile,
      props?.IS_EXAMPLE ? 'true' : 'false',
    );
    return config;
  });
};
