import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Person } from '../person';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  people$: Observable<Person[]>;

  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.people$ = this.mainService.getPeople();
  }

}
