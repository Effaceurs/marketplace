import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";

@Component({
  selector: 'app-terraform-order-page',
  templateUrl: './terraform-order-page.component.html',
  styleUrls: ['./terraform-order-page.component.css']
})
export class TerraformOrderPageComponent implements OnInit {

  applications = []

  constructor(private applicationService: ApplicationService) {

  }

  ngOnInit() {
    this.applicationService.fetch().subscribe(result => {
      console.log(result)
      this.applications = result
      
    }, err => {
      console.log(err)
    })
    
  }

}
