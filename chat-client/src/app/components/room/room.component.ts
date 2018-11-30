import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';
import { User } from 'src/app/models/User';
import { Member } from 'src/app/models/Member';

// Services
import { SocketService } from 'src/app/services/socket.service';

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
  @Input() public currentRoom: Room;
  public roomMembers: Member[] = [];
  private messageSubscription;
  private memberSubscription;
  
  // Form to capture message input
  public messageForm: FormGroup;

  // Array to store messages in
  public messages: Message[] = [];

  constructor(private socketService: SocketService) { }

  /**
   * Handle any logic that needs to be accomplished right before
   * presenting the view to the user.
   */
  ngOnInit() {
    this.joinRoom();

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
   * Subscribe to the observable stream of messages for the room
   */
  subscribeToMessages() {
    // Subscribe to the messaging observable to receive messages
    this.messageSubscription = this.socketService.getMessages()
    .subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  /**
   * Subscribe to the observable stream of users in the room
   */
  getMembers() {
    this.memberSubscription = this.socketService.getRoomMembers()
    .subscribe((members: Member[]) => {
      console.log('RoomComponent: getMembers() called.');
      this.roomMembers = members;
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
