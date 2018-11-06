import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  private id: number;
  public room: Room;
  public messageForm: FormGroup;

  public messages = [];

  constructor(private roomService: RoomService,
    private route: ActivatedRoute) { 
      this.route.params.subscribe(p => {
        this.id = +p['id'];
      });
  }

  ngOnInit() {
    this.getRoom();

    this.messageForm = new FormGroup({
      messageText: new FormControl(null, [
        Validators.required,
        Validators.minLength(2)
      ])
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
    this.messages.push(message);
  }

}
