import dayjs from 'dayjs';

export const formartAdvance = advance => {
  const advTerms = [];
  advance.forEach(it => {
    if (!it.operator.length && it.isConfig === 0) {
      this.$message.warning('操作符不能为空！！！');
      return;
    }
    switch (it.type) {
      case 'text':
        if ([1, 2].includes(it.isConfig)) {
          // 是否为字典项: 0否，1是配置项，2是固定值
          advTerms.push({ field: it.field, operator: 'in', value: it.value || [] });
        } else {
          if (it.operatorList.length === 0) return;
          const { sql } = it.operatorList.find(oper => oper.value === it.operator);
          if (['contain', 'noContain'].includes(it.operator)) {
            advTerms.push({ field: it.field, operator: sql, value: `%${it.value}%` });
          } else if (['isStart', 'isNoStart'].includes(it.operator)) {
            advTerms.push({ field: it.field, operator: sql, value: `${it.value}%` });
          } else if (['isEnd', 'isNoEnd'].includes(it.operator)) {
            advTerms.push({ field: it.field, operator: sql, value: `%${it.value}` });
          } else {
            // 空 或 非空
            advTerms.push({ field: it.field, operator: it.operator, value: '' });
          }
        }
        break;
      case 'date':
        if (it.operator === 'between') {
          if (it.timeType === 'year') {
            advTerms.push({ field: it.field, operator: 'gte', value: it.between.start });
            advTerms.push({ field: it.field, operator: 'lte', value: it.between.end });
          } else {
            advTerms.push({ field: it.field, operator: 'gte', value: it.value[0] });
            advTerms.push({ field: it.field, operator: 'lte', value: it.value[1] });
          }
        } else if (it.operator === 'noBetween') {
          if (it.timeType === 'year') {
            advTerms.push({ field: it.field, operator: 'gte', value: it.between.end });
            advTerms.push({ field: it.field, operator: 'lte', value: it.between.start });
          } else {
            advTerms.push({ field: it.field, operator: 'lte', value: it.value[0] });
            advTerms.push({ field: it.field, operator: 'gte', value: it.value[1] });
          }
        } else {
          // 空 或 非空
          advTerms.push({ field: it.field, operator: it.operator, value: it.value ? dayjs(it.value).format('YYYY-MM-DD') : '' });
        }
        break;
      case 'number':
        if (it.operator === 'between') {
          advTerms.push({ field: it.field, operator: 'gte', value: Math.min(it.between.start, it.between.end) });
          advTerms.push({ field: it.field, operator: 'lte', value: Math.max(it.between.start, it.between.end) });
        } else if (it.operator === 'noBetween') {
          advTerms.push({ field: it.field, operator: 'gte', value: Math.max(it.between.start, it.between.end) });
          advTerms.push({ field: it.field, operator: 'lte', value: Math.min(it.between.start, it.between.end) });
        } else {
          // 空 或 非空
          advTerms.push({ field: it.field, operator: it.operator, value: it.value });
        }
        break;
      default:
        break;
    }
  });
  return advTerms;
};
