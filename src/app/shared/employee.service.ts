import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = 'http://localhost:4000/api/employees'

  constructor(private http: HttpClient) { }
  create(employee) {
    return this.http.post(`${this.baseUrl}/`, employee);
  }
  update(employee, id) {
    return this.http.patch(`${this.baseUrl}/${id}`, employee);
  }
  delete(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  getAll(page) {
    return this.http.get(`${this.baseUrl}/pagination/${page}`);
  }
}
