import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// AuthGuard for protecting routes unless a user is logged in
import { AuthGuard } from './guards/auth.guard';

// Components used for routing to/from
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomComponent } from './components/room/room.component';

// Array of valid application routes and their corresponding components
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },
  { path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
