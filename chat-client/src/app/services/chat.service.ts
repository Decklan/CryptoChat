import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor() { }

  /**
   * Get the latest messages as an observable stream that can be 
   * subscribed/unsubscribed from in the room.
   */
  getMessages() {
    // Create the observable/observer (to push new messages to)
    let observable = new Observable(observer => {
      // Pass server url to socket
      this.socket = io(environment.serverBase);
      // Message event received from the server
      this.socket.on('message', (msgData) => {
        observer.next(msgData); // Update the observable with message
      });
      // Disconnect from the socket appropriately
      return () => {
        this.socket.disconnect();
      }
    });
    // Return observable to sub/unsub to/from
    return observable;
  }

  /**
   * Send a message by emitting the message event to the server
   */
  sendMessage(message: Message) {
    this.socket.emit('message', message);
  }

  // Join a specific room number by emitting the join event to the server
  joinRoom(id: number) {
    this.socket.emit('join', id);
  }
}
