import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MediaService {

  search = new EventEmitter<string>();

}
