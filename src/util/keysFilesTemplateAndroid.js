export const makeCryptographicModuleTemplateAndroid = (key) => {
  return `
package com.reactnativekeysjsi

object PrivateKey {
    const val privatekey = "${key}"
}`;
};
