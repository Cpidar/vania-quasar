<template>
  <q-modal v-model="showModal">
    <q-modal-layout>
      <div>
        <q-list>
          <div class="q-subheading q-px-sm">میزان خونریزی</div>
          <q-item>
            <div class="row no-wrap gutter-xs">
              <iRadio unchecked-icon="../assets/icons/ic_mf_l.png" value="mf_l" v-model="phn.bleedState" styled bg-color="#88022f" />
              <iRadio unchecked-icon="../assets/icons/ic_mf_m.png" value="mf_m" v-model="phn.bleedState" styled bg-color="#88022f" />
              <iRadio unchecked-icon="../assets/icons/ic_mf_s.png" value="mf_s" v-model="phn.bleedState" styled bg-color="#88022f" />
              <iRadio unchecked-icon="../assets/icons/ic_mf_xs.png" value="mf_xs" v-model="phn.bleedState" styled bg-color="#88022f" />
            </div>
          </q-item>
          <q-item-separator />
          <div class="q-subheading q-px-sm">حالت روحی</div>
          <q-item>
            <div class="row no-wrap gutter-xs scroll">
              <iCheckbox checked-icon="../assets/icons/ic_mood_angry_c.png" unchecked-icon="../assets/icons/ic_mood_angry.png" value="mood_angry" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_anxious_c.png" unchecked-icon="../assets/icons/ic_mood_anxious.png" value="mood_anxious" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_frisky_c.png" unchecked-icon="../assets/icons/ic_mood_frisky.png" value="mood_frisky" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_happy_c.png" unchecked-icon="../assets/icons/ic_mood_happy.png" value="mood_happy" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_lonely_c.png" unchecked-icon="../assets/icons/ic_mood_lonely.png" value="mood_lonely" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_normal_c.png" unchecked-icon="../assets/icons/ic_mood_normal.png" value="mood_normal" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_painicky_c.png" unchecked-icon="../assets/icons/ic_mood_painicky.png" value="mood_painicky" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_sad_c.png" unchecked-icon="../assets/icons/ic_mood_sad.png" value="mood_sad" v-model="phn.moodState" />
              <iCheckbox checked-icon="../assets/icons/ic_mood_sensitive_c.png" unchecked-icon="../assets/icons/ic_mood_sensitive.png" value="mood_sensitive" v-model="phn.moodState" />
            </div>
          </q-item>
          <q-item-separator />
          <div class="q-subheading q-px-sm scroll">علائم درد یا بیماری</div>
          <q-item>
            <div class="row no-wrap gutter-xs scroll">
              <iCheckbox checked-icon="../assets/icons/ic_symptom_ok_c.png" unchecked-icon="../assets/icons/ic_symptom_ok.png" value="symptom_ok" v-model="phn.symptomState" />
              <iCheckbox checked-icon="../assets/icons/ic_symptom_acne_c.png" unchecked-icon="../assets/icons/ic_symptom_acne.png" value="symptom_acne" v-model="phn.symptomState" />
              <iCheckbox checked-icon="../assets/icons/ic_symptom_breast_tenderness_c.png" unchecked-icon="../assets/icons/ic_symptom_breast_tenderness.png" value="symptom_breastTenderness" v-model="phn.symptomState" />
              <iCheckbox checked-icon="../assets/icons/ic_symptom_colic_c.png" unchecked-icon="../assets/icons/ic_symptom_colic.png" value="symptom_colic" v-model="phn.symptomState" />
              <iCheckbox checked-icon="../assets/icons/ic_symptom_headache_c.png" unchecked-icon="../assets/icons/ic_symptom_headache.png" value="symptom_headache" v-model="phn.symptomState" />
            </div>
          </q-item>
          <q-item-separator />
          <div class="q-subheading q-px-sm">رابطه جنسی</div>
          <q-item>
            <div class="row no-wrap gutter-xs">
              <iRadio checked-icon="../assets/icons/ic_sex_no_c.png" unchecked-icon="../assets/icons/ic_sex_no.png" value="sex_no" v-model="phn.sexState" />
              <iRadio checked-icon="../assets/icons/ic_sex_unprotect_c.png" unchecked-icon="../assets/icons/ic_sex_unprotect.png" value="sex_unprotect" v-model="phn.sexState" />
              <iRadio checked-icon="../assets/icons/ic_sex_protect_c.png" unchecked-icon="../assets/icons/ic_sex_protect.png" value="sex_protect" v-model="phn.sexState" />
            </div>
          </q-item>
        </q-list>
        <q-btn color="primary" @click="close" label="ثبت" />
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import iCheckbox from './custom-checkbox.vue'
import iRadio from './custom-radio.vue'
import { putToDB } from '../events/event.js'
import { getSelectedDay } from '../state/index.js'

export default {
  components: {
    iCheckbox,
    iRadio
  },
  props: {
    phnModalState: {
      type: Boolean,
      default: false
    },
    phn: {
      type: Object,
      default: () => ({
        bleedState: '',
        sexState: '',
        symptomState: [],
        moodState: []
      })
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      bleedDialogState: false
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.$props.phnModalState
      },
      set: function () {
        this.$props.phnModalState = this.showModal
      }
    }
  },
  methods: {
    close () {
      // this.$subscribeTo(getSelectedDay, (day) => {
      putToDB(this.id, (doc) => {
        doc.bleedState = this.phn.bleedState
        doc.sexState = this.phn.sexState
        doc.symptomState = this.phn.symptomState
        doc.moodState = this.phn.moodState
        return doc
      })
      // )
      this.showModal = false
      this.$emit('close')
    }
  },
  subscription () {
    return {
      getSelectedDay
    }
  }
}
</script>

<style>
/* .bleed-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
} */
/* .bleed-container::-webkit-scrollbar {
  display: none;
} */
</style>
