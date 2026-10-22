import './ui/styles.css';
import { startApplication } from './application/start.ts';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Der Einstiegspunkt #app fehlt.');
startApplication(root);
