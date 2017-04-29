import { Component } from '@angular/core';
import * as socketIo from 'socket.io-client';
// import { pug_plugin_ng } from 'pug-plugin-ng';
// import { pug } from 'pug';

// let pug_opts = { doctype: 'html', plugins: [pug_plugin_ng] };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  socket;
  constructor(){
    this.socket = socketIo.connect("localhost"); 
  }
  ngOnInit() {
  }
}
