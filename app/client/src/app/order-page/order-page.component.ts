import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

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
