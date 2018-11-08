import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public rooms: Room[];
  public roomForm: FormGroup;

  constructor(private roomService: RoomService,
    private userService: UserService) { }

  ngOnInit() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    }, (err) => {
      console.log(err);
    });

    this.roomForm = new FormGroup({
      roomName: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      private: new FormControl(false)
    });
  }

  /**
   * Creates a new room and sends it to the server then updates the observable state
   * with the newly created room on successful creation
   */
  createRoom() {
    // Get the currently logged in user
    let user = this.userService.currentUser;

    // Grab the room info from the form
    let roomName = this.roomForm.controls['roomName'].value;
    let isPrivate = this.roomForm.controls['private'].value;
    let ownerId = user.id;

    // Create a model out of the form info
    let newRoom = new Room();
    newRoom.roomName = roomName;
    newRoom.isPrivate = isPrivate;
    newRoom.ownerId = ownerId;

    this.clear();

    this.roomService.createNewRoom(newRoom)
    .subscribe((createdRoom: Room) => {
      this.rooms.push(createdRoom);
      this.roomService.updateObservableState(this.rooms);
    }, (err) => {
      console.log(err);
    });
  }

  clear() {
    this.roomForm.reset();
  }
}
