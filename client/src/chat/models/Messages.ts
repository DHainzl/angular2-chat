import { ChatUser, ChatUserMessage } from './models';

export class Messages {
	private messages: ChatUserMessage[] = [];

	public addMessage(user: ChatUser, message: string) {
		var lastMsg = this.messages[this.messages.length - 1];
		if (lastMsg && lastMsg.user.id == user.id) {
			lastMsg.messages.push(message);
		} else {
			this.messages.push(new ChatUserMessage(user, [ message ]));
		}
	}
	public getMessages () : ChatUserMessage[] {
		return this.messages;
	}
}