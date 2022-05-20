import { Component, VERSION } from "@angular/core";
import { JsonBuilder } from "./util/JsonBuilder";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  jsonBuilder: JsonBuilder;
  convertedJson: any;

  constructor() {
    this.jsonBuilder = new JsonBuilder();
  }

  submitQuery() {
    let givenQuery = (<HTMLInputElement>document.getElementById("queryInput"))
      .value;
    try {
      this.convertedJson = JSON.stringify(this.jsonBuilder.buildJson(givenQuery));
    } catch (error) {
      this.convertedJson =
        error.message === "INVALID"
          ? "Please enter valid Query"
          : "Sorry, We're facing temprovery failure";
    }
  }
}
