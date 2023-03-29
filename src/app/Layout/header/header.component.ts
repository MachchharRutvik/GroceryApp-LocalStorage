import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../Shared/Services/products/products.service';
import {  Router } from '@angular/router';
import { CartService } from '../../Shared/Services/cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  constructor(private service:ProductsService,private router:Router,private cartService:CartService) { }

  ngOnInit(): void {
// console.log(this.uniqueCategories)
// this.cartService.cartSubject.subscribe(res=>{
// this.cartProducts = res;
// console.log("header",this.cartProducts)
// this.itemCount = this.cartProducts.length;
// console.log("item",this.itemCount)

// })
 this.cartService.grandTotal$.subscribe((res)=>{
  this.cartTotal = res;
})
this.cartService.cartItems$.subscribe((res)=>{
  const cartValue = res;
  this.itemCount = cartValue.length;
  
})
console.log(this.cartTotal);
  }
  cartTotal:any = 0;
  itemCount:any;
  cartProducts:any
  products=this.service.groceryList;
  categories = this.service.getCategories();
  searchItem:any ;
  category:any="All";

  onSubmit(event: any){
    event.preventDefault();
    const value = this.searchItem;
    // console.log(value);
    
    if(value){
      this.router.navigate(['./catalogue/search',this.category,value]);
    }
  }

  onSelectCategory(event: any){
    this.category =event.target.value;
    // console.log(this.category);
    // if(this.category){
    //   this.router.navigate(['categories',this.category]);
    // }
  }
  }

