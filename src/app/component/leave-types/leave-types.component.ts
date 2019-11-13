import {Component, OnInit, ViewChild} from '@angular/core';
import {LeaveTypeApiModel, LeaveTypeService} from '../../api';
import {Router} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-leave-types',
  templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.css']
})
export class LeaveTypesComponent implements OnInit {

  constructor(private leaveType: LeaveTypeService, private router: Router) {
    this.isDataLoaded = false;
    this.getDataAllLeaveTypes();
  }

  private leaveTypes: Array<LeaveTypeApiModel> = [];
  public displayedColumns: string[] = ['name', 'approvalNeeded', 'limit', 'carryover'];
  public dataSource: MatTableDataSource<LeaveTypeApiModel>;
  public isDataLoaded: boolean;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {

  }

  getDataAllLeaveTypes() {
    this.leaveType.getAllLeaveTypes().subscribe((leaveType: LeaveTypeApiModel[]) => {
      this.leaveTypes = leaveType;
      this.fillData();
    });
  }

  fillData() {
    this.dataSource = new MatTableDataSource<LeaveTypeApiModel>(this.leaveTypes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isDataLoaded = true;
  }

  addLeaveType() {
    this.router.navigate(['admin/addLeaveType'] );
  }

  openLeaveType(leaveTypeId) {
    console.log(leaveTypeId);
    this.router.navigate(['admin/leaveType'] ,  { state: { leaveTypeId: leaveTypeId }});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

}