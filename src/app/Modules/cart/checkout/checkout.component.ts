import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../Shared/Services/cart/cart.service';
import { ApiService } from 'src/app/Shared/Services/api/api.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private router: Router,
    private api: ApiService,
    private spinner:NgxSpinnerService
  ) {}
  grandTotal = 0;
  userAddresses: any;
  delivery_address_id: any;
  billing_address_id: any;
  paymentStatus = 'W4YV_pkH7OAkvZO4P1gbzA==';
  orderStatus = 'W4YV_pkH7OAkvZO4P1gbzA==';
  orderObj: any;
  cartData: any[] = [];
  product: any;

  ngOnInit(): void {
    this.cartService.cartSubTotal.subscribe((res) => (this.grandTotal = res));
    this.api.getUserDetails().subscribe((res) => {
      this.userAddresses = res.data.addresses;
    });
    let cart = JSON.parse(localStorage.getItem('Cart'))
    
    let userName = JSON.parse(localStorage.getItem('userName'))
    if(cart && userName){
      let userCart = cart.find((user)=>user.username==userName)
      if(userCart){
        console.log(userCart,"usercart")
        console.log(userName,"username")
        console.log(cart,"cart")
        userCart.items.map((cartItems:any)=>{
          let cartProductObj = {
            product_id: cartItems.id,
             product_name: cartItems.title,
             qty: cartItems.quantityCount,
             product_amount: cartItems.amount,
             discount_type: 2,
             discount_amount: 10
         }
         this.cartData.push(cartProductObj)
        })
       console.log(this.cartData,"thiscartatadtaduy")
      
      }

    }
    // this.api.getCartData().subscribe((res) => {
    //   let cart: any = res;
    //   let userMatchedCart = cart.filter((res: any) => res.userId == this.api.userId);
    //   // let cartId = userMatchedCart[0].id;
    //   let cartArray = userMatchedCart[0].cart
    //   console.log(res,"checkout");
    //   console.log(cartArray,"cartArray");
    //   cartArray.map((res: any) => {
    //     this.product = {
    //       product_id: cartArray[0].id,
    //       product_name: cartArray[0].title,
    //       qty: cartArray[0].quantityCount,
    //       product_amount: cartArray[0].amount,
    //       discount_type: 2,
    //       discount_amount: 1,
    //     };
    //     this.cartData.push(this.product);
    //     console.log(this.cartData, 'this.cartdaratara');
    //   });

    // });
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }
  cancelOrder() {
    if (confirm('Are you sure you want to cancel the order?')) {
      // this.cartService.cartBehaviour.next([]);
      // this.cartService.cartGrandTotal.next(0);
      this.router.navigate(['']);
    }
  }
  onAddress(id: number) {
    this.api.encryption(id).subscribe((res: any) => {
      this.delivery_address_id = res.data;
      this.billing_address_id = res.data;
    });
  }
  placeOrder() {
  
    if (this.delivery_address_id && this.billing_address_id) {
      this.cartService.cartSubTotal.subscribe((res) => {
        this.grandTotal = res;});
        this.orderObj = {
          order_date: this.date(),
          special_note: 'Special note',
          estimate_delivery_date: this.date(),
          sub_total: this.grandTotal,
          tax_amount: 20,
          discount_amount: 5,
          total_amount:
            this.grandTotal < 10 ? this.grandTotal : this.grandTotal - 5,
          paid_amount:
            this.grandTotal < 10 ? this.grandTotal : this.grandTotal - 5,
          payment_type: 2,
          order_products: this.cartData,
        };
      this.api
      .addOrder(
        this.orderObj,
        this.billing_address_id,
        this.delivery_address_id,
        this.orderStatus,
        this.paymentStatus
      )
      .subscribe(
        (res) => {
          console.log('response', res);
          if(confirm("are you sure you want to place order?")){
            let userName = JSON.parse(localStorage.getItem('userName'))
            if(userName){
            this.cartService.Delete_User_Cart_LocalStorage(userName)
            this.router.navigate(['/cart/myCart/checkout/order-placed']);
      
            }
    
          }
    
        },
        (err) => {
          console.log('errr', err);
        }
      );
     
    } else {
      alert('please select delivery address');
    }
  }
  date() {
    let date = new Date();
    var getYear = date.toLocaleString('default', { year: 'numeric' });
    var getMonth = date.toLocaleString('default', { month: '2-digit' });
    var getDay = date.toLocaleString('default', { day: '2-digit' });
    var dateFormat = getYear + '-' + getMonth + '-' + getDay;
    return dateFormat;
  }
}
