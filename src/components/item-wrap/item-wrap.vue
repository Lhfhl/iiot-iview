
<template>
  <dv-border-box-13 class="lr_titles">
    <div class="item_title" v-if="title !== ''">
      <div class="zuo"></div>
      <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
      <div class="you"></div>
    </div>
    <div
      :class="title !== '' ? 'item_title_content' : 'item_title_content_def'"
    >
      <slot></slot>
    </div>
  </dv-border-box-13>
</template>

<script>

export default {
  // components: {
  //   loading,
  //   borderBox13,
  //   digitalFlop,
  //   capsuleChart,
  //   borderBox8
  // },
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: () => ''
    }
  },
  created () {},

  mounted () {},
  methods: {}
}
</script>

<style scoped>
.lr_titles {
  box-sizing: border-box;
}

.lr_titles .border-box-content {
  box-sizing: border-box;
  padding: 6px 16px 0px;
}

.lr_titles .item_title {
  height: 38px; /* $item-title-height */
  line-height: 38px; /* $item-title-height */
  width: 100%;
  color: #31abe3;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lr_titles .item_title .zuo,
.lr_titles .item_title .you {
  width: 58px;
  height: 14px;
  background-image: url("../../assets/img/titles/zuo.png");
}

.lr_titles .item_title .you {
  transform: rotate(180deg);
}

.lr_titles .item_title .title-inner {
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(
    92deg,
    #0072ff 0%,
    #00eaff 48.8525390625%,
    #01aaff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lr_titles .item_title_content {
  height: calc(100% - 38px); /* $item_title_content-height */
}

.lr_titles .item_title_content_def {
  width: 100%;
  height: 100%;
}
</style>

</style>
