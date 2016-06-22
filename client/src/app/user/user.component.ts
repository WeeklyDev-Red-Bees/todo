import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';

@Component({
  selector: 'user',
  styles: [ require('./user.scss') ],
  template: require('./user.html')
})
export class UserComponent implements OnInit {
  userService: UserService;
  user: User;
  
  constructor(userService: UserService) {
    console.log('userComponent constructor');
    this.userService = userService;
  }
  
  ngOnInit() {
    console.log('userComponent ngOnInit');
  }
}