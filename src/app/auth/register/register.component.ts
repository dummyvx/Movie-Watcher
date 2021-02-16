import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  // matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private notifierService: NotifierService) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('\\b[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\\..+\\b')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordsMatch('password', 'confirmPassword').bind(this)});
  }

  get form(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  register(): void {
    console.log(this.form);
    // this.authService.register(
    //   {
    //     email: this.form.email.value,
    //     password: this.form.password.value
    //   }
    // )
    //   .subscribe(success => {
    //     if (success) {
    //       this.notifierService.notify('success', 'Your account is created. Please log in');
    //       this.router.navigate(['/auth/login']);
    //     }
    //   });
  }

  // passwordsMatch(control: FormControl): { [key: string]: boolean } {
  //   // console.log(this.form);
  //   //
  //   // const password = this.form;
  //   // return
  //   // // const confirmPassword = group.get('confirmPassword');
  //   // // return password === confirmPassword ? null : { notSame: true };
  // }
  passwordsMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
