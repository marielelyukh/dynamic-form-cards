import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MockBackendInterceptor} from "./shared/mock-backend/mock-backend.interceptor";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormComponent} from "./components/form/form.component";
import {ReactiveFormsModule} from '@angular/forms';
import {ValidationMessageDirective} from "./directives/tooltip.directive";
import {AutocompleteDirective} from "./directives/autocomplete.directive";

@NgModule({
  declarations: [AppComponent, FormComponent, ValidationMessageDirective, AutocompleteDirective],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
