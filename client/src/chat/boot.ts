import { bootstrap } from 'angular2/platform/browser';
import { ChatComponent } from './root';

import { ChatService } from './services/services';


bootstrap(ChatComponent, [ChatService]);