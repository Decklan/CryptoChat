import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public room: Room;
  public messages = [];

  constructor(private roomService: RoomService) { }

  ngOnInit() {
    this.getRoom();
  }

  getRoom() {
    this.room = new Room();
    this.room = this.roomService.getRoom();
  }

}
