import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Message } from '../models/Message';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket; // Client-side socket

  constructor() { 
    this.connect();
  }

  /**
   * Setup the url socket listens on
   */ 
  connect() {
    this.socket = io(environment.serverBase);
    console.log('SocketService: Socket connected.');
  }

  /**
   * Disconnect from the socket when appropriate
   */
  disconnect() {
    this.socket.disconnect();
  }

  /**
   * Get the latest messages as an observable stream that can be 
   * subscribed/unsubscribed to/from in the room.
   */
  getMessages() {
    // Create the observable/observer (to push new messages to)
    return new Observable(observer => {
      // Message event received from the server
      this.socket.on('message', (msgData) => {
        observer.next(msgData); // Update the observable with message
      });
    });
  }

  // Get members in a room to be displayed while a user is in a chat room
  getRoomMembers() {
    // Create an observable to keep track of the users in each room
    return new Observable(observer => {
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
    });
  }

  /**
   * Send a message by emitting the message event to the server
   */
  sendMessage(message: Message) {
    console.log('ChatService: sendMessage() called.');
    this.socket.emit('message', message);
  }

  // Join a specific room number by emitting the join event to the server
  joinRoom(member: Member) {
    console.log('ChatService: joinRoom() called.');
    this.socket.emit('join', member);
  }

  // Leave the room that the user is currently in
  leaveRoom(member: Member) {
    console.log('ChatService: leaveRoom() called.');
    this.socket.emit('leave', member);
  }
}
