<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">歷史記錄</h1>
        <p class="mt-1 text-sm text-base-content/60">
          共 {{ history.length }} 筆記錄
        </p>
      </div>
      <button
        v-if="history.length > 0"
        class="btn btn-error btn-outline btn-sm self-start sm:self-auto"
        @click="confirmClear"
      >
        <FontAwesomeIcon :icon="['fas', 'trash']" />
        清空全部
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="history.length === 0" class="text-center py-16 text-base-content/30">
      <FontAwesomeIcon :icon="['fas', 'clock-rotate-left']" class="text-5xl mb-4" />
      <p class="text-xl font-medium">還沒有複製過任何指令</p>
      <p class="text-sm mt-2">在首頁產生指令並複製後，記錄會顯示在這裡</p>
      <RouterLink to="/" class="btn btn-primary btn-sm mt-6">
        <FontAwesomeIcon :icon="['fas', 'house']" />
        前往首頁
      </RouterLink>
    </div>

    <!-- History list -->
    <div v-else class="space-y-3">
      <div
        v-for="item in history"
        :key="item.id"
        class="card bg-base-200 shadow-sm hover:shadow transition-shadow"
      >
        <div class="card-body p-4 gap-2">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="badge badge-primary badge-sm">{{ item.operationLabel }}</span>
              <span class="text-xs text-base-content/40">{{ formatTime(item.timestamp) }}</span>
            </div>
            <div class="flex gap-1 shrink-0">
              <button
                class="btn btn-ghost btn-xs"
                :class="copiedId === item.id ? 'text-success' : ''"
                @click="copyItem(item)"
                title="複製指令"
              >
                <FontAwesomeIcon :icon="copiedId === item.id ? ['fas', 'check'] : ['fas', 'copy']" />
              </button>
              <button
                class="btn btn-ghost btn-xs text-error"
                @click="historyStore.deleteCommand(item.id)"
                title="刪除此記錄"
              >
                <FontAwesomeIcon :icon="['fas', 'xmark']" />
              </button>
            </div>
          </div>

          <div class="mockup-code text-sm">
            <template v-for="(line, i) in item.command.split('\n')" :key="i">
              <pre :data-prefix="i === 0 ? '$' : '>'"
                ><code>{{ line }}</code></pre>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm clear modal -->
    <dialog ref="clearModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">確認清空全部記錄？</h3>
        <p class="py-4 text-base-content/70">這個操作無法復原，{{ history.length }} 筆記錄將被永久刪除。</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="clearModal.close()">取消</button>
          <button class="btn btn-error" @click="doClear">確認清空</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
const historyStore = useCommandHistoryStore()
const { history } = storeToRefs(historyStore)

const copiedId = ref(null)
const clearModal = ref(null)

const formatTime = (iso) => {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const copyItem = async (item) => {
  try {
    await navigator.clipboard.writeText(item.command)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = item.command
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedId.value = item.id
  setTimeout(() => (copiedId.value = null), 1500)
}

const confirmClear = () => {
  clearModal.value?.showModal()
}

const doClear = () => {
  historyStore.clearHistory()
  clearModal.value?.close()
}
</script>
