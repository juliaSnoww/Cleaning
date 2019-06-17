import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AdminService} from '../../shared/service/admin.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {
  isUserBlock = false;
  reasonForm: FormGroup;
  @Input() company;

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.reasonForm = new FormGroup({
      reason: new FormControl('')
    });
  }

  blockUser(company) {
    const reason = this.reasonForm.value.reason;
    if (this.company.activeStatus.reason) {
      this.adminService.unblockUser(company._id).subscribe(
        res => {
          this.reasonForm.reset();
          this.company.activeStatus.status = true;
          this.company.activeStatus.reason = '';
        });
    }
    else {
      if (reason) this.adminService.blockUser(company._id, reason).subscribe(res => {
        this.reasonForm.reset();
        this.company.activeStatus.status = false;
        this.company.activeStatus.reason = reason;
        this.isUserBlock = false;
      });
      else this.isUserBlock = true;
    }
  }
}
