import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import { PluginConfigType } from '../pluginConfig';
import walkSync from 'walk-sync';
import NP from 'normalize-path';
import fs from 'fs';
import { parseStringPromise, Builder } from 'xml2js';
const normalizePath = process.platform === 'win32' ? NP : (p: any) => p;
const iosXcodeproj = 'ios/*.xcodeproj/**/*.xcscheme';

const preAction = (
  BuildableReference: any[],
  IS_EXAMPLE: boolean = false,
  defaultKeyFile: string = 'keys.development.json'
) => {
  return {
    PreActions: [
      {
        ExecutionAction: [
          {
            $: {
              ActionType:
                'Xcode.IDEStandardExecutionActionsCore.ExecutionActionType.ShellScriptAction',
            },
            ActionContent: [
              {
                $: {
                  title: 'Run Script',
                  scriptText: `${
                    IS_EXAMPLE
                      ? 'exec > ${PROJECT_DIR}/prebuild.log 2>&1\nexport IS_EXAMPLE=TRUE\n'
                      : ''
                  }export DEFAULT_FILE_NAME=${defaultKeyFile}\n${
                    IS_EXAMPLE
                      ? '"${SRCROOT}/../../keysIOS.js"'
                      : '"${SRCROOT}/../node_modules/react-native-keys/keysIOS.js"'
                  }`,
                },
                EnvironmentBuildable: [
                  {
                    BuildableReference: BuildableReference,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};

export const withPreActionScript: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  return withDangerousMod(config, [
    'ios',
    async (dangerousConfig) => {
      try {
        const APP_PATH = process.cwd();
        const paths = walkSync(normalizePath(APP_PATH), {
          globs: [iosXcodeproj],
        });
        if (paths.length > 0) {
          const promises = paths.map(async (xcSchemePath) => {
            const xcSchemeContent = fs.readFileSync(xcSchemePath, {
              encoding: 'utf-8',
            });
            const xcSchemeJson = await parseStringPromise(xcSchemeContent);
            let BuildAction = xcSchemeJson.Scheme.BuildAction;
            const BuildableReference =
              BuildAction[0].BuildActionEntries[0].BuildActionEntry[0]
                .BuildableReference;

            BuildAction[0] = {
              ...BuildAction[0],
              ...preAction(
                BuildableReference,
                props?.IS_EXAMPLE,
                props?.ios?.defaultKeyFile
              ),
            };
            xcSchemeJson.Scheme.BuildAction = BuildAction;
            const builder = new Builder();
            const xcSchemeXml = builder.buildObject(xcSchemeJson);
            fs.writeFileSync(xcSchemePath, xcSchemeXml);
          });
          await Promise.all(promises);
        }
      } catch (error) {
        console.log(error, 'preactionScript <- react-native-keys');
      }

      return dangerousConfig;
    },
  ]);
};
