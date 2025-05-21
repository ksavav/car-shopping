export interface Product{
    name: string
    productId: string
    productCode: string
    producer: string
    regularPrice: number
    actualPrice: number
    category: string
    quantity: number
    substitutes: string[]
    photo?: string
}
