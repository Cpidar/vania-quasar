<template>
    <div class="container">
      <div class="month">
          <h2 class="monthname">فروردین</h2>
      </div>
      <section class="week">
          <div class="weekday">شنبه</div>
          <div class="weekday">یکشنبه</div>
          <div class="weekday">دوشنبه</div>
          <div class="weekday">سه شنبه</div>
          <div class="weekday">چهارشنبه</div>
          <div class="weekday">پنج شنبه</div>
          <div class="weekday">جمعه</div>
          <div><span>1</span></div>
          <div><span>2</span></div>
          <div><span>3</span></div>
          <div><span>4</span></div>
          <div><span>5</span></div>
          <div><span>6</span></div>
          <div><span>7</span></div>
      </section>
      <div class="circle">
          <h5 class="date">{{getCurrent}}</h5>
          <h3 class="circlename">:</h3>
          <div></div>
      </div>
      <!-- <q-carousel ref="carousolCal" class="text-white" infinite arrows @slide="changeMonthSlide"  v-model="slide"> -->
        <!-- <q-carousel-slide class="bg-primary" v-for="(month) of monthList" :key="month"> -->
          <!-- <Calendar :current="month" v-if="(index - slide) < 2 && (index - slide) > -2"/> -->
        <!-- </q-carousel-slide> -->
      <!-- </q-carousel> -->
    </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  computed: {
    getCurrent () {
      return this.monthList[this.slide]
    }
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    // this.$nextTick(() => { this.slide = this.$ref.mySw.activeIndex })
  },
  methods: {
    changeMonthSlide (s, d) {
      // if (d === 'next') {
      //   const next = this. slide - 1;
      //   this.monthList[(next > -1 ? next : 2)] = '1397-10-01'
      //   this.current.push('1397-12-01')
      //   if (this.current.length >= 1) {
      //     this.current.shift()
      //   }
      // } else {
      //   this.current.unshift('1397-08-01')
      //   if (this.current.length >= 1) {
      //     this.current.pop()
      //   }
      // }
    },
    currentSlide () {
      this.slide = 20
    },
    monthChange () {
      console.log(this.$refs.mySw.swiper.activeIndex)
      this.$nextTick(() => { this.slide = this.$refs.mySw.swiper.activeIndex })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('../main.scss');
.container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
  justify-content: stretch;
  align-content: center;
}

.month {
  margin-top: 2%;
  height: 5vh;
  right: 1%;
  position: relative;
}

.monthname {
  margin: 0;
  font-family: "Iransans-bold";
  font-size: 18px;
}

.week {
  display: grid;
  grid: repeat(2, 1fr) / repeat(7, 1fr);
  width: var(--calendar-width);
  height: var(--calendar-height) + 5 * 10px;
  grid-column-gap: 0;
  justify-items: center;
  font-size: 15px;
  padding-right: 3%;
  margin-left: 1%;
  font-family: "Iransans-medium";
  margin-bottom: 5vh;
}

.weekday {
  font-size: 12px;
}

.span {
  width: 80%;
  height: 80%;
  align-self: center;
}

.circle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* display: inline-block;
    position: relative; */
  border-radius: 50%;
  width: 80vmin;
  height: 80vmin;
  /* padding: 50% 0; */
  background: #6cc4d9;
  line-height: 0;
  text-align: center;
  /* position: relative; */
  align-self: center;
}

.date {
  text-align: center;
}
</style>
