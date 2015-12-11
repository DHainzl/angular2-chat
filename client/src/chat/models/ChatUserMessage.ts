import { ChatUser } from './models';

export class ChatUserMessage {
	public constructor(
		public user?: ChatUser,
		public messages?: string[]
	) { }
}