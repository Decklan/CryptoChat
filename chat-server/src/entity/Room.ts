import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Model for Room
@Entity()
export class Room {

    // Auto indexed unique room id
    @PrimaryGeneratedColumn()
    id: number;

    // ID of the user who created the room
    @Column()
    ownerId: number;

    // Name of the room
    @Column()
    roomName: string;

    // Whether the room is public or private
    @Column({
        nullable: true
    })
    description: string;
}