import { Component } from 'angular2/core';
import { ChatService } from '../../services/services';
import { ChatUser } from '../../models/models';

@Component({
	selector: 'login-pane',
	templateUrl: 'chat/components/LoginPane/LoginPane.html',
	directives: [],
	inputs: [ 'user', 'userlist' ]
})
export class LoginPane {
	private user: ChatUser;
	private userlist: ChatUser[];

	private loginError: string = "";
	private chatService: ChatService;

	constructor(chatService: ChatService) {
		this.chatService = chatService;

		chatService.onMessage((type, originator, data) => {
			if (type == 'connected') {
				this.user.id = originator;
			} else if (type == 'connectionError') {
				this.loginError = data.message;
			}
		});
	}

	login() {
		this.chatService.send('connect', {
			username: this.user.username,
			email: this.user.email
		});
	}
}