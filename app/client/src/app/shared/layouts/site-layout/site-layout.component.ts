import { AfterViewInit, Component} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-site-layout",
  templateUrl: "./site-layout.component.html",
  styleUrls: ["./site-layout.component.css"],
})
export class SiteLayoutComponent implements AfterViewInit {


  links = [
    { url: "/myapps", name: "My Applications" },
    { url: "/catalogue", name: "Catalogue" }
    ];

  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
