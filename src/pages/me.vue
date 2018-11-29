<template>
    <div>
        <q-list>
            <q-item>
                <q-item-main>
                    <q-field icon="local_atm" label="طول پریود">
                        <q-slider class="dark" v-model="periodLength" :min="2" :max="12" label-always />
                    </q-field>
                </q-item-main>
            </q-item>
            <q-item>
                <q-item-main>
                <q-field icon="local_atm" label="طول دوره">
                    <q-slider class="dark" v-model="cycleLength" :min="18" :max="38" label-always />
                </q-field>
                </q-item-main>
            </q-item>
            <q-item>
                <q-item-main>
                    <q-item-tile label>قفل ورود</q-item-tile>
                </q-item-main>
                <q-item-side right>
                    <q-toggle v-model="lock" />
                </q-item-side>
            </q-item>
        </q-list>
        <cbtn />
        <cbtn />

    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { model$ } from '../state'
import { pluck } from 'rxjs/operators'
import cbtn from '../components/circle-button.vue'

@Component({
  components: {cbtn}
})
export default class Me extends Vue {
    periodLength = 5;
    cycleLength = 28;
    lock = false;

    beforeCreate () {
      this.$subscribeTo(model$.pipe(pluck('period')),
        (p) => {
          this.periodLength = p.periodLength
          this.cycleLength = p.cylceLength
        })
    }
}
</script>

<style lang="sass">

</style>
