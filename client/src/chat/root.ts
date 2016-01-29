import { Component } from 'angular2/core';
import { ChatService } from './services/services';
import { ChatUser, ChatUserMessage, Messages } from './models/models';
import { LoginPane, ChatPane } from './components/components';

@Component({
	selector: 'ng-chat',
	templateUrl: 'chat/root.html',
	directives: [LoginPane, ChatPane ]
})
export class ChatComponent {
	chatService: ChatService;

	user: ChatUser = new ChatUser();
	systemUser: ChatUser = new ChatUser("system", "", "system");
	userlist: ChatUser[] = [];
	messages: Messages = new Messages();

	private handleList (data) {
		this.userlist = [];
		data.forEach(user => {
			this.userlist.push(new ChatUser(
				user.username,
				user.email,
				user.id
			));
		});
	}
	private handleConnect(originator, data) {
		if (!this.userlist.some(user => user.id == originator)) {
			this.messages.addMessage(this.systemUser, data.username + ' has joined!');
			this.userlist.push(new ChatUser(
				data.username,
				data.email,
				originator
			));
		}
	}
	private handleDisconnect (originator, data) {
		var idxToDelete: number = -1;
		if (this.userlist.some((user, idx) => {
			if (user.id == originator) {
				idxToDelete = idx;
				this.messages.addMessage(this.systemUser, user.username + ' has left!');
				return true;
			}
			return false;
		})) {
			this.userlist.splice(idxToDelete, 1);
		}
	}

	constructor(chatService: ChatService) {
		this.chatService = chatService;

		chatService.onOpen((e) => {
			chatService.send('list', {});
		});
		chatService.onMessage((type, originator, data) => {
			if (type == 'list') {
				this.handleList(data);
			} else if (type == 'connect') {
				this.handleConnect(originator, data);
			} else if (type == 'disconnect') {
				this.handleDisconnect(originator, data);
			}
		});

		chatService.open();
	}
}