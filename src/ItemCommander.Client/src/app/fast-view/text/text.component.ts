import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})

export class TextComponent implements OnInit {
  @Input()
  context: any;

  constructor() { }

  ngOnInit() {
  }

}
