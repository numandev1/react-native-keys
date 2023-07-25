module.exports.makeXcConfigFIlle = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`${key}=${value}`);
    }
    return env_keys.join('\n');
  } catch (error) {
    return '';
  }
};

module.exports.makeGeneratedDotEnvTemplateIOS = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define DOT_ENV @{ ${dotEnv} };`;
  } catch (error) {
    return `#define DOT_ENV @{};`;
  }
};

module.exports.makePrivateKeyTemplateIOS = (keys) => {
  try {
    let env_keys = [];
    for (let [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define PRIVATE_KEY @{ ${dotEnv} };`;
  } catch (error) {
    return `#define PRIVATE_KEY @{};`;
  }
};
