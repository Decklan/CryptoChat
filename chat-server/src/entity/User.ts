import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Model for a User
@Entity()
export class User {

    // Auto indexed unique user id
    @PrimaryGeneratedColumn()
    id: number;

    // Username that the user chooses
    @Column()
    userName: string;

    // Hashed version of the password a user enters
    @Column()
    hashedPassword: string;

    // Unique salt added to the unhashed password
    @Column()
    salt: string;

    // Flag to show if the user is active or not
    @Column()
    isActive: boolean;
}