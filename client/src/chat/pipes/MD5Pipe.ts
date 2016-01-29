/// <reference path="../../../typings/md5" />

import { Pipe } from 'angular2/core';

@Pipe({
	name: 'md5'
})
export class MD5Pipe {
	transform(value: string, args: string[]) : string {
		return md5(value);
	}
}