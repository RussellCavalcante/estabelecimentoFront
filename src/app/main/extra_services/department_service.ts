import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DepartmentModel as Department  } from '../interfaces/department';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  readonly url = 'http://localhost:3000/departments';


  URL = 'http://localhost:3000/departments';

  private departmentsSubject$?: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded: Boolean = false;


  constructor(private http: HttpClient) { }

  getdeps(){
    return this.http.get(this.URL).toPromise();


  }

  get(): Observable<Department[]>{
    this.http.get<Department[]>(this.url)
        .pipe(tap((deps) => console.log(deps)))
        .subscribe(this.departmentsSubject$);
    return this.departmentsSubject$.asObservable();
  }

  add(d: Department): Observable<Department>  {
    return this.http.post<Department>(this.url, d)
    .pipe(
      tap((dep: Department) => this.departmentsSubject$.getValue().push(dep))
    )
  }

  dell(d: Department): Observable<any> {
    return this.http.delete(`${this.url}/${d._id}`)
    .pipe(
      tap(()=> {
        let departments = this.departmentsSubject$.getValue();
        let i = departments.findIndex(d => d._id === d._id);
        if (i>=0)
          departments.splice(i, 1);
        }
      ))
  }


  update(dep: Department): Observable<Department> {
    return this.http.patch<Department>(`${this.url}/${dep._id}`, dep)
    .pipe(
      tap((d)=> {
        let departments = this.departmentsSubject$.getValue();
        let i = departments.findIndex(d => d._id === dep._id);
        if (i>=0)
          departments[i].name = d.name
      })
    )
  }

}
