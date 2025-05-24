import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

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
  @Output() showSettings = new EventEmitter<boolean>();

  loginFormGroup!: FormGroup;
  
  constructor(private fb: FormBuilder, private router: Router, public accountService: AccountService) { }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login(): void {
    if (this.loginFormGroup.valid) {
      this.accountService.login(this.loginFormGroup.value).subscribe(
        () => this.showSettings.emit(false)
      )
    }
  }

  logout(): void {
      this.accountService.logout();
      this.router.navigateByUrl('/home');
      this.showSettings.emit(false);
  } 
}
