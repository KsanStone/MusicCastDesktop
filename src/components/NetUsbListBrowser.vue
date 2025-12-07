<script setup lang="ts">
import {ref} from 'vue';
import {controlNetUsbList, getNetUsbListInfo, searchNetUsbList} from "@/ipc/yamaha.ts";
import {getListItemAttributes, NetUsbListItem, ZoneStatus} from "@/ipc/models.ts";

const props = defineProps<{
  deviceId: string,
  zoneStatus: ZoneStatus,
}>()

const entries = ref<NetUsbListItem[]>([])
const loading = ref(false)
const listKey = ref(0)
const totalItems = ref<number | null>(null)
const PAGE_SIZE = 8
const referenceIndex = ref(0)
const depth = ref<number | null>(null)
// Index of list item on which search will be performed.
// When not null the search text prompt is active
const indexToSearch = ref<number | null>(null)
const searchQuery = ref('')
const menuName = ref('')

watch(
  () => [props.zoneStatus.power, props.zoneStatus.input],
  ([np, ni], [op, oi]) => {
    if (np !== op || ni !== oi) resetList()
  }
)

async function load({done}: { done: (status: 'ok' | 'empty' | 'loading' | 'error') => void }) {
  // If we already know the total and have reached it, stop.
  if (totalItems.value !== null && entries.value.length >= totalItems.value) {
    done('empty')
    return
  }

  try {
    loading.value = true

    const listInfo = await getNetUsbListInfo(
        props.deviceId,
        props.zoneStatus.input,
        referenceIndex.value,
        PAGE_SIZE
    )
    depth.value = listInfo.menu_layer
    menuName.value = listInfo.menu_name

    // Update the total count from the API response
    totalItems.value = listInfo.max_line

    // Append new items to the continuous list
    if (listInfo.list_info && listInfo.list_info.length > 0) {
      entries.value.push(...listInfo.list_info)
      referenceIndex.value += PAGE_SIZE
      done('ok')
    } else {
      done('empty')
    }
  } catch (e) {
    console.error(e)
    done('error')
  } finally {
    loading.value = false
  }
}

function resetList() {
  entries.value = []
  referenceIndex.value = 0
  totalItems.value = null
  // Incrementing the key forces v-infinite-scroll to destroy and recreate,
  // triggering the 'load' event immediately for the top of the new list.
  listKey.value++
}

async function entryClicked(i: number) {
  const item = entries.value[i]
  const attrs = getListItemAttributes(item)

  if (attrs.isSearchable) {
    // Ask for the query
    indexToSearch.value = i
    searchQuery.value = ''
  } else if (attrs.isSelectable) {
    // If it's a folder/selectable, we must navigate into itsearchNetUsbList
    loading.value = true
    await controlNetUsbList(props.deviceId, "select", i)
    // We don't fetch here manually; resetting the list triggers the infinite scroll to fetch
    resetList()
  } else {
    // If it's just a song/file, just play it. No need to reload the list.
    await controlNetUsbList(props.deviceId, "play", i)
  }
}

async function doReturn() {
  loading.value = true
  await controlNetUsbList(props.deviceId, "return")
  resetList()
}

async function doSearch() {
  if (!indexToSearch.value) return
  let idx = indexToSearch.value
  indexToSearch.value = null
  await searchNetUsbList(props.deviceId, searchQuery.value, idx)

  resetList()
}

</script>

<template>
  <div>
    <div class="d-flex align-center pa-2">
      <v-btn @click="doReturn" icon="mdi-arrow-left" variant="text" :disabled="loading"></v-btn>
      <span class="text-subtitle-1 ml-2" v-if="menuName !== null">
        {{ menuName }}
      </span>
      <span class="text-caption ml-2" v-if="totalItems !== null">
        {{ entries.length }} / {{ totalItems }} items
      </span>
      <span class="text-caption ml-2" v-if="depth !== null">
        depth {{ depth }}
      </span>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-refresh" @click="resetList" :disabled="loading" variant="text"></v-btn>
    </div>

    <v-divider></v-divider>

    <v-infinite-scroll
        :key="listKey"
        :items="entries"
        :height="500"
        :onLoad="load"
        class="trackList"
    >
      <template v-for="(entry, i) in entries" :key="i">
        <v-list-item
            @click="entryClicked(i)"
            v-ripple
            class="cursor-pointer"
            lines="two"
        >
          <template v-slot:prepend>
            <v-icon v-if="entry.thumbnail" size="40">
              <v-img
                  :src="entry.thumbnail"
                  aspect-ratio="1"
                  width="40"
                  class="rounded"
                  cover
              ></v-img>
            </v-icon>
            <v-icon size="40" v-else-if="getListItemAttributes(entry).isSearchable" icon="mdi-magnify"></v-icon>
            <v-icon size="40" v-else-if="getListItemAttributes(entry).isSelectable" icon="mdi-folder"></v-icon>
            <v-icon size="40" v-else-if="getListItemAttributes(entry).isPlayable" icon="mdi-music-note"></v-icon>
          </template>
          <v-list-item-title>{{ entry.text }}</v-list-item-title>
          <v-list-item-subtitle v-for="(line, idx) in entry.subtexts" :key="idx">
            {{ line }}
          </v-list-item-subtitle>
        </v-list-item>
      </template>

      <template v-slot:empty>
        <div class="pa-4 text-center text-disabled" v-if="totalItems == 0">Empty</div>
      </template>
      <template v-slot:error>
        <div class="pa-4 text-center text-error">
          Error loading data
          <v-btn size="small" variant="text" @click="resetList">Retry</v-btn>
        </div>
      </template>
    </v-infinite-scroll>

    <v-dialog :model-value="indexToSearch !== null" max-width="400px">
      <v-card>
        <v-form @submit.prevent="doSearch" class="pa-2">
          <v-text-field v-model="searchQuery" label="Search query" dense hide-details/>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="indexToSearch = null">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="doSearch">Search</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.trackList {
  overflow: auto;
  overscroll-behavior: none;
}
</style>