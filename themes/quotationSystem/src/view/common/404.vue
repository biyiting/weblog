<template>
  <div>{{ label }}</div>
</template>

<script>
export default {
  data() {
    return {
      label: '404',
    };
  },
};
</script>

<style lang="less" scoped>
@c: pink;
div {
  color: @c;
}
</style>
