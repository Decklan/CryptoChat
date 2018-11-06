import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  /**
   * ID to store the id of the room we are loading and
   * room to store the details for the room
   */
  private id: number;
  public room: Room;
  
  // Form to capture message input
  public messageForm: FormGroup;

  // Array to store messages in
  public messages: Message[] = [];

  // Socket for communication
  private socket: SocketIOClient.Socket;

  constructor(private roomService: RoomService,
    private route: ActivatedRoute) { 
      this.route.params.subscribe(p => {
        this.id = +p['id'];
      });

      this.socket = io(environment.serverBase);
      this.socket.connect();
  }

  ngOnInit() {
    this.getRoom();

    this.messageForm = new FormGroup({
      messageText: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ])
    });

    // Set up socket listeners
    this.socket.on('message', (message) => {
      this.messages.push(message);
    });
  }

  getRoom() {
    this.roomService.getRoomById(this.id)
    .subscribe((room: Room) => {
      this.room = room;
    });
  }

  sendMessage() {
    let text = this.messageForm.controls['messageText'].value;

    let message: Message = new Message();
    message.from = 'Anon';
    message.messageText = text;

    this.messageForm.reset();
    this.socket.emit('message', message);
  }

}
