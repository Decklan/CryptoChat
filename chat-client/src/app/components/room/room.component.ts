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
import { Member } from 'src/app/services/chat.service';

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
  public roomMembers: User[] = [];
  private subscription;
  
  // Form to capture message input
  public messageForm: FormGroup;

  // Array to store messages in
  public messages: Message[] = [];

  constructor(private roomService: RoomService,
    private chatService: ChatService,
    private userService: UserService,
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
    this.getMembers();

    // Create the message from and its controls
    this.messageForm = new FormGroup({
      messageText: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ])
    });

    // Subscribe to the messaging observable to receive messages
    this.subscription = this.chatService.getMessages()
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
      for (let room of rooms) {
        if (room.id === this.id) {
          this.currentRoom = room;
          this.joinRoom();
        }
      }
    }, (err) => { console.log(err) })
  }

  /**
   * Get the list of members in the current room
   */
  getMembers() {
    this.chatService.getRoomMembers()
    .subscribe((members: Member[]) => {
      for (let member of members) {
        if (member.roomId === this.id)
          this.roomMembers.push(member.user)
      }
    }, (err) => { console.log(err) });
  }

  // Join the specific room to receive chat only for that room
  joinRoom() {
    let user: User = JSON.parse(localStorage.getItem('user'));
    this.chatService.joinRoom(this.currentRoom.id, user);
  }

  // Leave the room you are currently in
  leaveRoom() {
    let user: User = JSON.parse(localStorage.getItem('user'));
    this.chatService.leaveRoom(this.currentRoom.id, user);
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
    this.chatService.sendMessage(message);
  }

  /**
   * Unsubscribe from the observable when the component is destroyed to 
   * kill the connection to the socket.
   */
  ngOnDestroy() {
    this.leaveRoom();
    this.subscription.unsubscribe();
  }

}
