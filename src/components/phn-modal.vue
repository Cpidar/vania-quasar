<template>
    <q-modal v-model="showModal">
        <q-modal-layout>
            <div class="layout-padding">
                <q-list>
                    <h6>خونریزی</h6>
                    <q-item>
                        <div class="bleed-container">
                            <iRadio checked-icon="../assets/icons/ic_mf_l_c.png" unchecked-icon="../assets/icons/ic_mf_l_l.png" value="high" v-model="bleedState" />
                            <iRadio checked-icon="../assets/icons/ic_mf_m_c.png" unchecked-icon="../assets/icons/ic_mf_m_l.png" value="medium" v-model="bleedState" />
                            <iRadio checked-icon="../assets/icons/ic_mf_s_c.png" unchecked-icon="../assets/icons/ic_mf_s_l.png" value="low" v-model="bleedState" />
                            <iRadio checked-icon="../assets/icons/ic_mf_xs_c.png" unchecked-icon="../assets/icons/ic_mf_xs_l.png" value="lower" v-model="bleedState" />
                        </div>
                    </q-item>
                    <q-item-separator />
                    <h6>مود</h6>
                    <q-item>
                        <div class="bleed-container">
                            <iCheckbox checked-icon="../assets/icons/ic_mood_angry_c.png" unchecked-icon="../assets/icons/ic_mood_angry.png" value="angry" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_anxious_c.png" unchecked-icon="../assets/icons/ic_mood_anxious.png" value="anxious" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_frisky_c.png" unchecked-icon="../assets/icons/ic_mood_frisky.png" value="frisky" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_happy_c.png" unchecked-icon="../assets/icons/ic_mood_happy.png" value="happy" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_lonely_c.png" unchecked-icon="../assets/icons/ic_mood_lonely.png" value="lonely" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_normal_c.png" unchecked-icon="../assets/icons/ic_mood_normal.png" value="normal" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_painicky_c.png" unchecked-icon="../assets/icons/ic_mood_painicky.png" value="painicky" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_sad_c.png" unchecked-icon="../assets/icons/ic_mood_sad.png" value="sad" v-model="moodState" />
                            <iCheckbox checked-icon="../assets/icons/ic_mood_sensitive_c.png" unchecked-icon="../assets/icons/ic_mood_sensitive.png" value="sensitive" v-model="moodState" />
                        </div>
                    </q-item>
                    <q-item-separator />
                    <h6>درد</h6>
                    <q-item>
                        <div class="bleed-container">
                            <iCheckbox checked-icon="../assets/icons/ic_symptom_ok_c.png" unchecked-icon="../assets/icons/ic_symptom_ok.png" value="ok" v-model="syptomState" />
                            <iCheckbox checked-icon="../assets/icons/ic_symptom_acne_c.png" unchecked-icon="../assets/icons/ic_symptom_acne.png" value="acne" v-model="syptomState" />
                            <iCheckbox checked-icon="../assets/icons/ic_symptom_breast_tenderness_c.png" unchecked-icon="../assets/icons/ic_symptom_breast_tenderness.png" value="breastTenderness" v-model="syptomState" />
                            <iCheckbox checked-icon="../assets/icons/ic_symptom_colic_c.png" unchecked-icon="../assets/icons/ic_symptom_colic.png" value="colic" v-model="syptomState" />
                            <iCheckbox checked-icon="../assets/icons/ic_symptom_headache_c.png" unchecked-icon="../assets/icons/ic_symptom_headache.png" value="headache" v-model="syptomState" />
                        </div>
                    </q-item>
                    <q-item-separator />
                    <h6>نزدیکی</h6>
                    <q-item>
                        <div class="bleed-container">
                            <iRadio checked-icon="../assets/icons/ic_sex_no_c.png" unchecked-icon="../assets/icons/ic_sex_no.png" value="nosex" v-model="sexState" />
                            <iRadio checked-icon="../assets/icons/ic_sex_unprotect_c.png" unchecked-icon="../assets/icons/ic_sex_unprotect.png" value="noprotect" v-model="sexState" />
                            <iRadio checked-icon="../assets/icons/ic_sex_protect_c.png" unchecked-icon="../assets/icons/ic_sex_protect.png" value="protect" v-model="sexState" />
                        </div>
                    </q-item>
                </q-list>
                <q-btn color="primary" @click="close" label="Close" />
            </div>
        </q-modal-layout>
    </q-modal>
</template>

<script>
import iCheckbox from './custom-checkbox.vue'
import iRadio from './custom-radio.vue'
import { putToDB } from '../events/event.js'

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
    date: {
      type: String
    }
  },
  data () {
    return {
      bleedDialogState: false,
      bleedState: '',
      sexState: '',
      syptomState: [],
      moodState: []
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
      putToDB({
        _id: 'PHN' + this.$props.date,
        bleedState: this.$data.bleedState,
        sexState: this.$data.sexState,
        symptomState: this.$data.symptomState,
        moodState: this.$data.moodState
      }).then((res) => {
        if(res.ok) this.$q.notify('ok')
      )
      this.showModal = false
      this.$emit('close')
    }
  }
}
</script>

<style>
.bleed-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-y: scroll;
}
</style>
