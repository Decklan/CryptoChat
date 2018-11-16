import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Room } from 'src/app/models/Room';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public rooms: Room[];
  public activeUsers: User[];
  public roomForm: FormGroup;

  constructor(private roomService: RoomService,
    private userService: UserService) { }

  /**
    * Handle component logic before presentation to the user
    */
  ngOnInit() {
    this.getAllRooms();
    this.getActiveUsers();
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
    let user: User = this.userService.currentUser;

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

  /**
   * Get all rooms from the database
   */
  getAllRooms() {
    this.roomService.getAllRooms()
    .subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Removes a room by its id
   * @param id The id of the room we are removing
   */
  removeRoom(id: number) {
    this.roomService.removeRoomById(id)
    .subscribe((data) => {
      this.roomService.updateObservableState(this.rooms); // Update the list of rooms
    }, (err) => { console.log(err) });
  }

  /**
   * Get all users who are currently logged in to the application
   */
  getActiveUsers() {
    this.userService.getActiveUsers()
    .subscribe((users: User[]) => {
      this.activeUsers = users;
    }, (err) => { console.log(err) });
  }

  /**
   * Clear all the form data when cancelling/submitting form data
   */
  clear() {
    this.roomForm.reset();
  }
}
