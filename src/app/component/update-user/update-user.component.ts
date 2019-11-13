import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { AdminService, UserApiModel, UserCreateApiModel, UserService } from '../../api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/service/user-info.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  public form: FormGroup;
  public buttonDisabled: boolean;
  public posibleUserSupervisors: Array<UserApiModel> = [];
  public selectControl: FormControl = new FormControl();
  public isUserUpdated: boolean;
  public errorMsg: string = '';

  @Input() public user: UserApiModel;

  @Output() userUpdatedEvent = new EventEmitter<boolean>();

  constructor(private adminService: AdminService, private userService: UserService, private userInfoService: UserInfoService, private router: Router, private ngZone: NgZone) {
    this.userService.getAllUsers().subscribe((user: UserApiModel[]) => {
      const allUsers: Array<UserApiModel> = user;
      const index = allUsers.findIndex(allUsers => allUsers.id === this.user.id); //find currentUser in allUsers
      allUsers.splice(index, 1); //delete currentUser from allUsers
      this.posibleUserSupervisors = allUsers;
    });
  }


  ngOnInit() {
    if (!this.userInfoService.hasAdminPrivileges) {
      this.router.navigate(['']);
    }
    this.form = new FormGroup({
      firstname: new FormControl('x', [Validators.required]),
      lastname: new FormControl('x', [Validators.required]),
      email: new FormControl('x@x', [Validators.required, Validators.email]),
      jobdescription: new FormControl('x', [Validators.required])
    }, { updateOn: 'submit' });
    this.isUserUpdated = false;
    this.buttonDisabled = false;
  }

  goBack() {
    this.userUpdatedNotify()
  }


  createNewUser(event) {
    event.preventDefault();
    this.form.updateValueAndValidity();
    if (!this.form.valid) {
      console.log(this.form.valid);
      return;
    }
    
    const newUser: UserCreateApiModel = {
      firstName: event.target.firstname.value,
      lastName: event.target.lastname.value,
      email: event.target.email.value,
      admin: event.target.admin.checked,
      supervisor: this.selectControl.value,
      jobDescription: event.target.jobdescription.value,
      phone: event.target.phone.value

    };

    this.buttonDisabled = true;
    this.adminService.updateUser(newUser, this.user.id).subscribe(
      response => {
        console.log(response);
        this.buttonDisabled = false;
        this.isUserUpdated = true;
      },
      error => {
        this.buttonDisabled = false;
        console.log(error);
        console.log(error.status);
        if (error.status == 409) {
          this.ngZone.run(() => {
            this.errorMsg = 'Email already taken'
          })
        } else throw error;
      }
    );
    console.log(newUser);
  }

  userUpdatedNotify() {
    this.userUpdatedEvent.emit(this.isUserUpdated);
  }
}