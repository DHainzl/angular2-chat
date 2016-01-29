import { Component } from 'angular2/core';
import { ChatService } from '../../services/services';
import { ChatUser, Messages } from '../../models/models';
import { MD5Pipe } from '../../pipes/pipes';

@Component({
	selector: 'chat-pane',
	templateUrl: 'chat/components/ChatPane/ChatPane.html',
	pipes: [ MD5Pipe ],
	inputs: [ 'user', 'userlist', 'messages' ],
	styleUrls: [ 'chat/components/ChatPane/ChatPane.css' ]
})
export class ChatPane {
	private user: ChatUser;
	private userlist: ChatUser[];
	private messages: Messages;
	private chatService: ChatService;

	private msg: string;

	constructor(chatService: ChatService) {
		this.chatService = chatService;

		this.chatService.onMessage((type, originator, data) => {
			if (type == 'message') {
				var user = this.userlist.find(user => user.id == originator);
				this.messages.addMessage(user, data.message);
			}
		})
	}

	sendMessage() {
		if (this.msg) {
			this.chatService.send('message', {
				message: this.msg
			});
			this.msg = null;
		}
	}
}