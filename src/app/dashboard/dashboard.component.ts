import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  leaveForm: FormGroup | any;
  hodData: any = false;
  staffData: any = false;
  leaveDataArr: any[] = [];
  totalLeaves: any = 10;
  approvedL: any = 0;
  rejectedL: any = 0;
  noOfDays: any;
  pendingL: any=0;
  userLoggedIn: any;
  hodDept: any;
  staffDept: any;
  userFirstName: any;
  userLastName: any;
  userDataArr: any[] = [];
  activeUser: any;
  activeDept: any;
  userClicked: any;
  constructor(private activeRoute : ActivatedRoute, private httpServ : HttpService) { }

  ngOnInit(): void {
    this.leaveForm = new FormGroup({
      startDateLeave: new FormControl("", Validators.required),
      endDateLeave: new FormControl("", Validators.required),
      reasonforLeave: new FormControl("", Validators.required),
    })

    this.getAllLeaveData();

   this.activeRoute.queryParams.subscribe(( value :any)=>{
    if(value.post ==='HOD'){
      this.userLoggedIn = value.post
      this.hodDept = value.userDept
    }else{
      this.userLoggedIn = value.post
      this.staffDept=value.userDept
    }
    this.activeUser = value.userName;
    this.activeDept = value.userDept
   })
  }

  onLeaveFormSubmit() {
    let fname = '';
    let lname = '';
    this.userDataArr.find((user: any) => {
      if (this.activeUser === user.userName) {
        fname = user.firstName,
          lname = user.lastName
      }
    })
    // console.log(fname)
    let day1 = new Date(this.leaveForm.value.startDateLeave)
    let day2 = new Date(this.leaveForm.value.endDateLeave)
    let dayCount = (day2.getTime() - day1.getTime()) / (1000 * 60 * 60 * 24) + 1;

    if (dayCount > this.totalLeaves || dayCount > (this.totalLeaves - this.pendingL)) {
      alert('Insufficient leaves or you have applied leaves more than available leaves ')
      return
    } else {
      let leaveData = {
        fromDate: this.leaveForm.value.startDateLeave,
        toDate: this.leaveForm.value.endDateLeave,
        noOfDays: dayCount,
        username: this.activeUser,
        department: this.activeDept,
        reason: this.leaveForm.value.reasonforLeave,
        status: 'Pending',
        firstname: fname,
        lastname: lname,
        totalLeaves: this.totalLeaves,
        approvedL: this.approvedL,
        rejectedL: this.rejectedL,
        pendingL: dayCount,
        approveCount: 0,
        rejectCount: 0
      }
      if(day1 > day2){
        alert('Invalid date selected');
        return
      }else{
        this.httpServ.postStaffLeaveData(leaveData).subscribe((data: any) => {
          // console.log(data)
          this.leaveForm.reset();
          this.getAllLeaveData();
        })
      }
      
    }


  }

  getAllLeaveData() {
    this.httpServ.getStaffLeaveData().subscribe((data:any)=>{
      data.forEach((user : any)=>{
        this.leaveDataArr = data;
        this.totalLeaves = user.totalLeaves;
        this.approvedL = user.approvedL;
        this.rejectedL = user.rejectedL;
        this.noOfDays = user.noOfDays;
        // if (user.pendingL > this.pendingL) {
        //   this.pendingL += user.pendingL;

        // } else {
        //   this.pendingL = user.pendingL
        // }
        this.pendingL += user.pendingL;
        console.log(this.pendingL)
        console.log(user.pendingL)
      })
    })
    this.getUserDetails()
  }

  getUserDetails() {
    this.httpServ.getRegistrationData().subscribe((userArr: any) => {
      this.userDataArr = userArr;
      this.userDataArr.forEach((user: any) => {
        if (this.activeUser === user.userName) {
          this.userFirstName = user.firstName,
            this.userLastName = user.lastName
        } else {
          return
        }
      })
    })
  }

  clickApprove(userId: any) {
    this.approvedL += userId.noOfDays;
    // this.totalLeaves -= this.approvedL;
    // this.pendingL -= this.approvedL;
    let leaveData = {
      status: 'Approved',
      totalLeaves: this.totalLeaves - this.approvedL,
      approvedL: this.approvedL,
      pendingL: (this.pendingL - this.approvedL),
      approveCount: 1,
      rejectCount: 0
    }
    this.httpServ.updateLeaveData(userId.id, leaveData).subscribe((userData: any) => {
      this.getAllLeaveData()
    })
    console.log(this.leaveDataArr)
  }

  clickReject(userId: any) {
    this.rejectedL += userId.noOfDays;
    this.totalLeaves -= this.rejectedL;
    this.pendingL -= this.rejectedL;
    let leaveData = {
      status: 'Rejected',
      totalLeaves: this.totalLeaves,
      rejectedL: this.rejectedL,
      pendingL: this.pendingL,
      approveCount: 0,
      rejectCount: 1
    }
    this.httpServ.updateLeaveData(userId.id, leaveData).subscribe((userData: any) => {
      this.getAllLeaveData()
    })
    console.log(this.leaveDataArr)
  }
}
