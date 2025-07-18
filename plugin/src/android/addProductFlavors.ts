import { type ConfigPlugin, withAppBuildGradle } from '@expo/config-plugins';

import type { PluginConfigType } from '../pluginConfig';

function convertToGradleProductFlavors(productFlavors: any) {
  let result = 'flavorDimensions "default"\nproductFlavors {\n';

  for (const flavor in productFlavors) {
    if (Object.hasOwn(productFlavors, flavor)) {
      const applicationIdSuffix = productFlavors[flavor].applicationIdSuffix;
      result += `  ${flavor} {\n    applicationIdSuffix "${applicationIdSuffix}"\n  }\n`;
    }
  }

  result += '}';

  return result;
}

function applyImplementation(appBuildGradle: string, productFlavors: string) {
  const productFlavorsRegex =
    /flavorDimensions.+\n+productFlavors\s*\{(?:[^{}]*|(?:(?:[^{}]*\{[^{}]*\})*[^{}]*))*\}\n/;
  appBuildGradle = appBuildGradle.replace(productFlavorsRegex, '');
  // Make sure the project does not have the dependency already
  const signingConfigs = appBuildGradle.match(
    /signingConfigs\s*\{(?:[^{}]*|(?:(?:[^{}]*\{[^{}]*\})*[^{}]*))*\}/,
  )?.[0];
  if (signingConfigs && appBuildGradle.includes(signingConfigs)) {
    return appBuildGradle.replace(
      signingConfigs,
      `${signingConfigs}\n${productFlavors}`,
    );
  }
  return appBuildGradle;
}
export const withAddProductFlavours: ConfigPlugin<PluginConfigType> = (
  config,
  props,
) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = applyImplementation(
      config.modResults.contents,
      //@ts-ignore
      convertToGradleProductFlavors(props.android.productFlavors),
    );
    return config;
  });
};
