<script setup lang="ts">
import {RecentInfoEntry} from "@/ipc/models.ts";
import {recallRecentItem} from "@/ipc/yamaha.ts";

const props = defineProps<{
  recentInfo: RecentInfoEntry[],
  disabled?: boolean,
  deviceId: string
}>()

function recall(idx: number) {
  if (props.disabled) return
  recallRecentItem(props.deviceId, idx + 1)
}

</script>

<template>
  <v-slide-group show-arrows :disabled="disabled">
    <TransitionGroup
      tag="div"
      class="d-flex flex-row"
      name="list"
      appear
    >
      <div
        v-for="(entry, index) in recentInfo"
        :key="entry.input + entry.text + entry.albumart_url"
      >
        <v-slide-group-item>
          <v-img
            class="ma-2"
            width="120"
            :src="entry.albumart_url"
            aspect-ratio="1"
            contain
            :class="{
              'opacity-50': disabled,
              'cursor-pointer': !disabled
            }"
            @click="recall(index)"
          >
            <template #placeholder>
              <div class="fill-height d-flex align-center justify-center">
                <v-icon icon="mdi-music-note-outline" color="grey lighten-2" size="40" />
              </div>
            </template>

            <v-tooltip activator="parent">
              {{ entry.input }} • {{ entry.text }}
            </v-tooltip>
          </v-img>
        </v-slide-group-item>
      </div>
    </TransitionGroup>
  </v-slide-group>
</template>

<style scoped>
.list-move {
  transition: transform .25s ease;
}
</style>
