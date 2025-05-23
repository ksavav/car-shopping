import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [    
    ReactiveFormsModule,
    CommonModule
  ],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ])
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {
  loginFormGroup!: FormGroup;
  
  constructor(private fb: FormBuilder, public accountService: AccountService) { }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(): void {
    console.log("xd")
    if (this.loginFormGroup.valid) {
      console.log(this.loginFormGroup.value)
      this.accountService.login(this.loginFormGroup.value).subscribe()  
    }
  }

  logout(): void {
      this.accountService.logout();
  }
}
