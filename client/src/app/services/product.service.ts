import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { map, of, take } from 'rxjs';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from '../utils/paginationHelper';
import { ProductParams } from '../models/productParams';
import { Product } from '../models/product';
import { environment } from '../../env/environment.development';
import { SearchParams } from '../models/searchParams';

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

  getProducts(productParams: ProductParams) {
    const response = this.productCache.get(Object.values(productParams).join('-'))
    if (response) return of(response)

    let params = getPaginationHeaders(productParams.pageNumber, productParams.pageSize);

    params = params.append('category', productParams.category)
    params = params.append('producer', productParams.producer)
    params = params.append('minPrice', productParams.minPrice)
    params = params.append('maxPrice', productParams.maxPrice)

    return getPaginatedResult<Product[]>(this.baseUrl + 'products', params, this.http).pipe(
      map(response => {
        this.productCache.set(Object.values(productParams).join('-'), response)
        return response
      })
    )
  }

  getProductsSearch(searchParams: SearchParams) {
    const response = this.productCache.get(Object.values(searchParams).join('-'))
    if (response) return of(response)

    let params = getPaginationHeaders(searchParams.pageNumber, searchParams.pageSize);

    params = params.append('category', searchParams.category)
    params = params.append('producer', searchParams.producer)
    params = params.append('minPrice', searchParams.minPrice)
    params = params.append('maxPrice', searchParams.maxPrice)

    return getPaginatedResult<Product[]>(this.baseUrl + 'products', params, this.http).pipe(
      map(response => {
        this.productCache.set(Object.values(searchParams).join('-'), response)
        return response
      })
    )
  }

  getProductsSearchBar(searchTerm: string) {
    const response = this.productCache.get(Object.values(SearchParams).join('-'))
    if (response) return of(response)
      
    let searchParams = getPaginationHeaders(1, 5);
    searchParams = searchParams.append("searchTerm", searchTerm)
    
    return this.http.get<Product[]>(this.baseUrl + 'products/search?' + searchParams)
    // return getPaginatedResult<Product[]>(this.baseUrl + 'products/search', searchParams, this.http).pipe(
    //   map(response => {
    //     this.productCache.set(Object.values(ProductParams).join('-'), response)
    //     return response
    //   })
    // )
  }
  
  getProduct(productId: string) {
    const product = [...this.productCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((product: Product) => product.productId === productId)

    if (product) return of(product)
    //console.log(member)
    return this.http.get<Product>(this.baseUrl + 'products/' + productId)
  }

  getProductsList(productsId: string[]) {
    let products = ""
    productsId.forEach(p => {
      if (products == "") {
        products = p
      }
      else {
        products = products + "+" + p
      }
    });
    return this.http.get<Product[]>(this.baseUrl + 'products/list/' + products)
  }
}
