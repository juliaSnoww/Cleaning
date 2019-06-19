import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompanyService} from '../../shared/service/company.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Company} from '../../shared/model/company.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/service/auth.service';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss']
})
export class CompanyItemComponent implements OnInit, OnDestroy {
  private isButtonClick = false;
  private company;
  private companyName;
  private roomsCost;
  private commentForm;
  private idCompany;
  private commentsArray;
  private isAuth;
  private logoURL;

  cleaningTypeArray = [
    {value: 'standard', display: 'Standard', img: './assets/type cleaning/color/1sweep.svg'},
    {value: 'general', display: 'General', img: './assets/type cleaning/color/1washbowl.svg'},
    {value: 'afterConstruction', display: 'Renovation', img: './assets/type cleaning/color/1hammer.svg'},
    {value: 'carpetCleaning', display: 'Carpet', img: './assets/type cleaning/color/1rug.svg'},
    {value: 'officeCleaning', display: 'Office', img: './assets/type cleaning/color/1desk.svg'},
    {value: 'furnitureCleaning', display: 'Furniture', img: './assets/type cleaning/color/1sofa.svg'},
    {value: 'industrialCleaning', display: 'Industrial', img: './assets/type cleaning/color/floor.svg'},
    {value: 'poolCleaning', display: 'Pool', img: './assets/type cleaning/color/1pool.svg'}
  ];

  constructor(private router: Router,
              private companyService: CompanyService,
              private authService: AuthService,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    const companyName = this.activateRoute.snapshot.params['name'];
    this.companyService.getProfileCompany(companyName).subscribe((res: Company) => {
      this.idCompany = res._id;
      this.companyService.getComments(this.idCompany)
        .subscribe(comments => {
          this.commentsArray = comments;
        });
      this.company = res.company;
      this.logoURL = res.company.logo;
      this.company.cleaningServiceInfo = {
        name: res.name,
        cleaningService_id: res._id
      };
      this.companyName = res.name;
      this.roomsCost = this.company.costPerUnit.rooms;
      this.cleaningTypeArray = this.cleaningTypeArray
        .filter(el => el.value in this.company.costPerUnit.type);
    });
    this.commentForm = new FormGroup({
      text: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required)
    });

  }

  ngOnDestroy() {
    if (!this.isButtonClick) this.companyService.onUnselectedCompany();
  }


  sendComment() {
    if (this.commentForm.valid) {
      const data = this.commentForm.value;
      const comment = {text: data.text, rate: data.rate, cleaningService_id: this.idCompany};
      this.companyService.postComment(comment);
      this.commentForm.reset();
    } else return;
  }

  order() {
    this.isButtonClick = true;
    this.companyService.selectCompany(this.company);
    this.router.navigate(['/reservation']);
  }

  returnBack(e, block) {
    if (!block.contains(e.target)) this.router.navigate(['/company-list']);
  }

}
