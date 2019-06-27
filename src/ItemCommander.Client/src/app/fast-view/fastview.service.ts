import { EventEmitter } from "@angular/core";

export class FastViewService {
    search = new EventEmitter<string>();
}