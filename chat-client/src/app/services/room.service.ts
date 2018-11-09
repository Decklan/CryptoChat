import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Room } from './../models/Room';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiBase: string = 'api/rooms';
  private roomsSubject: BehaviorSubject<Room[]>;
  private roomsObservable: Observable<Room[]>;
  private room: Room;

  constructor(private http: HttpClient) { 
    this.roomsSubject = new BehaviorSubject([]);
    this.roomsObservable = this.roomsSubject.asObservable();

    this.roomsObservable = this.fetchAllRooms();
  }

  /**
   * Fetch all the rooms from the database
   */
  fetchAllRooms(): Observable<Room[]> {
    const endpoint = `${environment.serverBase}${this.apiBase}`;
    return this.http.get<Room[]>(endpoint);
  }

  /**
   * Sends a new room to create to the server
   * @param room The new room to create in the database
   * @returns The newly created room
   */
  createNewRoom(room: Room): Observable<Room> {
    const endpoint: string = `${environment.serverBase}${this.apiBase}`;
    return this.http.post<Room>(endpoint, room);
  }

  /**
   * Return the observable of rooms
   */
  getAllRooms(): Observable<Room[]> {
    return this.roomsObservable;
  }

  /**
   * Fetches a single room by its unique ID
   * @param id The id of the room we are requesting
   * @returns An observable containin the room we requested
   */
  getRoomById(id: number): Observable<Room> {
    const endpoint = `${environment.serverBase}${this.apiBase}/${id}`;
    return this.http.get<Room>(endpoint);
  }

  /**
   * Removes a room by its unique id from the database
   * @param id The id of the room that we want to delete
   */
  removeRoomById(id: number) {
    const endpoint: string = `${environment.serverBase}${this.apiBase}/${id}`;
    return this.http.delete<Room>(endpoint);
  }

  /**
   * Pushes a new value to the roomsObservable
   * @param rooms The new list of rooms to push to the BehaviorSubject
   */
  updateObservableState(rooms: Room[]) {
    this.roomsSubject.next(rooms);
  }

}
