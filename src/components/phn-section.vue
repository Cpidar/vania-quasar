<template>
  <section class="column items-center gutter-sm">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        class="row no-wrap gutter-xs justify-center"
        key="phn-list"
      >
        <div
          v-for="phn of phnValues"
          :key="phn"
        >
          <img
            :src="'../assets/icons/ic_' + phn + '.png'"
            width="30px"
            height="30px"
          >
        </div>
      </div>
    </transition>
    <phn-modal
      :phn-modal-state="phnModalState"
      @close="phnModalState = false"
      :phn="phn"
      :id="getSelectedDay$"
    />
    <div>
      <q-page-sticky
        position="bottom-right"
        :offset="[18, 18]"
      >
        <q-btn
          round
          icon="add"
          color="primary"
          size="lg"
          @click="phnModalState = true"
        />
      </q-page-sticky>
    </div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { getPHNValuesArray, getSelectedPHN, shortSelectedDay } from '../state/index'

@Component({
  components: {PhnModal: () => import('./phn-modal.vue')},
  subscriptions() {
    return {
      phnValues: getPHNValuesArray,
      phn: getSelectedPHN,
      getSelectedDay$: shortSelectedDay
    }
  }
})
export default class PhnSection extends Vue {
  phnModalState = false
}

</script>

<style lang="scss" scoped>
.phn-grid {
  width: 95%;
  margin: 10px auto;
  display: grid;
  grid: 1fr / 1fr 1fr;
  grid-gap: 10px;
}

.phn-row-span {
  grid-column: 1 / 3;
}
</style>
