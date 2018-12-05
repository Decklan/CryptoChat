import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Models
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';
import { User } from 'src/app/models/User';
import { Member } from 'src/app/models/Member';

// Services
import { SocketService } from 'src/app/services/socket.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
  /**
   * currentRoom - The room that the user is currently in
   * roomMembers - List of users who are currently in the room
   * messageSubscription - Observable subscription to messaging in the room
   * memberSubscription - Observable subscription to the users in the room
   */
  private id: number;
  public currentRoom: Room;
  public roomMembers: Member[] = [];
  private messageSubscription;
  private memberSubscription;
  
  // Form to capture message input
  public messageForm: FormGroup;

  // Array to store messages in
  public messages: Message[] = [];

  constructor(private socketService: SocketService,
    private roomService: RoomService,
    private route: ActivatedRoute) {
      // Get the id from the route params
      this.route.params.subscribe(p => {
        this.id = +p['id'];
      });
   }

  /**
   * Handle any logic that needs to be accomplished right before
   * presenting the view to the user.
   */
  ngOnInit() {
    this.getRoom();

    // Create the message from and its controls
    this.messageForm = new FormGroup({
      messageText: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ])
    });

    this.subscribeToMessages();
    this.getMembers();
  }

  /**
   * Gets the room details for the room the user just joined
   */
  getRoom() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      for (let room of rooms) {
        if (room.id === this.id) {
          this.currentRoom = room;
          this.joinRoom();
        }
      }
    }, (err) => { console.log(err) });
  }

  /**
   * Subscribe to the observable stream of messages for the room
   */
  subscribeToMessages() {
    // Subscribe to the messaging observable to receive messages
    this.messageSubscription = this.socketService.getMessages()
    .subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

  /**
   * Checks to see if a message was sent to this room
   * @param to The list of ids for the rooms the message is sent to
   */
  roomMessage(to: number[]) {
    for (let id of to) {
      if (this.currentRoom.id === id)
        return true;
    }
    return false;
  }

  /**
   * Subscribe to the observable stream of users in the room
   */
  getMembers() {
    this.memberSubscription = this.socketService.getRoomMembers()
    .subscribe((members: Member[]) => {
      console.log('RoomComponent: getMembers() called.');
      for (let member of members) {
        if (member.roomId === this.currentRoom.id)
          this.roomMembers.push(member);
      }
    }, (err) => { console.log(err) });
  }

  // Join the specific room to receive chat only for that room
  joinRoom() {
    console.log('RoomComponent: joinRoom() called.');
    let user: User = JSON.parse(localStorage.getItem('user'));
    let member: Member = new Member();
    member.roomId = this.currentRoom.id;
    member.user = user;
    this.socketService.joinRoom(member);
  }

  // Leave the room you are currently in
  leaveRoom() {
    console.log('RoomComponent: leaveRoom() called.');
    let user: User = JSON.parse(localStorage.getItem('user'));
    let member: Member = new Member();
    member.roomId = this.currentRoom.id;
    member.user = user;
    this.socketService.leaveRoom(member);
  }

  /**
   * Sending a message involves capturing the input from the form
   * and then creating a message from it and then calling the chatService
   * to send the message.
   */
  sendMessage() {
    // Capture the message the user entered and the user who sent it
    let text = this.messageForm.controls['messageText'].value;
    let user: User = JSON.parse(localStorage.getItem('user'));

    // Create the message
    let message: Message = new Message();
    message.from = user.userName;
    message.to = [this.currentRoom.id];
    message.messageText = text;

    // Reset the form and send the message
    this.messageForm.reset();
    this.socketService.sendMessage(message);
  }

  /**
   * Unsubscribe from the observable when the component is destroyed to 
   * kill the connection to the socket.
   */
  ngOnDestroy() {
    console.log(`RoomComponent: ${this.currentRoom.roomName} is being destroyed.`);
    this.leaveRoom();
    this.messageSubscription.unsubscribe();
    if (this.memberSubscription)
      this.memberSubscription.unsubscribe();
  }

}
