// System
import { Module, DynamicModule } from '@nestjs/common';
// This module
import { IOSystemService } from './io-system.service';
import { IOSystemModuleOptions } from './interfaces';
import { IO_SYSTEM_OPTIONS } from './constants';


@Module({})
export class IOSystemModule {
  
  static forRoot(options: IOSystemModuleOptions): DynamicModule {
    return {
      module: IOSystemModule,
      providers: [
        {
          provide: IO_SYSTEM_OPTIONS,
          useValue: options,
        },
        IOSystemService,
      ],
      exports: [IOSystemService],
      global: true,
    };
  }
}

