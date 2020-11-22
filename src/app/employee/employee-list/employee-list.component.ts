import { Component, OnInit, TemplateRef } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmployeeService } from 'src/app/shared/employee.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormValidator } from 'src/app/shared/form-validators/form-validators';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  isEdit: boolean;
  selectedEmployee: any = {};
  modalRef: BsModalRef;
  isProcessing: boolean;
  deleteModalRef: BsModalRef;
  employeeForm: FormGroup;
  currentUser: any;
  page = 0;
  isDeleting: boolean;
  totalCount: any;
  employees: any = [];
  isNextDisabled: boolean;
  maxDate = new Date();
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
    this.isProcessing = true;
    this.employeeService.getAll(this.page).subscribe((employees: any) => {
      this.employees = employees.employees;
      this.totalCount = employees.totalCount;
      this.isNextDisabled = (this.page + 1) * 10 >= this.totalCount ? true : false;
      this.isProcessing = false;

    }, error => {
      this.redirectIfTokenVarificationFailed(error);
      this.toastr.error(error.error.message || 'Error while getting employees.');
      this.isProcessing = false;

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
      firstName: ['', FormValidator.isRequired()],
      lastName: ['', FormValidator.isRequired()],
      dob: [null, FormValidator.isRequired()],
      address: ['', FormValidator.isRequired()],
      city: ['', FormValidator.isRequired()],
      phone: ['', FormValidator.isRequired()],

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
    this.employeeForm.patchValue({
      firstName: this.selectedEmployee.firstName,
      lastName: this.selectedEmployee.lastName,
      dob: new Date(this.selectedEmployee.dob),
      address: this.selectedEmployee.address,
      city: this.selectedEmployee.city,
      phone: this.selectedEmployee.phone,

    });
  }
  openConfirm(confirm: TemplateRef<any>, employee, isDeleting) {
    this.isDeleting = isDeleting;
    this.selectedEmployee = employee;
    this.deleteModalRef = this.modalService.show(confirm);
  }
  openUpdateConfirm(deleteConfirm: TemplateRef<any>, employee) {
    this.selectedEmployee = employee;
    this.deleteModalRef = this.modalService.show(deleteConfirm);
  }
  deleteEmployee() {
    this.isProcessing = true;
    this.page = 0;
    this.employeeService.delete(this.selectedEmployee._id).subscribe((employee: any) => {
      this.deleteModalRef.hide();
      this.getEmployees();
      this.isProcessing = false;
      this.toastr.success('Employee deleted succesfully..');
    }, error => {
      this.redirectIfTokenVarificationFailed(error);
      this.isProcessing = false;
      this.toastr.error(error.error.message || 'Error while deleting employee.');

    });
  }
  addEmployee() {
    const data = this.employeeForm.value;
    data.user = this.currentUser._id;
    this.isProcessing = true;
    this.employeeService.create(this.employeeForm.value).subscribe((employee: any) => {
      this.modalRef.hide();
      this.isProcessing = false;
      this.getEmployees();
      this.toastr.success('Employee added succesfully..');

    }, error => {
      this.redirectIfTokenVarificationFailed(error);
      this.isProcessing = false;
      this.toastr.error(error.error.message || 'Error while adding employee.');

    });
  }
  updateEmployee() {
    this.isProcessing = true;
    this.employeeService.update(this.employeeForm.value, this.selectedEmployee._id).subscribe((employee: any) => {
      this.deleteModalRef.hide();
      this.modalRef.hide();

      this.getEmployees();
      this.isProcessing = false;
      this.toastr.success('Employee updated succesfully..');

    }, error => {
      this.redirectIfTokenVarificationFailed(error);
      this.isProcessing = false;
      this.toastr.error(error.error.message || 'Error while updating employee.');

    });
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
