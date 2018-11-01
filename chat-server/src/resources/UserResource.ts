/**
 * A UserResource is sent back to the client because we don't want 
 * to send anything that has the user's password back to the client to
 * avoid anyone getting that information somehow.
 */
export class UserResource {
    id: number;
    userName: string;
    isActive: boolean;
}