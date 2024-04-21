import { Module } from '@nestjs/common';
import { SubscriptionRepository } from '@/subscribe/subscription.repository';
import { PrismaService } from '@/libs/database/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, SubscriptionRepository],
  exports: [SubscriptionRepository],
})
export class SubscribeModule {}
