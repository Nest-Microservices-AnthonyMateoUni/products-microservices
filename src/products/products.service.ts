import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 100 } = paginationDto;

    const totalpage = await this.product.count({ where: { avaialable: true } });
    const lastPage = Math.ceil(totalpage / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit, // Skips previous pages
        take: limit, // Limits the number of records on this
        where: {
          avaialable: true,
        },
      }),
      meta: {
        total: totalpage,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, avaialable: true },
    });

    if (!product) {
      throw new NotFoundException(`Porduct with id ${id} Not Found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // return `This action returns a #${id} product`;

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.product.delete({
    //   where: { id },
    // });

    const product = await this.product.update({
      where: { id },
      data: {
        avaialable: false,
      },
    });

    return product;
  }
}
