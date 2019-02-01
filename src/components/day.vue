<template>
  <div
    :class="{
            day: true,
            today: today,
            select: date == selectedDay,
            'period-pr': eventType.cycle  === 'period-pr',
            'period-start-pr': eventType.cycle === 'period-start-pr',
            'period-end-pr': eventType.cycle ==='period-end-pr',
            'has-note': hasNote
        }"
    @click="selectDay"
    :value="date"
  >
    <span style="pointer-events: none;" :class="{inactive: inactive}">
      <slot></slot>
    </span>
  </div>
</template>

<script>
import { Vue, Component, Prop, Model, Emit } from 'vue-property-decorator'
import { dispatch } from '../state'

@Component({})
export default class Day extends Vue {
  @Prop({ type: String, required: true }) date
  @Prop({ type: Boolean, default: false }) today
  @Prop({default: () => ({ cycle: '', events: [] })}) eventType
  @Prop() inactive
  events = {cycle: '', events: []}
  // v-model for class select
  @Model('select', {type: String}) selectedDay

  // @Watch('eventType')
  // getEv(val) {
  //   console.log(val)
  //   // this.events = Object.assign(this.events, val)
  // }

  get hasNote() {
    // return this.eventType.event.indexOf('MIS') !== -1
  }

  @Emit('select')
  selectDay(ev) {
    dispatch('selectDay', { selectedDay: ev.target.getAttribute('value'), events: this.eventType })
    return ev.target.getAttribute('value')
  }
}
</script>

<style lang="scss" scoped>
@import url("../main.scss");

.day {
  width: (100% / 7.2);
  height: var(--cell-height);
  text-align: center;
  line-height: var(--cell-height);
}

.day > span {
  pointer-events: none;
}

.today > span {
  display: block;
  box-sizing: border-box;
  width: var(--cell-height);
  height: var(--cell-height);
  border-radius: 50%;
  border: 1px solid #b30d34;
  color: #b30d34;
  margin: auto;
}

.inactive {
  opacity: 0.5;
}

.select > span {
  display: block;
  width: var(--cell-height);
  height: var(--cell-height);
  border-radius: 50%;
  background-color: #eb4986;
  color: white;
  margin: auto;
}

.period-pr {
  border-top: 2.5px solid #6cc4d9;
  border-bottom: 2.5px solid #6cc4d9;
  // color: white;
}

.has-note {
  position: relative;
}

// .has-note::before {
//   content: "\f004";
//   font-family: "FontAwesome";
//   font-style: normal;
//   font-weight: normal;
//   text-decoration: inherit;
//   font-size: 10px;
//   display: block;
//   position: absolute;
//   top: -10%;
//   right: 70%;
//   bottom: 0;
//   width: 10px;
//   height: 10px;
//   color: #6cc4d9;
//   /* background-color: #865FC1;
//     border-radius: 50%; */
// }
.has-note::after {
  content: "";
  display: block;
  position: absolute;
  top: 70%;
  right: calc(50% - 5px);
  bottom: 0;
  width: 10px;
  height: 10px;
  background-color: #865fc1;
  border-radius: 50%;
}

.period-start-pr {
  @extend .period-pr;
  border-left: 2.5px solid #6cc4d9;
  border-radius: var(--cell-height) 0 0 var(--cell-height);
}

.period-end-pr {
  @extend .period-pr;
  border-right: 2.5px solid #6cc4d9;
  border-radius: 0 var(--cell-height) var(--cell-height) 0;
}
</style>
