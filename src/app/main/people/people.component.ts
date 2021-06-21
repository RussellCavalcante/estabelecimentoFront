import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DepartmentModel as Department, DepartmentModel  } from '../interfaces/department';
import { DepartmentService } from '../extra_services/department_service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class DepartmentComponent implements OnInit {
  objectadd: DepartmentModel
  depName = '';
  location='';
  departments: Department[] = []
  deps = []
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  myControl = new FormControl();

  private unsubscribe$: Subject<any> = new Subject();
  depEdit: Department = null;
  constructor(
    private departmentService?: DepartmentService,
    private snackBar?: MatSnackBar,

  ) { }

  ngOnInit(){
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((deps) => {
        this.departments = deps
        if(deps){
            for(let dep of deps){
              this.options.push(dep.location)
            }
          }
        });


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(' '),
      map(value => this._filter(value))
    );

    // this.departmentService.getdeps()

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(Option => Option.toLowerCase().includes(filterValue)
    );
  }
  save(){
    if (this.depEdit){
      this.departmentService.update(
        {name: this.depName, _id: this.depEdit._id})
        .subscribe(
          (dep) => {
            this.notify("Updated !")
          },
          (err) => {
            this.notify("Error")
          }

        )
    }
    else {

      this.departmentService.add({name: this.depName ,location : this.location})
      .subscribe(
        (dep) => {
                  this.clearFields();},
        (err) => console.error(err))

    }


  }

  clearFields() {
    this.depName ='';
    this.depEdit = null
  }

  cancel(){

  }

  delete(d: Department){
    this.departmentService.dell(d)
    .subscribe(
      () => this.notify('Removed!'),
      (err) => console.log(err)
    )
  }
  edit(dep: Department){
    this.depName = dep.name;
    this.depEdit = dep;

  }

  notify(msg: string){
    this.snackBar.open(msg, "OK", {duration:3000})
  }

  // ngOnDestroy(){
  //   this.unsubscribe$.next();

  // }
}
