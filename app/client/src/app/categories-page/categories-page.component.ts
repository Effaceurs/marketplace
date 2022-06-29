import { Component, OnInit } from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";
import { CategoriesService } from "../shared/services/categories.service";
import { MaterialService } from "../shared/classes/material.service"

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {
  disabled = false
  categories = []
  
  constructor(private categoriesService: CategoriesService,
    private applicationService: ApplicationService) { }

  ngOnInit() {
    this.categoriesService.fetch().subscribe(response => {
      this.categories = response
    }, err => {
      console.log(err)
    })
  }

  createNewApp(cat){
    if (this.disabled === true) {
      return
    }
    const answer = this.applicationService.add(cat).subscribe(response => {
      this.disabled=true
      MaterialService.toast(`Application ${response.name} has been added`)
      this.applicationService.startDeploy(response).subscribe(ans => {
        MaterialService.toast(`Deployment has finished`)
        this.disabled=false
      }, err => {
        console.log(err)
        MaterialService.toast(`Something went wrong with app deployment`)
      })
    }, err => {
      console.log(err)
      MaterialService.toast(`something went wrong with placing order`)
    })
  }

  createNewAppTerraform(app){
    if (this.disabled === true) {
      return
    }
    app.terraform = true
  try {
    this.applicationService.add(app).subscribe(response => {
      console.log(response)
      MaterialService.toast(`Application ${response.name} has been added`)
    })
    this.applicationService.startDeployTerraform(app).subscribe(response => {
      console.log(response)
      MaterialService.toast(`Deployment of ${response.name} has started`)
    })
  }
  catch (err) {
    console.log(err)
  }
  }
}
