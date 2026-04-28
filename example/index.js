import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);

if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
