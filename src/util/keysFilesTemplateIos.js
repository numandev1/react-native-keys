module.exports.makeXcConfigFIlle = (keys) => {
  try {
    const env_keys = [];
    for (const [key, value] of Object.entries(keys)) {
      env_keys.push(`${key}=${value}`);
    }
    return env_keys.join('\n');
  } catch (_error) {
    return '';
  }
};

module.exports.makeGeneratedDotEnvTemplateIOS = (keys) => {
  try {
    const env_keys = [];
    for (const [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define DOT_ENV @{ ${dotEnv} };`;
  } catch (_error) {
    return `#define DOT_ENV @{};`;
  }
};

module.exports.makePrivateKeyTemplateIOS = (keys) => {
  try {
    const env_keys = [];
    for (const [key, value] of Object.entries(keys)) {
      env_keys.push(`@"${key}":@"${value}"`);
    }
    const dotEnv = env_keys.join();
    return `#define PRIVATE_KEY @{ ${dotEnv} };`;
  } catch (_error) {
    return `#define PRIVATE_KEY @{};`;
  }
};
