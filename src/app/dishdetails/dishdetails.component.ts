import { Component, OnInit , Input, ViewChild , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;

  @Input()
  dish: Dish;

  errorMsg: String;

  dishIds: string[];
  prev: string;
  next: string;


  formErrors = {
    'auther': '',
    'comment': ''
  };

  validationMessages = {
    'auther': {
      'required':      'Auther Name is required.',
      'minlength':     'Auther Name must be at least 2 characters long.',
      'maxlength':     'Auther cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
    },
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, 
    private fb: FormBuilder,
    @Inject('BaseURL') private baseURL) {
     }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.dishservice.getDish(id).subscribe(dish => this.dish = dish, errorMsg => this.errorMsg = <any>errorMsg);
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds, errorMsg => this.errorMsg = <any>errorMsg);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },  errorMsg => this.errorMsg = <any>errorMsg);
    this.createForm();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.comment.date = new Date().toString();
    this.dish.comments.push(this.comment);
    this.commentForm.reset(
      {
        rating: 5,
      }
    );
  }

  createForm(){

    this.commentForm = this.fb.group({
      auther: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: 5,
      comment: ['', Validators.required],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
