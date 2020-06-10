import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Invalid customer');
    }
    const realProducts = await this.productsRepository.findAllById(
      products.map(product => ({ id: product.id })),
    );
    if (products.length !== realProducts.length) {
      throw new AppError('Invalid Products');
    }
    const parsedProducts = realProducts.map((realProduct, idx) => {
      const { id, ...rest } = realProduct;
      const orderQuantity = products[idx].quantity;
      return { ...rest, product_id: id, quantity: orderQuantity };
    });
    const updatedQuantities = realProducts.map((realProduct, idx) => {
      const { quantity } = realProduct;
      const orderQuantity = products[idx].quantity;
      const updatedQuantity = quantity - orderQuantity;
      if (updatedQuantity < 0) {
        throw new AppError('Insufficient quantity');
      }
      return { id: products[idx].id, quantity: updatedQuantity };
    });
    await this.productsRepository.updateQuantity(updatedQuantities);
    const newOrder = await this.ordersRepository.create({
      customer,
      products: parsedProducts,
    });
    return newOrder;
  }
}

export default CreateOrderService;
