import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Message } from '../models/Message';
import { User } from '../models/User';

export class Member {
  roomId: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: SocketIOClient.Socket;

  constructor() {
    // Pass server url to socket 
    this.socket = io(environment.serverBase);
  }

  /**
   * Get the latest messages as an observable stream that can be 
   * subscribed/unsubscribed to/from in the room.
   */
  getMessages() {
    // Create the observable/observer (to push new messages to)
    let observable = new Observable(observer => {
      // Message event received from the server
      this.socket.on('message', (msgData) => {
        observer.next(msgData); // Update the observable with message
      });

      // Disconnect from the socket appropriately
      return () => { this.socket.disconnect() }
    });
    // Return observable to sub/unsub to/from
    return observable;
  }

  // Get members in a room to be displayed while a user is in a chat room
  getRoomMembers() {
    // Create an observable to keep track of the users in each room
    let observable = new Observable(observer => {
      /**
       * On the join event emitted from the server, update the list of 
       * users in the room.
       */
      this.socket.on('memberJoin', (memberData) => {
        observer.next(memberData);
      });

      /**
       * On the leave event emitted from the server, update the list of
       * users in the room
       */
      this.socket.on('memberLeave', (memberData) => {
        observer.next(memberData);
      });

      return() => { this.socket.disconnect() }
    });

    // Return this observable to subscribe to
    return observable;
  }

  /**
   * Send a message by emitting the message event to the server
   */
  sendMessage(message: Message) {
    console.log('ChatService: sendMessage() called.');
    this.socket.emit('message', message);
  }

  // Join a specific room number by emitting the join event to the server
  joinRoom(id: number, user: User) {
    console.log('ChatService: joinRoom() called.');
    let member = new Member();
    member.roomId = id;
    member.user = user;
    this.socket.emit('join', member);
  }

  // Leave the room that the user is currently in
  leaveRoom(id: number, user: User) {
    console.log('ChatService: leaveRoom() called.');
    let member = new Member();
    member.roomId = id;
    member.user = user;
    this.socket.emit('leave', member);
  }
}
