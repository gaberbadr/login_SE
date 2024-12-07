import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/survices/cart.service';
import { ProductService } from 'src/app/survices/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productlist:product[]=[];//contain data api
  loading=false;
  term:string=''; //for pipe search
  pages:number=0;//number of pages
  products: product[][] = []; //intialize two two-dimensional array to veiw set of product in every page
  next_prev:number=0;
  
    constructor(private _ProductService: ProductService,
      private _CartService:CartService,
      private toastr: ToastrService
    ) { }
  
  
    ngOnInit(): void {
      this.allproduct();
    }

allproduct(){
  this.loading = true;
  this._ProductService.getAllProducts().subscribe({
    next: (res) => {
      this.productlist = res.data; //contain data
       this.pages = Math.ceil(this.productlist.length / 10); 

      for (let i = 0; i < this.pages; i++) {
        const start = i * 10;
        const end = start + 10;
        this.products.push(this.productlist.slice(start, end)); //add 10 by 10 arryas of objects in this array [[],[],[],[]]   
      }

      this.loading = false;
    },
    error: (err) => {
      console.log(err);
      this.loading = false;
    },
  });
}

next(){
  if(this.next_prev<this.pages-1)
{  this.next_prev++;}
}
prev(){
  if(this.next_prev>0)
  {this.next_prev--;}
}

addProductToCart(id:string){
  this._CartService.addToCart(id).subscribe({
    next:(res)=>{
      this.toastr.success(res.message);
      this._CartService.countOfCart.next(res.numOfCartItems)
    },
    error:(err)=>{console.log(err)}
  })

}
}
