import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';

// Services
import { RoomService } from 'src/app/services/room.service';
import { ChatService } from './../../services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';
import { Member } from 'src/app/models/Member';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
  /**
   * id - The id of the room we are loading from the server
   * room - Stores the room loaded from the server
   * subscription - Observable subscription to sub/unsub to/from
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

  constructor(private roomService: RoomService,
    private socketService: SocketService,
    private route: ActivatedRoute) { 
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

    // Subscribe to the messaging observable to receive messages
    this.messageSubscription = this.socketService.getMessages()
    .subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  /**
   * Rather than fetch the room by its ID from the server, get all
   * of the rooms from the observable that already has each room and
   * match against the id that was passed as a route param.
   */
  getRoom() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      console.log('RoomComponent: getRoom() called.');
      for (let room of rooms) {
        if (room.id === this.id) {
          this.currentRoom = room;
          this.joinRoom();
          this.getMembers();
        }
      }
    }, (err) => { console.log(err) })
  }

  /**
   * Get the list of members in the current room
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
    member.roomId = this.id;
    member.user = user;
    this.socketService.joinRoom(member);
  }

  // Leave the room you are currently in
  leaveRoom() {
    console.log('RoomComponent: leaveRoom() called.');
    let user: User = JSON.parse(localStorage.getItem('user'));
    let member: Member = new Member();
    member.roomId = this.id;
    member.user = user;
    this.socketService.leaveRoom(member);
  }

  /**
   * Sending a message involves capturing the input from the form
   * and then creating a message from it and then calling the chatService
   * to send the message.
   */
  sendMessage() {
    let text = this.messageForm.controls['messageText'].value;

    let user: User = JSON.parse(localStorage.getItem('user'));

    let message: Message = new Message();
    message.from = user.userName;
    message.messageText = text;

    this.messageForm.reset();
    this.socketService.sendMessage(message);
  }

  /**
   * Unsubscribe from the observable when the component is destroyed to 
   * kill the connection to the socket.
   */
  ngOnDestroy() {
    this.leaveRoom();
    this.messageSubscription.unsubscribe();
    this.memberSubscription.unsubscribe();
  }

}
