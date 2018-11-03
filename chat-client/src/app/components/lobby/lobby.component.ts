import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public rooms: Room[];

  constructor(private roomService: RoomService,
    private router: Router) { }

  ngOnInit() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    }, (err) => {
      console.log(err);
    });
  }

  setRoom(room: Room) {
    this.roomService.setRoom(room);
  }

}
