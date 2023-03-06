import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, map, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    static UserDataBaseUrl = 'https://loginuserdata-de6bb-default-rtdb.asia-southeast1.firebasedatabase.app/loginUsers.json';
    static leaveDataUrl = 'https://leavedetails-3dcf4-default-rtdb.asia-southeast1.firebasedatabase.app/leave-Details.json';

    constructor(private http: HttpClient, private activeRoute : ActivatedRoute) { }

    postNewUserRegistrationData(registrationData: any) {
        const postregiDataObs = this.http.post(HttpService.UserDataBaseUrl,registrationData).pipe(catchError((errData : any)=>{
            return throwError(errData.error.error)
          }))
          return postregiDataObs
    }

    getRegistrationData(){
        const getRegiDataObs = this.http.get(HttpService.UserDataBaseUrl).pipe(map((catchedData: any)=>{
            const myRegrtData =[];
            for(let key in catchedData){
              myRegrtData.push({...catchedData[key], id : key})
            }
            return myRegrtData
           }),
           catchError((errData :any)=>{
            return throwError(errData.error.error)
           })
           )
           return getRegiDataObs
    }

    postStaffLeaveData(leaveData :any){
        const postLeaveDataObs=this.http.post(HttpService.leaveDataUrl,leaveData).pipe(catchError((errData : any)=>{
            return throwError(errData.error.error)
          }))
          return postLeaveDataObs
    }

    getStaffLeaveData(){
        const getStaffleaveDataObs = this.http.get(HttpService.leaveDataUrl).pipe(map((catchedData: any)=>{
            let activeDept;
            let activeUser;
            let activePost;
            this.activeRoute.queryParams.subscribe((value: any) => {
                activeDept = value.dept;
                activeUser = value.userName;
                activePost = value.post;
            })
            const leaveData =[];
            for(let key in catchedData){

               let firstname;
                let lastname;
                // if (activeDept === catchedData[key].department && activeUser === catchedData[key].userName) {
                //     leaveData.push({ ...catchedData[key], id: key, fname: firstname, lname: lastname })
                //     console.log()
                // } else if (activeDept === catchedData[key].department && activePost === 'HOD') {
                //     leaveData.push({ ...catchedData[key], id: key, fname: firstname, lname: lastname })
                // }
                leaveData.push({ ...catchedData[key], id: key, fname: firstname, lname: lastname })
            }
            return leaveData
           }),
           catchError((errData :any)=>{
            return throwError(errData.error.error)
           })
           )
           return getStaffleaveDataObs
    }

   

    updateLeaveData(id: any, leaveData: any) {
        return this.http.patch(`https://leavedetails-3dcf4-default-rtdb.asia-southeast1.firebasedatabase.app/leave-Details/${id}.json`, leaveData)
    }
}