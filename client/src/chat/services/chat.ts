/// <reference path="../../../typings/sockjs/sockjs" />

export class ChatService {
	URL: string = 'http://127.0.0.1:9999/echo';
	sock: SockJS;
	handlers = {};

	private _opened: boolean = false;

	public open(): void {
		if (!this._opened) {
			this.sock = new SockJS(this.URL);
			this.sock.onopen = (e) => {
				this.callHandlers('open', e);
			}
			this.sock.onmessage = (e) => {
				this.messageReceived(e);
			}
			this.sock.onclose = (e) => {
				this.callHandlers('close', e);
			}
			this._opened = true;
		}
	}

	public isOpen(): boolean {
		return this._opened;
	}

	public close(): void {
		if (this._opened) {
			this.sock.close();
			delete this.sock;
			this._opened = false;
		}
	}

	private messageReceived (e: SJSMessageEvent) {
		var msg = JSON.parse(e.data);
		this.callHandlers('message', msg.type, msg.originator, msg.data);
	}

	private callHandlers (type: string, ...params: any[]) {
		if (this.handlers[type]) {
			this.handlers[type].forEach(function(cb) {
				cb.apply(cb, params);
			});
		}
	}

	private addEvent (type: string, callback: Function) : void {
		if (!this.handlers[type]) this.handlers[type] = [];
		this.handlers[type].push(callback);
	}

	public onOpen (callback: (e: SJSOpenEvent) => any) : void {
		this.addEvent('open', callback);
	}
	public onMessage (callback: (type: string, originator: string, data: any) => any) : void {
		this.addEvent('message', callback);
	}
	public onClose (callback: (e: SJSCloseEvent) => any) : void {
		this.addEvent('close', callback);
	}

	public send (type: string, data: any) {
		if (this._opened) {
			var msg = JSON.stringify({
				type: type,
				data: data
			});

			this.sock.send(msg);
		}
	}
}
