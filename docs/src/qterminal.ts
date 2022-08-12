import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { createTerminal } from 'qterminal';
import 'qterminal/themes/default.css';

if (ExecutionEnvironment.canUseDOM) {
    const term = createTerminal({});
}
