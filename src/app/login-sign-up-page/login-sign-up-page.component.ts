import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-login-sign-up-page',
  templateUrl: './login-sign-up-page.component.html',
  styleUrls: ['./login-sign-up-page.component.css']
})
export class LoginSignUpPageComponent implements OnInit {

  myLoginForm: FormGroup | any;
  myRegistrationForm: FormGroup | any;
  errorMsg: string = '';
  registrationType: any[] = ['HOD', 'Staff'];
  departmentType: any[] = ['Science', 'Commerce', 'Art'];

  constructor( private httpServ : HttpService, private router : Router) { }

  ngOnInit(): void {

    // registerPage
    this.myRegistrationForm = new FormGroup({
      registType: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      userPassword: new FormControl('', Validators.required)
    })

    //login Form
    this.myLoginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      lgPassword: new FormControl('', Validators.required)
    })
  }

  registrationSubmit() {
    // console.log(this.myRegistrationForm.value)
    this.httpServ.postNewUserRegistrationData(this.myRegistrationForm.value).subscribe((data:any)=>{
      console.log(data)
    })
    this.myRegistrationForm.reset()
  }

  loginSubmit() {
    // console.log(this.myLoginForm.value)
    let count = 0;
    let countOne = 0;
    this.httpServ.getRegistrationData().subscribe((regData:any)=>{
      console.log(regData)
      regData.forEach((userData:any) => {
        if(this.myLoginForm.value.userName === userData.userName && this.myLoginForm.value.lgPassword === userData.userPassword){
          if(userData.registType==='HOD'){
            console.log('HOD Login')
            this.router.navigate(['dashboard'],{queryParams : {post : 'HOD', userName : userData.userName, userDept : userData.department}})
          }else{
            console.log('staff Login')
            this.router.navigate(['dashboard'],{queryParams : {post : 'STAFF', userName : userData.userName, userDept : userData.department}})
          }
          countOne++
          return
        }else{
          count++
          return
        }
      })
      if (count > 0 && countOne === 0) {
        alert('User Not found')
      }
    })
  }

}
