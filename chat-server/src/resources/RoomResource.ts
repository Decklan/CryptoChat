/**
 * Room resource to send back to the client
 */
export class RoomResource {
    id: number;
    ownerId: number;
    roomName: string;
    isPrivate: boolean;
}