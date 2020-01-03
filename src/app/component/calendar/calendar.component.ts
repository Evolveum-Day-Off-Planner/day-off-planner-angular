import { Component, AfterViewInit, ViewChild, Input, Renderer2 } from '@angular/core';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
import { LeaveRequestApiModel, UserApiModel, UserService, LeaveTypeService, LeaveService, LeaveTypeApiModel } from 'src/app/api';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild('scheduler', {static: false})
  public scheduler: DayPilotSchedulerComponent;

  public config: DayPilot.SchedulerConfig = {
    timeHeaders: [ {'groupBy': 'Month'}, {'groupBy': 'Day', 'format': 'ddd d'} ],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    infiniteScrollingEnabled: true,
    infiniteScrollingStepDays: 100,
    startDate: DayPilot.Date.today().addDays(-14),
    timeRangeSelectedHandling: 'Disabled',
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    eventDeleteHandling: 'Disabled',
    eventClickHandling: 'Disabled',
    eventHoverHandling: 'Disabled',
    useEventBoxes: 'Never',
    dynamicLoading: true,
    onBeforeCellRender: this.highlightWeekend
  };

  private listeners: Function[] = [];

  @Input()
  public displayedUsers: UserApiModel[] = [];

  public allUsers: UserApiModel[] = [];

  public leaveTypesCache = {};

  constructor(private userApi: UserService, private leaveTypeApi: LeaveTypeService, private leaveApi: LeaveService, private renderer: Renderer2) {
    // fetch users
    userApi.getAllUsers().subscribe(response => this.allUsers = response);

    // cache leave types
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      for (const type of response) {
        this.leaveTypesCache[type.id] = type;
      }
    });

    this.config.resources = this.displayedUsers.map(this.userToResource);
  }

  ngAfterViewInit() {
    this.scheduler.control.onScroll = args => {
      args.async = true;

      const start = args.viewport.start.toString('yyyy-MM-dd');
      const end = args.viewport.end.toString('yyyy-MM-dd');

      this.leaveApi
        .filterLeaveRequests(start, end, [LeaveRequestApiModel.StatusEnum.APPROVED, LeaveRequestApiModel.StatusEnum.PENDING], args.viewport.resources)
        .subscribe(response => {
          args.events = response.map(this.createEvent.bind(this));
          args.loaded();
        });
    };

  }

  addUsers() {
    this.afterRender(() => {
      this.listeners.forEach(remove => remove());
      this.listeners = this.displayedUsers.map(user => {
        return this.renderer.listen(document.getElementById(`remove-${user.id}`), 'click', e => {
          this.displayedUsers = this.displayedUsers.filter(u => u.id != user.id)
          this.config.resources = this.config.resources.filter(r => r.id != user.id);
        });
      });

      this.scheduler.control.scrollTo(this.config.startDate);
    });

    this.config.resources = this.displayedUsers.map(this.userToResource);
  }

  private userToResource(user: UserApiModel): DayPilot.ResourceData {
    const userName = `${user.firstName} ${user.lastName}`;

    return {
      name: userName,
      id: user.id,
      html: `<div><button id="remove-${user.id}">Remove</button><div>${userName}</div></div>`
    };
  }

  private createEvent(leaveRequest: LeaveRequestApiModel): DayPilot.EventData {
    const type: LeaveTypeApiModel = this.leaveTypesCache[leaveRequest.leaveType];

    // default for APPROVED
    let border = type.color;
    let background = type.color;

    // stripes for PENDING
    if (leaveRequest.status == LeaveRequestApiModel.StatusEnum.PENDING) {
      background = `repeating-linear-gradient(135deg, ${type.color}, ${type.color} 5px, black 5px, black 10px)`;
    }

    // black color for CANCELLED and REJECTED (should never happen)
    if (leaveRequest.status == LeaveRequestApiModel.StatusEnum.CANCELLED || leaveRequest.status == LeaveRequestApiModel.StatusEnum.REJECTED) {
      border = 'black';
      background = 'black';
    }

    return {
      cssClass: 'leave',
      id: leaveRequest.id,
      resource: leaveRequest.user,
      start: new DayPilot.Date(leaveRequest.fromDate),
      end: new DayPilot.Date(leaveRequest.toDate),
      text: '',
      barHidden: true,
      backColor: background,
      borderColor: border
    }
  }

  private highlightWeekend(args: any) {
    if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
      args.cell.backColor = "#dddddd";
    }
  }

  private afterRender(fun: () => void) {
    const previous = this.scheduler.control.onAfterRender;
    this.scheduler.control.onAfterRender = () => {
      if (previous) previous();
      if (fun) fun();
    };
  }

}