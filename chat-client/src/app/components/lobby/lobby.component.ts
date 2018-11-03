import { Component, OnInit } from '@angular/core';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public rooms: Room[];

  constructor(private roomService: RoomService) { }

  ngOnInit() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    }, (err) => {
      console.log(err);
    });
  }

}
