import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';

// Models
import { Room } from 'src/app/models/Room';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  /**
   * rooms       - All the rooms retrieved from the database
   * activeUsers - All the users retrieved from the database 
   *               who are currently logged in to the app
   * currentUser - The user currently logged in to the app
   * roomForm    - Form for collecting room info when creating a
   *               new room
   */
  public rooms: Room[];
  public activeUsers: User[];
  public currentUser: User;
  public roomForm: FormGroup;

  // Subscriptions to the various observables used
  private roomSubscription: Subscription;
  private activeUserSubscription: Subscription;

  constructor(private roomService: RoomService,
    private userService: UserService,
    private socketService: SocketService,
    private router: Router) { }

  /**
    * Handle component logic before presentation to the user
    */
  ngOnInit() {
    this.getAllRooms();
    this.getActiveUsers();
    this.currentUser = this.userService.getCurrentUser();

    this.roomForm = new FormGroup({
      roomName: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      private: new FormControl(false)
    });
  }

  /**
   * When the component gets destroyed
   */
  ngOnDestroy() {
    this.roomSubscription.unsubscribe();
    this.activeUserSubscription.unsubscribe();
  }

  /**
   * Creates a new room and sends it to the server then updates the observable state
   * with the newly created room on successful creation
   */
  createRoom() {
    // Grab the room info from the form
    let roomName = this.roomForm.controls['roomName'].value;
    let isPrivate = this.roomForm.controls['private'].value;
    let ownerId = this.currentUser.id;

    // Create a model out of the form info
    let newRoom = new Room();
    newRoom.roomName = roomName;
    newRoom.isPrivate = isPrivate;
    newRoom.ownerId = ownerId;

    // Clear form input fields
    this.clear();

    // Create the new room
    this.roomService.createNewRoom(newRoom)
    .subscribe((createdRoom: Room) => {
      this.rooms.push(createdRoom);
      this.roomService.updateObservableState(this.rooms);
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Call the roomService getAllRooms() method to get all the 
   * available rooms in the application
   */
  getAllRooms() {
    this.roomSubscription = this.roomService.getAllRooms()
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
    this.activeUserSubscription = this.userService.getActiveUsers()
    .subscribe((users: User[]) => {
      this.activeUsers = users;
    }, (err) => { console.log(err) });
  }

  /**
   * Log the current user out of the application
   */
  logout() {
    this.currentUser.isActive = false;
    this.userService.updateUser(this.currentUser)
    .subscribe((user: User) => {
      localStorage.removeItem('user');
      this.socketService.disconnect();
      this.router.navigate(['/']);
    }, (err) => { console.log(err) });
  }

  /**
   * Clear all the form data when cancelling/submitting form data
   */
  clear() {
    this.roomForm.reset();
  }
}
