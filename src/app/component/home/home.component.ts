import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LeaveTypeApiModel, LeaveTypeService, UserService, LimitApiModel,
  CarryoverApiModel, UserApiModel, RequestedHoursApiModel, LeaveService, LeaveRequestApiModel
} from '../../api';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup } from '@angular/material';
import { UserInfoService } from '../../service/user-info.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('TableLeavesPaginator', { static: false }) TableLeavesPaginator: MatPaginator;
  @ViewChild('TableLeavesSort', { static: false }) TableLeavesSort: MatSort;

  @ViewChild('TableTypesPaginator', { static: false }) TableTypesPaginator: MatPaginator;
  @ViewChild('TableTypesSort', { static: false }) TableTypesSort: MatSort;

  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  public displayedColumnsTypes: string[] = ['leaveType.name', 'leaveType.approvalNeeded',
    'limit', 'carryover', 'requestedHours'];
  public displayedColumnsLeaves: string[] = ['leaveType', 'fromDate', 'toDate', 'status'];
  public dataSourceLeaves: MatTableDataSource<LeaveRequestApiModel>;
  public dataSourceTypes: MatTableDataSource<LeaveTypeInfo>;
  public isDataLoaded: boolean;
  public leavesReady: boolean;
  public leaveTypeInfos: Array<LeaveTypeInfo> = [];
  public leaveRequests: Array<LeaveRequestApiModel> = [];
  public date: Date;
  public dateControl: FormControl;
  public leaveTypesCache = {};

  private userPromise: Promise<UserApiModel>;
  private user: UserApiModel;

  constructor(private leaveTypeApi: LeaveTypeService, private userApi: UserService,
    private userService: UserInfoService, private leavesApi: LeaveService) {
    this.date = new Date();
    this.date.setMonth(this.date.getMonth() - 6);
    this.dateControl = new FormControl(this.date);
  }

  ngOnInit() {
    this.isDataLoaded = false;
    this.leavesReady = false;
    this.userPromise = this.userService.currentUserPromise;
    this.initData();
  }

  async initData() {
    this.user = await this.userPromise;

    this.getLeaveTypes();
    this.getMyLeaves();
  }

  private getMyLeaves() {
    this.leavesApi.filterLeaveRequests(this.pgFormatDate(this.date), null, null, [this.user.id]).subscribe(response => {
      this.leaveRequests = response;
      this.fillDataLeaves();
    });
  }

  private getLeaveTypes() {
    this.leaveTypeApi.getAllLeaveTypes().subscribe(response => {
      this.leaveTypeInfos = response.map(type => {
        // cache leave type
        this.leaveTypesCache[type.id] = type;

        return {
          leaveType: type,
          limit: this.getLimit(type),
          carryover: this.getCarryover(type),
          requestedHours: this.getRequestedHours(type)
        }
      });
      this.fillDataTypes();
    });
  }

  private fillDataLeaves() {
    this.dataSourceLeaves = new MatTableDataSource<LeaveRequestApiModel>(this.leaveRequests);
    this.dataSourceLeaves.paginator = this.TableLeavesPaginator;
    this.dataSourceLeaves.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
      return item[property];
    };
    setTimeout(() => this.dataSourceLeaves.sort = this.TableLeavesSort);
  }

  private fillDataTypes() {
    this.dataSourceTypes = new MatTableDataSource<LeaveTypeInfo>(this.leaveTypeInfos);
    this.dataSourceTypes.paginator = this.TableTypesPaginator;
    this.dataSourceTypes.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item);
      if (["limit", "carryover", "requestedHours"].includes(property)) return item[property]["__zone_symbol__value"];
      return item[property];
    };
    setTimeout(() => this.dataSourceTypes.sort = this.TableTypesSort);
  }

  private getLimit(leaveType: LeaveTypeApiModel): Promise<number> {
    if (leaveType.limit == null) return null;
    return this.userApi.getLimit(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) return response.limit;
      return leaveType.limit;
    });
  }

  private getCarryover(leaveType: LeaveTypeApiModel): Promise<number> {
    if (leaveType.carryover == null) return null;
    return this.userApi.getCarryover(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) return response.carryover;
      return 0;
    });
  }

  private getRequestedHours(leaveType: LeaveTypeApiModel): Promise<number> {
    return this.userApi.getRequestedHours(this.user.id, leaveType.id).toPromise().then(response => {
      if (response != null) return response.requestedHours;
      return 0;
    });
  }

  applyFilterLeaves(filterValue: string) {
    this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
    this.dataSourceLeaves.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    //console.log(this.dataSource.filter);
  }

  applyFilterLeavesExact(filterValue: string) {
    this.dataSourceLeaves.filter = filterValue.trim().toLowerCase();
    this.dataSourceLeaves.filterPredicate = function (data: LeaveRequestApiModel, filterValue: string) {
      return data.status
        .trim()
        .toLocaleLowerCase() === filterValue;
    };
  }

  applyFilterLeavesDate(filterValue: string) {
    if (!this.dateControl.valid) return;
    this.date = new Date(filterValue);
    console.log(this.pgFormatDate(this.date));
    this.getMyLeaves();
    this.tabGroup.selectedIndex = 0;
  }

  applyFilterTypes(filterValue: string) {
    this.dataSourceTypes.filter = filterValue.trim().toLowerCase();
    this.dataSourceTypes.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    //console.log(this.dataSource.filter);
  }

  log(event) {
    console.log(typeof event);
    let date: Date = new Date(event);
    console.log(date.toString());
  }

  // Convert Javascript date to api accepted date
  pgFormatDate(date: Date): string {
    const zeroPad = d => ("0" + d).slice(-2);

    return `${date.getUTCFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
  }
}

interface LeaveTypeInfo {
  leaveType: LeaveTypeApiModel,
  limit?: Promise<number>,
  carryover?: Promise<number>,
  requestedHours: Promise<number>
}
