import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  featuredLeader: Leader;
  dishErrMess: String;
  promotionErrMess: String;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private baseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dishes => this.dish = dishes, dishErrMess => this.dishErrMess=dishErrMess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, promotionErrMess => this.promotionErrMess=promotionErrMess);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.featuredLeader = leader, leaderErrMess => this.leaderErrMess=leaderErrMess);
  }


}
