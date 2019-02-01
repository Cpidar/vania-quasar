<template>
  <q-dialog
    v-model="showModal"
    prevent-close
    @ok="onOk"
    @cancel="onCancel"
    @show="onShow"
    @hide="onHide"
  >
    <span slot="title" class="q-title q-my-xs">ویرایش دوره ماهانه</span>
    <!-- <span slot="message" class="q-subheading">مدت زمان دوره پریودی و دوره ماهانه خود را وارد نمایید</span> -->
    <div slot="body">
      <q-list class="no-border">
        <q-item class="q-px-none">
          <q-item-main>
            <p class="caption q-my-none">
              طول پریود
            </p>
              <q-slider
                class="dark"
                v-model="periodLen"
                :min="2"
                :max="12"
                label-always
              />
              <p class="q-caption">{{periodHelper}}</p>
          </q-item-main>
        </q-item>
        <q-item class="q-px-none">
          <q-item-main>
            <p class="caption q-my-none">
              طول دوره
            </p>
            <q-slider
              class="dark"
              label-always
              v-model="cycleLen"
              :min="18"
              :max="38"
            />
            <p class="q-caption">{{cycleHelper}}</p>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
    <template
      slot="buttons"
      slot-scope="props"
    >
      <q-btn
        color="negative"
        label="تایید"
        @click="choose(props.ok)"
      />
      <q-btn
        flat
        label="لغو"
        @click="props.cancel"
      />
    </template>
  </q-dialog>

</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
// eslint-disable-next-line no-unused-vars
import { dispatch } from '../state'

@Component({
  data() {
    return {
      periodLen: this.periodLength,
      cycleLen: this.cycleLength
    }
  }
})
export default class PeriodModal extends Vue {
  @Prop({ default: () => 4 }) periodLength
  @Prop({ default: () => 28 }) cycleLength
  @Prop({ default: () => false }) modalState
  cycleHelper = 'تعداد روزهای بین دو سیکل پریودی'
  periodHelper = 'تعداد روز بین شروع و پایان پریودی'

  get showModal() {
    return this.modalState
  }

  set showModal(state) {
    return state
  }

  onOk() {
    console.log(this.periodLen, this.cycleLen)
    dispatch('changePeriod', { periodLength: this.periodLen, cycleLength: this.cycleLen })
  }

  onCancel() {
    this.$emit('close')
  }

  onShow() { }

  onHide() { }

  async choose(okFn) {
    await okFn()
    await this.$emit('close')
    await this.$q.notify(`success`)
  }
}

</script>

<style lang="scss" scoped>
</style>
