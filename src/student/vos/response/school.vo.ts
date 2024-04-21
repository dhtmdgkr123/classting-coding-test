import { SchoolVo as SchoolResponseVo } from '@/school/vos/response/school.vo';
import { PickType } from '@nestjs/swagger';

export class SchoolVo extends PickType(SchoolResponseVo, [
  'id',
  'name',
  'region',
]) {
  constructor(model: SchoolVo) {
    super();
    Object.assign(this, model);
  }
}
