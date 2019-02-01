<template>
  <section>
    <dl class="q-my-md">
      <dd
        v-for="(ev, id) of event.events"
        :key="id"
        class="text-center"
      ><span class="q-body-2">{{ev}}</span></dd>
    </dl>
  </section>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class EventSection extends Vue {
  @Prop({ default: () => ({ events: [] }) }) event
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
