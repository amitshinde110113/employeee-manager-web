import { Component, OnInit, TemplateRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmployeeService } from 'src/app/shared/employee.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  isEdit: boolean;
  selectedEmployee: {};
  modalRef: BsModalRef;
  isProcessing: boolean;
  deleteModalRef: BsModalRef;
  employeeForm: FormGroup;
  currentUser: any;
  page = 0;
  totalCount: any;
  employees: any = [];
  isNextDisabled: boolean;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currenUser'));
    this.getEmployees();
  }
  getEmployees() {
    this.employeeService.getAll(this.page).subscribe((employees: any) => {
      this.employees = employees.employees;
      this.totalCount = employees.totalCount;
      this.isNextDisabled = (this.page + 1) * 10 >= this.totalCount ? true : false;
    }, error => {
      this.redirectIfTokenVarificationFailed(error);
      this.toastr.error(error.error.message || 'Error while getting employees.');
    });
  }
  openAddEmployeeModel(addEmployee: TemplateRef<any>) {
    this.isEdit = false;
    this.selectedEmployee = {};
    this.buildEmployeeForm();
    this.modalRef = this.modalService.show(addEmployee);
  }
  buildEmployeeForm() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [null, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],

    });
  }
  openEditEmployeeModel(editEmployee: TemplateRef<any>, employee) {
    this.isEdit = true;
    this.selectedEmployee = employee;
    this.buildEmployeeForm();
    this.patchValueToEmployeeForm();
    this.modalRef = this.modalService.show(editEmployee);
  }
  patchValueToEmployeeForm() {
    // throw new Error("Method not implemented.");
  }
  openDeleteConfirm(deleteConfirm: TemplateRef<any>, employee) {
    this.selectedEmployee = employee;
    this.deleteModalRef = this.modalService.show(deleteConfirm);
  }
  deleteEmployee() {

  }
  addEmployee() {

  }
  updateEmployee() {

  }
  redirectIfTokenVarificationFailed(error) {
    if (error.status === 498) {
      this.logout();
    }
  }
  logout() {
    this.authService.logout();
  }
}
