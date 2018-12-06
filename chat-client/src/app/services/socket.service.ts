import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Models
import { Message } from '../models/Message';
import { Member } from '../models/Member';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket; // Client-side socket

  constructor() { 
    this.connect();

    // Set up some event listeners for any types of errors that could occur
    this.socket.on('connect_error', (err) => {
      console.error('CLIENT: There was an error connecting socket \n', err);
    });

    this.socket.on('error', (err) => {
      console.error('CLIENT: An error occurred \n', err);
    });
  }

  /**
   * Setup the url socket listens on and connect the socket
   */ 
  connect() {
    this.socket = io(environment.serverBase);
  }

  /**
   * Disconnect from the socket when appropriate 
   * Called when a user logs out.s
   */
  disconnect() {
    this.socket.disconnect();
  }

  /**
   * Get the latest messages as an observable stream that can be 
   * subscribed/unsubscribed to/from in the room.
   * 
   * Inspiration for this style of getting messages came from this tutorial:
   * https://tutorialedge.net/typescript/angular/angular-socket-io-tutorial/
   * 
   * Follows a similar style of subscribing to messages.
   */
  getMessages() {
    // Create the observable/observer (to push new messages to)
    return new Observable(observer => {
      // Message event received from the server
      this.socket.on('message', (msgData) => {
        observer.next(msgData); // Update the observable with new message
      });
    });
  }

  /**
   * Follows a similar style as getMessages() above. When a user joins
   * a room the memberJoin event is emitted to the server and the server
   * responds by creating the user/roomId member pair and adding it to its
   * server side array of members. The server then emits this list back to 
   * the client. Anyone in room receives the new list of members and can
   * update the list of people in their room accordingly. 
   */
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
   * @param message The message to be sent
   */
  sendMessage(message: Message) {
    this.socket.emit('message', message);
  }

  /**
   * Sends a message to be broadcasted to multiple rooms
   * @param message The message to send to each of the rooms
   */
  broadcastMessage(message: Message) {
    this.socket.emit('broadcast', message);
  }

  /**
   * Emit the join event to the server for the user to join the
   * room they just entered
   * @param member The member who is joining the room
   */
  joinRoom(member: Member) {
    this.socket.emit('join', member);
  }

  /**
   * Emit the leave event to the server for the user to leave
   * the room they just left
   * @param member The member who is leaving the room
   */
  leaveRoom(member: Member) {
    this.socket.emit('leave', member);
  }
}
