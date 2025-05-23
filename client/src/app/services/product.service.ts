import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { map, of, take } from 'rxjs';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from '../utils/paginationHelper';
import { ProductParams } from '../models/productParams';
import { Product } from '../models/product';
import { environment } from '../../env/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl
  user: User | undefined
  productCache = new Map();
  productParams: ProductParams | undefined

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user
        }
      }
    })
  }

  getProducts(ProductParams: ProductParams) {
    const response = this.productCache.get(Object.values(ProductParams).join('-'))
    if (response) return of(response)

    let params = getPaginationHeaders(ProductParams.pageNumber, ProductParams.pageSize);

    params = params.append('category', ProductParams.category)
    params = params.append('producer', ProductParams.producer)
    params = params.append('minPrice', ProductParams.minPrice)
    params = params.append('maxPrice', ProductParams.maxPrice)

    return getPaginatedResult<Product[]>(this.baseUrl + 'products', params, this.http).pipe(
      map(response => {
        this.productCache.set(Object.values(ProductParams).join('-'), response)
        return response
      })
    )
  }
  
  /* TODO
   * change thist to querry i guess
   */
  getProduct(productId: string) {
    const product = [...this.productCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((product: Product) => product.productId === productId)

    if (product) return of(product)
    //console.log(member)
    return this.http.get<Product>(this.baseUrl + 'products/' + productId)
  }
}
