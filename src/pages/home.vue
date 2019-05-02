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
      <h5 class="date">{{cycleDayNumber}}</h5>
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
/* eslint-disable no-unused-vars */
import cycleModule from '../lib/cycle'
import { Vue, Component } from 'vue-property-decorator'
import { LocalDate, ChronoUnit } from 'js-joda'
import { saveSymptom, getCycleDaysSortedByDate } from '../db'
import { home as labels, bleedingPrediction as predictLabels, shared } from '../i18n/en/labels'
import { getFertilityStatusForDay } from '../lib/sympto-adapter'

@Component()
export default class Home extends Vue {
  today = LocalDate.now()
  todayDateString = this.today.toString()
  cycleDayNumber = 0
  prediction = 0
  predictionText = ''
  bleedingPredictionRange = ''
  fertilityStatus = {}
  cycleDays = []
  // getBleedingPrediction = cycleModule().getPredictedMenses

  created() {
    // saveSymptom('bleeding', this.today.toString(), { value: 2 })
    // saveSymptom('bleeding', this.today.minusDays(1).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(2).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(3).toString(), { value: 1 })

    // saveSymptom('bleeding', this.today.minusDays(32).toString(), { value: 2 })
    // saveSymptom('bleeding', this.today.minusDays(33).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(34).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(35).toString(), { value: 1 })

    // saveSymptom('bleeding', this.today.minusDays(64).toString(), { value: 2 })
    // saveSymptom('bleeding', this.today.minusDays(65).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(66).toString(), { value: 1 })
    // saveSymptom('bleeding', this.today.minusDays(67).toString(), { value: 1 })

    // saveSymptom('bleeding', this.today.minusDays(98).toString(), { value: 1 })

    // saveSymptom('bleeding', this.today.minusDays(128).toString(), { value: 1 })

    cycleModule().then(day => {
      this.cycleDayNumber = day.getCycleDayNumber(LocalDate.now().toString())
      this.prediction = day.getPredictedMenses()
      this.predictionText = determinePredictionText(this.prediction)
      this.bleedingPredictionRange = getBleedingPredictionRange(this.prediction)
      console.log(day.getPreviousCycle(LocalDate.now().toString()))
    })
    getCycleDaysSortedByDate().then(days => {
      this.cycleDays = days
    })
    getFertilityStatusForDay(this.todayDateString).then(status => {
      console.log(status)
      this.fertilityStatus = status
    })
  }
}

function determinePredictionText(bleedingPrediction) {
  if (!bleedingPrediction.length) return predictLabels.noPrediction
  const todayDate = LocalDate.now()
  const bleedingStart = LocalDate.parse(bleedingPrediction[0][0])
  const bleedingEnd = LocalDate.parse(
    bleedingPrediction[0][bleedingPrediction[0].length - 1]
  )
  if (todayDate.isBefore(bleedingStart)) {
    return predictLabels.predictionInFuture(
      todayDate.until(bleedingStart, ChronoUnit.DAYS),
      todayDate.until(bleedingEnd, ChronoUnit.DAYS)
    )
  }
  if (todayDate.isAfter(bleedingEnd)) {
    return predictLabels.predictionInPast(
      bleedingStart.toString(), bleedingEnd.toString()
    )
  }
  const daysToEnd = todayDate.until(bleedingEnd, ChronoUnit.DAYS)
  if (daysToEnd === 0) {
    return predictLabels.predictionStartedNoDaysLeft
  } else if (daysToEnd === 1) {
    return predictLabels.predictionStarted1DayLeft
  } else {
    return predictLabels.predictionStartedXDaysLeft(daysToEnd)
  }
}

function getBleedingPredictionRange(prediction) {
  if (!prediction.length) return labels.unknown
  const todayDate = LocalDate.now()
  const bleedingStart = LocalDate.parse(prediction[0][0])
  const bleedingEnd = LocalDate.parse(prediction[0][prediction[0].length - 1])
  if (todayDate.isBefore(bleedingStart)) {
    return `${todayDate.until(bleedingStart, ChronoUnit.DAYS)}-${todayDate.until(bleedingEnd, ChronoUnit.DAYS)}`
  }
  if (todayDate.isAfter(bleedingEnd)) {
    return labels.unknown
  }
  return '0'
}
</script>

<style lang="scss" scoped>
@import url("../main.scss");
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
