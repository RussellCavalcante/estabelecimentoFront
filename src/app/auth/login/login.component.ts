import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]],
  })

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
  }

  onSubmit() {
    const crendentials = this.loginForm.value;
    this.loading = true;
    this.authService.login(crendentials)
      .subscribe(
        (user) => {
          console.log(user);
          this.snackBar.open(
            'Logado com sucesso. Bem-vindo ' + user.firstname + '!', 'OK',
            {duration: 2000});
          this.router.navigateByUrl('/');
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.snackBar.open(
            'Email ou senha incorretos :(', 'OK', {duration: 2000});
            this.loading = false;
        }
      )
  }
}
