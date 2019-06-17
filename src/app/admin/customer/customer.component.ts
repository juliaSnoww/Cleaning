import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminService} from '../../shared/service/admin.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customerArray = [];
userPath;
  constructor(private http: HttpClient,
              private router: ActivatedRoute,
              private adminService: AdminService) {
  }

  ngOnInit() {
    this.userPath = this.router.snapshot.routeConfig.path;
    if (this.userPath === 'customer')
      this.adminService.getClients().subscribe((res: Array<object>) => {
        this.customerArray = res;
      });
    else this.adminService.getCompanies().subscribe((res: Array<object>) => {
      this.customerArray = res;
    });

  }

}
