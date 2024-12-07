
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup , Validators} from '@angular/forms'; //my imports for validation
import { AuthService } from 'src/app/survices/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  apierror:string=''; 
  isloading: boolean = false;
  loginform: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{6,20}$/)]),
  })
  constructor(private _AuthService: AuthService, private _Router: Router) { }
  submitLogin() {
    this.isloading = true;
    if (this.loginform.valid) {
      this._AuthService.signin(this.loginform.value).subscribe({
        next: (response) => {
         
          if (response.message === 'success') {
            localStorage.setItem('usertoken',response.token);
            this._AuthService.decodeusertoken();
            this._Router.navigate(['/home']);
            this.isloading = false;
          }
        },
        error: (err) => {
          this.apierror=err?.error?.message || 'An unexpected error occurred';
          this.isloading = false;
        }
      }) 
    }
  }
}