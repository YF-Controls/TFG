// System
import { Module } from '@nestjs/common';
// This module
import { IOSystemService } from './io-system.service';

@Module({
  providers: [IOSystemService],
  exports: [IOSystemService],
})
export class IOSystemModule { }
