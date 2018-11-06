import { Request, Response } from 'express';
import { getConnection, Not } from 'typeorm';

import { Room } from '../../build/entity/Room';
import { RoomResource } from '../resources/RoomResource';

/**
 * Creates a new room in the database to send back to the client
 * @param req Request containing the room name and public/private scope
 * @param res Response carrying the newly created RoomResource
 * @returns The newly created room as a resource
 */
export function CreateRoom(req: Request, res: Response) {
    const roomRepository = getConnection().getRepository(Room);

    let newRoom: Room = new Room();
    newRoom.roomName = req.body.roomName;
    newRoom.ownerId = req.body.ownerId;
    newRoom.isPrivate = req.body.isPrivate;

    roomRepository.save(newRoom)
    .then((room: Room) => {
        let resource = new RoomResource();
        resource.id = room.id;
        resource.ownerId = room.ownerId;
        resource.roomName = room.roomName;
        resource.isPrivate = room.isPrivate;

        res.status(200);
        res.send(resource);
    })
    .catch((err) => {
        res.status(err.statusCode);
        res.send({
            error: 'There was an issue creating the new room.'
        });
    });
}

/**
 * Fetches a single room by it's unique id
 * @param req Request from the server for a room matching param id
 * @param res Response containing the room that we are requestion from the server
 * @returns The room matching the given id we requested
 */
export function GetRoomById(req: Request, res: Response) {
    const roomRepository = getConnection().getRepository(Room);

    roomRepository.findOne({
        where: { id: req.params.id }
    })
    .then((room: Room) => {
        let resource = new RoomResource();
        resource.id = room.id;
        resource.ownerId = room.ownerId;
        resource.roomName = room.roomName;
        resource.isPrivate = room.isPrivate;

        res.status(200);
        res.send(resource);
    })
    .catch((err) => {
        res.status(err.statusCode);
        res.send({
            error: 'There was an issue fetching the room you requested.'
        })
    });
}

/**
 * Fetches all rooms from the database
 * @param req Request for all rooms from the database
 * @param res Response containing all the rooms in the database
 * @returns All the rooms that have been created 
 */
export function GetAllRooms(req: Request, res: Response) {
    const roomRepository = getConnection().getRepository(Room);
    
    roomRepository.find()
    .then((rooms: Room[]) => {
        let roomsResources: RoomResource[] = [];

        for (let room of rooms) {
            let resource = new RoomResource();
            resource.id = room.id;
            resource.ownerId = room.ownerId;
            resource.roomName = room.roomName;
            resource.isPrivate = room.isPrivate;

            roomsResources.push(resource);
        }

        res.status(200);
        res.send(roomsResources);
    })
    .catch((err) => {
        res.status(err.statusCode);
        res.send({
            error: 'There was an issue fetching rooms.'
        })
    });
}

/**
 * Removes a room from the database
 * @param req Request containing the room id of the room to remove
 * @param res Response containing successful deletion of the room
 */
export function RemoveRoomById(req: Request, res: Response) {
    //const roomRepository = getConnection().getRepository(Room);
    console.log(req.params.id);
}