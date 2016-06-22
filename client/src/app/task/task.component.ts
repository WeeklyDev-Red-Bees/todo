import { Component, Input } from '@angular/core';
import { UserService, Task } from '../user';

@Component({
  selector: 'task',
  styles: [ require('./task.scss') ],
  template: require('./task.html')
})
export class TaskComponent implements OnInit {
  @Input('src') taskString: string;
  task: Task;
  
  userService: UserService;
  
  constructor(userService: UserService) {
    this.userService = userService;
  }
  
  ngOnInit() {
    this.task = <Task>JSON.parse(this.taskString);
    console.log(this.task);
  }
}