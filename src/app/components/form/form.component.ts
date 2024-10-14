import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {timer, Subscription, takeWhile, tap} from 'rxjs';
import { Country } from '../../shared/enum/country';
import {CheckUserResponseData, SubmitFormResponseData} from "../../shared/interface/responses";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  isSubmitting: boolean = false;
  timerSubscription!: Subscription;
  countdown: number = 5;
  isTimerActive: boolean = false;
  showTimer = false;
  validCountries: string[] = Object.values(Country);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formGroup = this.fb.group({
      formArray: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addForm();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get formArray(): FormArray {
    return this.formGroup.get('formArray') as FormArray;
  }

  addForm() {
    const formGroup = this.fb.group({
      country: ['', [Validators.required, this.countryValidator.bind(this)]],
      username: ['', [Validators.required]],
      birthday: ['', [Validators.required, this.birthdayValidator]],
    });
    this.formArray.push(formGroup);
  }

  removeForm(index: number) {
    this.formArray.removeAt(index);
  }

  countryValidator(control: any) {
    return this.validCountries.includes(control.value) ? null : { invalidCountry: true };
  }


  birthdayValidator(control: AbstractControl) {
    const currentDate = new Date();
    const birthday = new Date(control.value);
    return birthday > currentDate ? { invalidBirthday: true } : null;
  }

  checkUsernameAvailability(username: string, formIndex: number) {
    this.http.post<CheckUserResponseData>('/api/checkUsername', { username }).subscribe(response => {
      const usernameControl = this.formArray.at(formIndex).get('username');
      if (response.isAvailable) {
        usernameControl?.setErrors(null);
      } else {
        usernameControl?.setErrors({ notAvailable: true });
      }
    });
  }

  startTimer(): void {
    this.isTimerActive = true;
    this.showTimer = true;
    this.isSubmitting = true;

    this.timerSubscription = timer(0, 1000)
      .pipe(
        tap(() => this.countdown--),
        takeWhile(() => this.countdown >= 0)
      )
      .subscribe(() => {
        if (this.countdown === 0) {
          this.submitForms();
          this.showTimer = false;
          this.isTimerActive = false;
        }
      });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.isTimerActive = false;
      this.showTimer = false;
    }
  }

  cancelSubmit(): void {
    this.stopTimer();
    this.countdown = 5;
  }

  get invalidFormsCount(): number {
    return this.formArray.controls.filter(control => control.invalid).length;
  }

  submitForms(): void {
    if (this.formArray.valid) {
      const formsData = this.formArray.getRawValue();

      this.http.post<SubmitFormResponseData>('/api/submitForm', formsData).subscribe(() => {
        this.formArray.clear();
        this.addForm();
        this.stopTimer();
        this.isSubmitting = false;
        this.countdown = 5;
      });
    }
  }
}
