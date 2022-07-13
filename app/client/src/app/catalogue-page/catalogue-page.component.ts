import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";
import { CatalogueService } from "../shared/services/catalogue.service";
import { MaterialService } from "../shared/classes/material.service"

@Component({
  selector: 'app-catalogue-page',
  templateUrl: './catalogue-page.component.html',
  styleUrls: ['./catalogue-page.component.css']
})
export class CataloguesPageComponent implements OnInit {
  disabled = false
  catalogues = []
  
  constructor(private CatalogueService: CatalogueService,
    private applicationService: ApplicationService) { }

  ngOnInit() {
    this.CatalogueService.fetch().subscribe(response => {
      this.catalogues = response
    }, err => {
      console.log(err)
    })
  }

  deploy(cat){
    if (this.disabled === true) {
      return
    }
    const answer = this.applicationService.add(cat).subscribe(response => {
      this.disabled=true
      MaterialService.toast(`Application deployment has been started`)
      this.applicationService.deploy(response).subscribe(ans => {
        this.disabled=false
      }, err => {
        console.log(err)
        MaterialService.toast(`Something went wrong`)
      })
    }, err => {
      console.log(err)
      MaterialService.toast(`Something went wrong`)    })
  }
}