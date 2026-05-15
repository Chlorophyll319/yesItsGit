<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl font-bold">Git 指令速查表</h1>
      <p class="mt-2 text-sm md:text-base text-base-content/60">快速查閱常用指令，點擊可一鍵複製</p>
    </div>

    <!-- Category tabs -->
    <div class="flex flex-wrap gap-2 justify-center">
      <button
        class="btn btn-sm"
        :class="activeCategory === null ? 'btn-primary' : 'btn-ghost'"
        @click="activeCategory = null"
      >
        全部
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="btn btn-sm gap-1"
        :class="activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'"
        @click="activeCategory = activeCategory === cat.id ? null : cat.id"
      >
        <FontAwesomeIcon :icon="cat.icon" />
        {{ cat.name }}
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-md mx-auto">
      <label class="input input-bordered flex items-center gap-2">
        <FontAwesomeIcon :icon="['fas', 'magnifying-glass']" class="opacity-50" />
        <input
          v-model="search"
          type="text"
          placeholder="搜尋指令或說明..."
          class="grow"
        />
        <button v-if="search" @click="search = ''" class="opacity-50 hover:opacity-100">
          <FontAwesomeIcon :icon="['fas', 'xmark']" />
        </button>
      </label>
    </div>

    <!-- Results count when filtering -->
    <div v-if="search || activeCategory" class="text-sm text-base-content/50 text-center">
      找到 {{ totalFiltered }} 筆結果
    </div>

    <!-- No results -->
    <div v-if="totalFiltered === 0" class="text-center py-12 text-base-content/30">
      <FontAwesomeIcon :icon="['fas', 'face-frown']" class="text-4xl mb-3" />
      <p class="text-lg font-medium">找不到相關指令</p>
    </div>

    <!-- Categories -->
    <div v-for="category in filteredCategories" :key="category.id" class="space-y-2">
      <div class="flex items-center gap-2">
        <FontAwesomeIcon :icon="category.icon" class="text-primary" />
        <h2 class="text-lg font-bold">{{ category.name }}</h2>
        <span class="badge badge-ghost badge-sm">{{ category.commands.length }}</span>
      </div>

      <div class="overflow-x-auto rounded-box border border-base-300">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th class="w-[45%]">指令</th>
              <th>說明</th>
              <th class="w-20"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="cmd in category.commands" :key="cmd.command">
              <tr class="hover">
                <td>
                  <code class="text-sm font-mono text-primary bg-base-200 px-2 py-0.5 rounded">{{ cmd.command }}</code>
                </td>
                <td class="text-sm text-base-content/80">{{ cmd.desc }}</td>
                <td>
                  <div class="flex gap-1">
                    <button
                      class="btn btn-ghost btn-xs"
                      :class="copiedCmd === cmd.command ? 'text-success' : ''"
                      @click="copyCmd(cmd.command)"
                      title="複製指令"
                    >
                      <FontAwesomeIcon :icon="copiedCmd === cmd.command ? ['fas', 'check'] : ['fas', 'copy']" />
                    </button>
                    <button
                      v-if="cmd.example"
                      class="btn btn-ghost btn-xs"
                      :class="expandedCmd === cmd.command ? 'text-primary' : 'opacity-40'"
                      @click="toggleExpand(cmd.command)"
                      title="查看範例"
                    >
                      <FontAwesomeIcon :icon="['fas', expandedCmd === cmd.command ? 'chevron-up' : 'chevron-down']" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="cmd.example && expandedCmd === cmd.command" class="bg-base-200">
                <td colspan="3" class="py-2 px-4">
                  <div class="flex items-center gap-2 text-sm">
                    <span class="text-base-content/50 shrink-0">範例：</span>
                    <code class="font-mono text-accent">{{ cmd.example }}</code>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categories } from '@/data/cheatsheet.js'

const search = ref('')
const copiedCmd = ref('')
const expandedCmd = ref('')
const activeCategory = ref(null)

const filteredCategories = computed(() => {
  let cats = categories
  if (activeCategory.value) {
    cats = cats.filter((c) => c.id === activeCategory.value)
  }
  if (!search.value.trim()) return cats
  const q = search.value.toLowerCase()
  return cats
    .map((cat) => ({
      ...cat,
      commands: cat.commands.filter(
        (cmd) => cmd.command.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q),
      ),
    }))
    .filter((cat) => cat.commands.length > 0)
})

const totalFiltered = computed(() =>
  filteredCategories.value.reduce((sum, cat) => sum + cat.commands.length, 0),
)

const toggleExpand = (command) => {
  expandedCmd.value = expandedCmd.value === command ? '' : command
}

const copyCmd = async (command) => {
  try {
    await navigator.clipboard.writeText(command)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = command
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedCmd.value = command
  setTimeout(() => (copiedCmd.value = ''), 1500)
}
</script>
