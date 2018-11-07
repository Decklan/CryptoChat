import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Models
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';

// Services
import { RoomService } from 'src/app/services/room.service';
import { ChatService } from './../../services/chat.service';


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
  public room: Room;
  private subscription;
  
  // Form to capture message input
  public messageForm: FormGroup;

  // Array to store messages in
  public messages: Message[] = [];

  constructor(private roomService: RoomService,
    private chatService: ChatService,
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
    this.subscription = this.chatService.getMessages()
    .subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  /**
   * Retrieve the information about the current room that we are in
   */
  getRoom() {
    this.roomService.getRoomById(this.id)
    .subscribe((room: Room) => {
      this.room = room;
      this.joinRoom();
    });
  }

  // Join the specific room to receive chat only for that room
  joinRoom() {
    this.chatService.joinRoom(this.room.id);
  }

  /**
   * Sending a message involves capturing the input from the form
   * and then creating a message from it and then calling the chatService
   * to send the message.
   */
  sendMessage() {
    let text = this.messageForm.controls['messageText'].value;

    let message: Message = new Message();
    message.from = 'Anon';
    message.messageText = text;

    this.messageForm.reset();
    this.chatService.sendMessage(message);
  }

  /**
   * Unsubscribe from the observable when the component is destroy to 
   * kill the connection to the socket.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
