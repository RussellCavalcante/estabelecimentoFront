import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DepartmentModel } from '../interfaces/department';
import { DepartmentService } from '../extra_services/department_service';
import { Product } from '../interfaces/products';
import { ProductsService } from '../extra_services/products.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    departments: ['', [Validators.required]],

  })

  products: Product[] = []
  departments: DepartmentModel[] = []

  public unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private productService: ProductsService,
              private fb: FormBuilder,
              private departmentService: DepartmentService,
              private snackBar: MatSnackBar) { }

  ngOnInit(){
    this.productService.get()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((prods)=> this.products = prods);
      this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe((deps) => this.departments = deps);

  }


  save(){
    let data = this.productForm.value;

    if (data._id != null){
      this.productService.update(data)
        .subscribe();
    }
    else {
      this.productService.add(data)
        .subscribe();

        this.ngOnInit()
    }

  }

  delete(p: Product) {
    this.productService.del(p)
      .subscribe(
        () => this.notify("deleted"),
        (err) => console.log(err)
      )


  }

  edit(p: Product) {
    this.productForm.setValue(p);


  }

  notify(msg: string){
    this.snackBar.open(msg, "OK", {duration:3000})
  }
}
